import * as vscode from "vscode";
import { getConfig } from "./config";

import { statementConstructor } from "./print_statements";

/**
 * Select text object class.
 *
 * The class deals with the selection that could be either manually from the user,
 * or automatically from vscode hovering cursor position.
 *
 */
export class SelectedText {
    selection: vscode.Selection;
    document: vscode.TextDocument;
    editor: vscode.TextEditor;

    hoverWord: string;

    lineText: string;
    lineNumber: number;

    /**
     * Init method to initialize the selection.
     *
     * @param editor Current active text editor.
     */
    constructor(editor: vscode.TextEditor) {
        this.editor = editor;

        this.document = editor.document;
        this.selection = editor.selection;

        this.hoverWord = "";

        this.lineNumber = this.selection.active.line;
        this.lineText = this.editor.document.lineAt(this.lineNumber).text;
    }

    /**
     * Add extra match to the selected/hover word.
     *
     * @param lineRange range object to parse its text for the match.
     * @param pattern regex pattern to match inside the range.
     * @returns the match or `null` if no match is made.
     */
    private addExtraMatch(
        lineRange: vscode.Range,
        pattern: RegExp
    ): string | null {
        const lineText = this.editor.document.getText(lineRange);
        const match = pattern.exec(lineText);

        if (!match) {
            return null;
        }

        return match[0];
    }

    /**
     * Include parent calls if any: `foo.bar.foo`.
     *
     * This method will activate only if settings `includeParentCall` is enabled.
     *
     * This will check if the selected/hover word has any parent objects by searching
     * to the left of the word. If yes then it will return till the
     * last valid parent.
     *
     * @param startChar the character position from where to start the line parsing.
     * @param endChar the character position where to end the line parsing.
     * @returns the chain of parents or an empty string if there are none.
     */
    private includeParentCall(startChar: number, endChar: number): string {
        if (!getConfig("hover.includeParentCall")) {
            return "";
        }

        const pattern = new RegExp(
            `(?:\\w+(?:\\(.*?\\))?\\.)*(?<=^.{${startChar}})${this.hoverWord}`,
            "m"
        );

        const startPos = new vscode.Position(this.lineNumber, 0);
        const endPos = new vscode.Position(this.lineNumber, endChar);

        const lineRange = new vscode.Range(startPos, endPos);

        return this.addExtraMatch(lineRange, pattern) || "";
    }

    /**
     * Include function parentheses if any: `foo(x, y)`.
     *
     * This method will activate only if settings `includeParentheses` is enabled.
     *
     * This will check if the selected/hover word has an execution call by searching
     * if there any parentheses to the right of the word. If yes, then it will return
     * the parentheses with everything inside.
     *
     * @param startChar the character position from where to start the line parsing.
     * @returns the function call parenthesis with arguments or an empty string
     * no match was made.
     */
    private includeFuncCall(startChar: number): string {
        if (!getConfig("hover.includeParentheses")) {
            return "";
        }

        const pattern = new RegExp(`(?<=^${this.hoverWord})(\\(.*?\\))`);
        const startPos = new vscode.Position(this.lineNumber, startChar);

        // to check the full line, we must go the the beginning of the next line.
        const nextLine = this.lineNumber + 1;
        const endPos = new vscode.Position(nextLine, 0);

        const lineRange = new vscode.Range(startPos, endPos);
        return this.addExtraMatch(lineRange, pattern) || "";
    }

    /**
     * Get the word and the cursor position.
     *
     * Before returning the text, will also check for the configuration settings
     * and add to selection if settings require so.
     *
     * @returns the text under the cursor or `null` if no text is present.
     */
    private textUnderCursor(): string | null {
        const rangeUnderCursor = this.document.getWordRangeAtPosition(
            this.selection.active
        );

        // document.getText(undefined) will return the all document text.
        if (rangeUnderCursor) {
            this.hoverWord = this.document.getText(rangeUnderCursor);

            const startChar = rangeUnderCursor.start.character;

            const parentCall = this.includeParentCall(
                startChar,
                rangeUnderCursor.end.character
            );
            const funcCall = this.includeFuncCall(startChar);

            return (parentCall || this.hoverWord) + funcCall;
        }
        return null;
    }

    /**
     * Get the selected text.
     *
     * Selected text could be the manual selection or the hover selection.
     *
     * @returns the selected word or `null` no selection.
     */
    private getSelectedText(): string | null {
        return this.document.getText(this.selection) || this.textUnderCursor();
    }

    /**
     * Check if line has an opening code block.
     *
     * A code block starts with a `(`, `[` or `{`. If any of those characters are
     * matched, it assumed to be a code block.
     *
     * @returns true if code contains a code block, false otherwise.
     */
    hasCodeBlock(): boolean {
        const pattern = /[{([]/;
        return pattern.test(this.lineText);
    }

    /**
     * Get the text selection.
     *
     * If multipleStatements option is true, then the original selected text will
     * be split into multiple statements and returned inside the array as different
     * elements.
     *
     * @returns An array with the selected text, or `null` if no text was selected.
     */
    text(): string[] | null {
        const text = this.getSelectedText();

        if (text) {
            let multipleStatements = null;
            if (getConfig("multipleStatements")) {
                multipleStatements = text.match(/\w+(?:(?:\(.*?\))|\.\w*)*/g);
            }
            return multipleStatements || [text];
        }
        return null;
    }
}

export async function executeCommand(
    statement: string
): Promise<string | void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selectedText = new SelectedText(editor);
    const text = selectedText.text();

    if (!text) {
        return;
    }

    for (const match of text) {
        const stringStatement = statementConstructor(statement);
        const insertText = stringStatement.replace(/\{text\}/g, match);

        if (selectedText.hasCodeBlock()) {
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
        }

        await vscode.commands
            .executeCommand("editor.action.insertLineAfter")
            .then(() => {
                editor.edit((editBuilder) => {
                    const selection = editor.selection;
                    const lineNumber = selection.start.line;
                    const charPosition = selection.start.character;

                    editBuilder.insert(
                        new vscode.Position(lineNumber, charPosition),
                        insertText
                    );
                });
            });
    }
}
