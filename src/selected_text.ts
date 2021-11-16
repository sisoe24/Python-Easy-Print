import * as vscode from "vscode";
import * as utils from "./utils";

import { statementConstructor } from "./print_statements";

export function getSelectedText(editor: vscode.TextEditor): string | null {
    function addExtraMatch(lineRange: vscode.Range, pattern: RegExp): string | null {
        const lineText = editor.document.getText(lineRange);
        const match = pattern.exec(lineText);

        if (match) {
            return match[0];
        }
        return null;
    }

    function getTextUnderCursor(): string | null {
        const rangeUnderCursor = document.getWordRangeAtPosition(editor.selection.active);

        // if no word is under cursor will return undefined, but document.getText(undefined)
        // will return the all document text.
        if (rangeUnderCursor) {
            const word = document.getText(rangeUnderCursor);

            const selectedLineNum = rangeUnderCursor.start.line;

            let parentCall = "";
            if (utils.pepConfig("includeParentCall")) {
                const pattern = new RegExp(`(?:\\w+(?:\\(.*\\)|\\.)*)*${word}`);

                const lineRange = new vscode.Range(
                    new vscode.Position(selectedLineNum, 0),
                    new vscode.Position(selectedLineNum, rangeUnderCursor.end.character)
                );

                parentCall = addExtraMatch(lineRange, pattern) || "";
            }

            let funcCall = "";
            if (utils.pepConfig("includeParentheses")) {
                const pattern = new RegExp(`(?<=${word})(\\(.*?\\))`);

                const lineRange = new vscode.Range(
                    new vscode.Position(selectedLineNum, rangeUnderCursor.start.character),
                    new vscode.Position(selectedLineNum + 1, 0)
                );

                funcCall = addExtraMatch(lineRange, pattern) || "";
            }

            return (parentCall || word) + funcCall;
        }

        return null;
    }

    const document = editor.document;
    const selection = editor.selection;

    return document.getText(selection) || getTextUnderCursor();
}

function isCodeBlock(editor: vscode.TextEditor) {
    const line = editor.document.lineAt(editor.selection.start.line);
    if (line.text.match(/=\s[{([]/)) {
        return true;
    }
    return false;
}

export async function executeCommand(statement: string): Promise<string | void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const text = getSelectedText(editor);
    if (!text) {
        return;
    }

    let matchText = [text];
    // TODO: foo.bar(1).bar(2).bar(3) created multiple statements. check why
    if (utils.pepConfig("multipleStatements")) {
        matchText = text.match(/\w+(?:\.\w+)*(?:\(.*?\))?/g) || matchText;
    }

    for (const match of matchText) {
        const stringStatement = statementConstructor(statement);
        const insertText = stringStatement.replace(/\{text\}/g, match);

        if (isCodeBlock(editor)) {
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
        }

        await vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
            editor.edit((editBuilder) => {
                const selection = editor.selection;
                const cursorPosition = selection.start.line;
                const charPosition = selection.start.character;

                editBuilder.insert(new vscode.Position(cursorPosition, charPosition), insertText);
            });
        });
    }
}
