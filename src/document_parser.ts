import * as vscode from "vscode";
import * as utils from "./utils";

export function* documentParser(editor: vscode.TextEditor) {
    const document = editor.document;

    for (let line = 0; line <= document.lineCount - 1; ++line) {
        const lineObj = document.lineAt(line);
        const lineText = lineObj.text.trim();

        const symbolMatch = new RegExp("print\\(['\"]" + utils.symbol);
        if (!lineText.match(symbolMatch)) {
            continue;
        }

        const startPos = new vscode.Position(line, lineObj.firstNonWhitespaceCharacterIndex);

        yield {
            text: lineText,
            range: new vscode.Range(startPos, lineObj.range.end),
            rangeToNewLine: lineObj.rangeIncludingLineBreak,
        };
    }
}

export function commentLines(editor: vscode.TextEditor) {
    editor.edit((editBuilder) => {
        for (const line of documentParser(editor)) {
            if (!line.text.startsWith("#")) {
                editBuilder.replace(line.range, `# ${line.text}`);
            }
        }
    });
}

export function uncommentLines(editor: vscode.TextEditor) {
    editor.edit((editBuilder) => {
        for (const line of documentParser(editor)) {
            editBuilder.replace(line.range, `${line.text.replace("# ", "").trim()} `);
        }
    });
}

export function deleteLines(editor: vscode.TextEditor) {
    editor.edit((editBuilder) => {
        for (const line of documentParser(editor)) {
            editBuilder.delete(line.rangeToNewLine);
        }
    });
}

export function executeCommand(action: string) {
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
            break;
    }
}
