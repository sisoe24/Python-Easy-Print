import * as vscode from "vscode";
import * as utils from "./utils";
import * as selectedText from "./selected_text";
import * as doc from "./document_parser";

const printCommands = {
    print: "python-easy-print.easyPrint",
    type: "python-easy-print.easyPrintType",
    dir: "python-easy-print.easyPrintDir",
    repr: "python-easy-print.easyPrintRepr",
    help: "python-easy-print.easyHelp",
};

const logCommands = {
    debug: "python-easy-print.easyLogDebug",
    info: "python-easy-print.easyLogInfo",
    warning: "python-easy-print.easyLogWarning",
    error: "python-easy-print.easyLogError",
    critical: "python-easy-print.easyLogCritical",
};

const documentCommands = {
    comment: "python-easy-print.commentPrintLines",
    uncomment: "python-easy-print.uncommentPrintLines",
    delete: "python-easy-print.deletePrintLines",
};

export function activate(context: vscode.ExtensionContext): void {
    // Print Commands
    for (const [statement, command] of Object.entries(printCommands)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => {
                selectedText.executeCommand(statement);
            })
        );
    }

    // Log Commands
    for (const [statement, command] of Object.entries(logCommands)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => {
                selectedText.executeCommand(statement);
            })
        );
    }

    
    // Document parser
    for (const [action, command] of Object.entries(documentCommands)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, () => {
                doc.executeCommand(action);
            })
        );
    }

    // Misc
    context.subscriptions.push(
        vscode.commands.registerCommand("python-easy-print.easyPrintPy2", () => {
            utils.initPrintPython2();
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    //TODO : do I need this?
}
