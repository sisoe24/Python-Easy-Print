import * as vscode from "vscode";
import * as utils from "./utils";
import * as doc from "./document_parser";

import { SelectedText } from "./selected_text";
import { printConstructor } from "./print_constructor";
import { PRINT_COMMANDS, DOCUMENT_COMMANDS } from "./statements";

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
        if (selectedText.hasCodeBlock()) {
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
            await vscode.commands.executeCommand("editor.action.jumpToBracket");
        }

        await vscode.commands
            .executeCommand("editor.action.insertLineAfter")
            .then(() => {
                const stringStatement = printConstructor(statement);
                const insertText = stringStatement.replace(/\{text\}/g, match);

                editor.edit((editBuilder) => {
                    const { selection } = editor;

                    editBuilder.insert(
                        new vscode.Position(
                            selection.start.line,
                            selection.start.character
                        ),
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
