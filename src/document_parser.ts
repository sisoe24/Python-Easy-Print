import * as vscode from "vscode";
import * as utils from "./utils";

type LineObject = {
    text: string;
    range: vscode.Range;
    rangeToNewLine: vscode.Range;
};

/**
 * Parse the entire document text and return an array of LineObject.
 *
 * @param editor vscode active text editor
 * @return lines An array of LineObject.
 */
export function documentParser(editor: vscode.TextEditor): Array<LineObject> {
    const document = editor.document;
    const symbol = utils.symbol();

    const lines = [];

    for (let line = 0; line <= document.lineCount - 1; ++line) {
        const lineObj = document.lineAt(line);
        const lineText = lineObj.text.trim();

        // TODO: currently if custom message has a custom function, regex will not match
        const symbolMatch = new RegExp("print\\(['\"]" + symbol);
        if (!lineText.match(symbolMatch)) {
            continue;
        }

        const startPos = new vscode.Position(line, lineObj.firstNonWhitespaceCharacterIndex);

        lines.push({
            text: lineText,
            range: new vscode.Range(startPos, lineObj.range.end),
            rangeToNewLine: lineObj.rangeIncludingLineBreak,
        });
    }
    return lines;
}

/**
 * Parse entire file and comment lines created by extension
 *
 * @param editor vscode active text editor
 */
export function commentLines(editor: vscode.TextEditor): void {
    editor.edit((editBuilder) => {
        for (const line of documentParser(editor)) {
            if (!line.text.startsWith("#")) {
                editBuilder.replace(line.range, `# ${line.text}`);
            }
        }
    });
}

/**
 * Parse entire file and uncomment lines created by extension
 *
 * @param editor vscode active text editor
 */
export function uncommentLines(editor: vscode.TextEditor): void {
    editor.edit((editBuilder) => {
        for (const line of documentParser(editor)) {
            editBuilder.replace(line.range, `${line.text.replace("# ", "").trim()}`);
        }
    });
}

/**
 * Parse entire file and delete lines created by extension
 *
 * @param editor vscode active text editor
 */
export function deleteLines(editor: vscode.TextEditor): void {
    editor.edit((editBuilder) => {
        for (const line of documentParser(editor)) {
            editBuilder.delete(line.rangeToNewLine);
        }
    });
}

/**
 * Execute the specified command.
 *
 * @param action name of the action to be executed: `comment`, `uncomment` or `delete`.
 * If action is not valid will throw an error.
 * @returns
 */
export function executeCommand(action: string): void {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    switch (action) {
        case "comment":
            commentLines(editor);
            break;
        case "uncomment":
            uncommentLines(editor);
            break;
        case "delete":
            deleteLines(editor);
            break;
        default:
            throw new Error(`Command: ${action} not implemented`);
    }
}
