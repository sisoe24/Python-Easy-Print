import * as vscode from "vscode";
import * as utils from "./utils";
import * as prints from "./print_statements";

// TODO: should be nice if user could change this but what if uses simple chars?
// the delete,comment,uncomment commands will likely create problems
// TODO: this also creates problem in python2
const symbol = "\u{27A1}";

function documentParser(action: string) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    const document = editor.document;
    const documentLines = document.lineCount - 1;

    editor.edit((editBuilder) => {
        for (let line = 0; line <= documentLines; ++line) {
            const lineObj = document.lineAt(line);
            const lineText = lineObj.text.trim();

            // TODO: currently doesnt delete the help message
            const re = new RegExp("print\\(['\"]" + symbol, "g");

            if (lineText.match(re)) {
                const firstChar = lineObj.firstNonWhitespaceCharacterIndex;

                const startPos = new vscode.Position(line, firstChar);
                const lineRange = new vscode.Range(startPos, lineObj.range.end);

                if (action === "comment") {
                    if (!lineText.startsWith("#")) {
                        editBuilder.replace(lineRange, `#${lineText} `);
                    }
                } else if (action === "uncomment") {
                    editBuilder.replace(lineRange, `${lineText.replace("#", "")} `);
                } else if (action === "delete") {
                    editBuilder.delete(lineObj.rangeIncludingLineBreak);
                }
            }
        }
    });
}

export function activate(context: vscode.ExtensionContext): void {
    const printCommands = {
        print: "python-easy-print.easyPrint",
        type: "python-easy-print.easyPrintType",
        dir: "python-easy-print.easyPrintDir",
        repr: "python-easy-print.easyPrintRepr",
        help: "python-easy-print.easyHelp",
    };

    for (const [statement, command] of Object.entries(printCommands)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => {
                prints.executeCommand(statement);
            })
        );
    }

    context.subscriptions.push(
        vscode.commands.registerCommand("python-easy-print.easyPrintPy2", () => {
            utils.initPrintPython2();
        })
    );

    const documentCommands = {
        comment: "python-easy-print.commentPrintLines",
        uncomment: "python-easy-print.uncommentPrintLines",
        delete: "python-easy-print.deletePrintLines",
    };

    for (const [action, command] of Object.entries(documentCommands)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => {
                documentParser(action);
            })
        );
    }
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    //TODO : do I need this?
}
