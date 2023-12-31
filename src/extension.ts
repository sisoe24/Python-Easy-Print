import * as vscode from "vscode";
import * as utils from "./utils";
import * as doc from "./document_parser";
import { SelectedText } from "./selected_text";
import { ALL_STATEMENTS as PRINT_COMMANDS, DOCUMENT_STATEMENTS as DOCUMENT_COMMANDS } from "./statements";
import { printConstructor } from "./print_constructor";


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
        const stringStatement = printConstructor(statement);
        const insertText = stringStatement.replace(/\{text\}/g, match);

        if (selectedText.hasCodeBlock()) {
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
        }

        await vscode.commands
            .executeCommand("editor.action.insertLineAfter")
            .then(() => {
                editor.edit((editBuilder) => {
                    const {selection} = editor;
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

export function activate(context: vscode.ExtensionContext): void {
    // Print Commands
    for (const [key, statement] of Object.entries(PRINT_COMMANDS)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(statement.command, () => {
                executeCommand(statement.statement);
            })
        );
    }

    // Document parser
    for (const [action, command] of Object.entries(DOCUMENT_COMMANDS)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => {
                void doc.executeCommand(action);
            })
        );
    }

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "python-easy-print.easyPrintPy2",
            () => {
                void utils.initPrintPython2();
            }
        )
    );
}
