// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// TODO: should be nice if user could change this but what if uses simple chars? 
// the delete,comment,uncomment commands will likely create problems
const symbol = "\u{27A1}";


function lineParser(action: string) {

    const editor = vscode.window.activeTextEditor;

    if (!editor) { return; }

    const document = editor.document;
    const documentLines = document.lineCount - 1;

    editor.edit((editBuilder) => {

        for (let line = 0; line <= documentLines; ++line) {

            const lineObj = document.lineAt(line);
            const lineText = lineObj.text.trim();

            // TODO: currently doesnt delete the help message
            const re = new RegExp("print\\(['\"]" + symbol, 'g');

            if (lineText.match(re)) {
                const firstChar = lineObj.firstNonWhitespaceCharacterIndex;

                const startPos = new vscode.Position(line, firstChar);
                const lineRange = new vscode.Range(startPos, lineObj.range.end);

                if (action === 'comment') {
                    if (!lineText.startsWith('#')) {
                        editBuilder.replace(lineRange, `#${lineText} `);
                    }
                } else if (action === 'uncomment') {
                    editBuilder.replace(lineRange, `${lineText.replace('#', '')} `);
                } else if (action === 'delete') {
                    editBuilder.delete(lineObj.rangeIncludingLineBreak);
                }
            }
        }
    });
}

// XXX: maybe it doesnt need to be a class 
class FormatString {
    private editor;

    constructor(editor: vscode.TextEditor) {
        this.editor = editor;

    }

    getString(key: string) {

        const obj: { [key: string]: any } = {
            "%f": this.getFilename(),
            "%l": this.getLineNum(),
            "%t": this.getDate(),
        };

        return obj[key];
    }

    getFilename(): string {
        const filePaths = this.editor.document.fileName.split('/');
        const filename = filePaths[filePaths.length - 1];
        return filename;
    }

    getDate(): string {
        const d = new Date;

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');

        const date = `${day}-${month}-${d.getFullYear()}`;

        const hours = String(d.getHours()).padStart(2, '0');
        const time = `${hours}:${d.getMinutes()}:${d.getSeconds()}`;

        return `${date}T${time}`;
    }

    getLineNum(): number {
        return this.editor.selection.start.line + 1;
    }

}

function customizeLogMessage(msg: string, customMsg: string, editor: vscode.TextEditor): string {


    const formatMatch = customMsg.match(/%[flt]/g);

    if (formatMatch) {
        const formatString = new FormatString(editor);
        formatMatch.forEach(element => {
            customMsg = customMsg.replace(element, formatString.getString(element));
        });
    }

    const atSymbol = msg.indexOf(symbol) + 1;
    const afterSymbol = atSymbol + 1;
    msg = `${msg.slice(0, atSymbol)} ${customMsg} ${msg.slice(afterSymbol)}`;

    return msg;
}

function getConfiguration(): string {
    const config = vscode.workspace.getConfiguration('pythonEasyPrint');
    return config.get('customizeLogMessage') as string;
}

function printStatement(msg: string, type?: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const document = editor.document;
    const selection = editor.selection;

    const selectedWord = document.getText(selection);

    const wordUnderCursor = document.getWordRangeAtPosition(selection.end);
    const wordUnderCursorText = document.getText(wordUnderCursor);

    // TODO: if user has more variables selected from the same line (like `foo, bar`) dir, help and type will fail
    const text = selectedWord || wordUnderCursorText;

    msg = msg.replace(/text/g, text);

    let customMsg = getConfiguration();

    if (customMsg && type !== 'help') {
        // TODO: dont like passing editor as argument 
        msg = customizeLogMessage(msg, customMsg, editor);
    }

    const startPosition = selection.start.line + 1;
    const charPosition = selection.start.character;
    const pos = new vscode.Position(startPosition, charPosition);

    vscode.commands.executeCommand('editor.action.insertLineAfter').then(() => {
        editor.edit(editBuilder => {
            editBuilder.insert(pos, msg);
        });
    });
}



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand('python-easy-print.easyPrint', () => {
        const msg = `print("${symbol} text :", text)`;
        printStatement(msg);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('python-easy-print.easyPrintType', () => {
        const msg = `print("${symbol} text type :", type(text))`;
        printStatement(msg, ')type');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('python-easy-print.easyPrintDir', () => {
        const msg = `print("${symbol} text dir :", dir(text))`;
        printStatement(msg, ')dir');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('python-easy-print.easyPrintRepr', () => {
        const msg = `print("${symbol} text repr :", repr(text))`;
        printStatement(msg, ')repr');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('python-easy-print.easyHelp', () => {
        const msg = 'help(text)';
        printStatement(msg, ')help');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('python-easy-print.commentPrintLines', () => {
        lineParser('comment');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('python-easy-print.uncommentPrintLines', () => {
        lineParser('uncomment');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('python-easy-print.deletePrintLines', () => {
        lineParser('delete');
    }));
}

// this method is called when your extension is deactivated
export function deactivate() { }
