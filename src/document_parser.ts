import * as vscode from "vscode";
import * as utils from "./utils";

export function documentParser(action: string) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    const document = editor.document;

    editor.edit((editBuilder) => {
        for (let line = 0; line <= document.lineCount - 1; ++line) {
            const lineObj = document.lineAt(line);
            const lineText = lineObj.text.trim();

            const symbolMatch = new RegExp("print\\(['\"]" + utils.symbol);
            if (!lineText.match(symbolMatch)) {
                continue;
            }

            const firstChar = lineObj.firstNonWhitespaceCharacterIndex;

            const startPos = new vscode.Position(line, firstChar);
            const lineRange = new vscode.Range(startPos, lineObj.range.end);

            switch (action) {
                case "comment":
                    // comment lines only if they are not already commented.
                    if (!lineText.startsWith("#")) {
                        editBuilder.replace(lineRange, `#${lineText} `);
                    }
                    break;
                case "uncomment":
                    editBuilder.replace(lineRange, `${lineText.replace("#", "")} `);
                    break;
                case "delete":
                    editBuilder.delete(lineObj.rangeIncludingLineBreak);
                    break;
                default:
                    break;
            }
        }
    });
}

export function commentLines() {
    console.log();
}

export function executeCommand(action: string) {
    documentParser(action);
}
