import * as vscode from "vscode";
import * as utils from "./utils";

import { statementConstructor } from "./print_statements";

class SelectedText {
    selection: vscode.Selection;
    document: vscode.TextDocument;
    editor: vscode.TextEditor;

    hoverWord: string | undefined;

    lineText: string;
    lineNumber: number;

    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
        this.document = editor.document;
        this.selection = editor.selection;

        this.lineNumber = this.selection.active.line;
        this.lineText = this.editor.document.lineAt(this.lineNumber).text;
    }

    private addExtraMatch(lineRange: vscode.Range, pattern: RegExp): string | null {
        const lineText = this.editor.document.getText(lineRange);
        const match = pattern.exec(lineText);

        if (match) {
            return match[0];
        }
        return null;
    }

    private includeParentCall(rangeUnderCursor: vscode.Range): string {
        let parentCall = "";

        if (utils.pepConfig("includeParentCall")) {
            const pattern = new RegExp(`(?:\\w+(?:\\(.*\\)|\\.)*)*${this.hoverWord}`);

            const lineRange = new vscode.Range(
                new vscode.Position(this.lineNumber, 0),
                new vscode.Position(this.lineNumber, rangeUnderCursor.end.character)
            );

            parentCall = this.addExtraMatch(lineRange, pattern) || "";
        }
        return parentCall;
    }

    private includeFuncCall(rangeUnderCursor: vscode.Range): string {
        let funcCall = "";
        if (utils.pepConfig("includeParentheses")) {
            const pattern = new RegExp(`(?<=${this.hoverWord})(\\(.*?\\))`);

            const lineRange = new vscode.Range(
                new vscode.Position(this.lineNumber, rangeUnderCursor.start.character),
                new vscode.Position(this.lineNumber + 1, 0)
            );

            funcCall = this.addExtraMatch(lineRange, pattern) || "";
        }
        return funcCall;
    }

    private textUnderCursor(): string | null {
        const rangeUnderCursor = this.document.getWordRangeAtPosition(this.selection.active);

        // document.getText(undefined) will return the all document text.
        if (rangeUnderCursor) {
            this.hoverWord = this.document.getText(rangeUnderCursor);

            const parentCall = this.includeParentCall(rangeUnderCursor);
            const funcCall = this.includeFuncCall(rangeUnderCursor);

            return (parentCall || this.hoverWord) + funcCall;
        }
        return null;
    }

    private getSelectedText(): string | null {
        return this.document.getText(this.selection) || this.textUnderCursor();
    }

    hasCodeBlock() {
        return Boolean(this.lineText.match(/=\s[{([]/));
    }

    text(): string[] | null {
        const text = this.getSelectedText();

        if (text) {
            if (utils.pepConfig("multipleStatements")) {
                return text.match(/\w+(?:(?:\(.*?\))|\.\w*)*/g) || [text];
            }
        }
        return null;
    }
}

export async function executeCommand(statement: string): Promise<string | void> {
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

        await vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
            editor.edit((editBuilder) => {
                const selection = editor.selection;
                const lineNumber = selection.start.line;
                const charPosition = selection.start.character;

                editBuilder.insert(new vscode.Position(lineNumber, charPosition), insertText);
            });
        });
    }
}
