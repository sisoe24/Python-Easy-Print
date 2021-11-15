import * as vscode from "vscode";
import * as utils from "./utils";

import { statementConstructor } from "./print_statements";

export function getSelectedText(editor: vscode.TextEditor): string | null {
    function addExtraMatch(rangeUnderCursor: vscode.Range, pattern: RegExp): string | null {
        const line = document.lineAt(rangeUnderCursor.start.line).text;
        const match = pattern.exec(line);

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
            let word = document.getText(rangeUnderCursor);

            if (utils.pepConfig("includeParentCall")) {
                const pattern = new RegExp("(?:(?:\\w+\\.)*)" + word);
                word = addExtraMatch(rangeUnderCursor, pattern) || word;
            }

            if (utils.pepConfig("includeParenthesis")) {
                const pattern = new RegExp(word + "\\(.*\\)");
                word = addExtraMatch(rangeUnderCursor, pattern) || word;
            }

            return word;
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
