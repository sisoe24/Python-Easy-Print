import * as vscode from "vscode";
import * as utils from "./utils";
import * as path from "path";

export const symbol = "\u{27A1}";

class PlaceholdersConverter {
    private editor;

    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    convert(key: string) {
        const obj: { [key: string]: string } = {
            "%f": this.getFilename(),
            "%l": this.getLineNum(),
            "%t": this.getDate(),
        };

        return obj[key];
    }

    getFilename(): string {
        return path.basename(this.editor.document.fileName);
    }

    getDate(): string {
        const _date = new Date();
        const date = _date.toLocaleDateString();
        const time = _date.toLocaleTimeString();
        return `${date}T${time}`.replace(" ", "");
    }

    getLineNum(): string {
        return String(this.editor.selection.start.line + 1);
    }
}

/**
 * Get the basic string representation of a type of print statement.
 *
 * The type of prints are: `print`, `dir`, `type`, `repr` and `help`. Besides help,
 * all of the statements are structured the same way:
 *
 * `print("symbol {text} type :", {text})` where `{text}` is a placeholder for the
 * text that is going to be inserted once the command takes effect. The symbol is
 * utf-8 character.
 *
 * @param statement type of print statement to get
 * @returns
 */
export function getPrintStatement(statement: string): string {
    const statementsTypes: { [statement: string]: string } = {
        print: `print("${symbol} {@} {text} :", {text})`,
        type: `print("${symbol} {@} {text} type :", type({text}))`,
        dir: `print("${symbol} {@} {text} dir :", dir({text}))`,
        repr: `print("${symbol} {@} {text} repr :", repr({text}))`,
        help: "help({text})",
    };
    if (!Object.prototype.hasOwnProperty.call(statementsTypes, statement)) {
        throw new Error(`Invalid statement type: ${statement}`);
    }
    return statementsTypes[statement];
}

export function convertPlaceholders() {
    let customMsg = utils.pepConfig("customizeLogMessage") as string;
    const placeholderMatch = customMsg.match(/%[flt]/g);

    const editor = vscode.window.activeTextEditor;

    if (!placeholderMatch || !editor) {
        return customMsg;
    }

    const placeholders = new PlaceholdersConverter(editor);
    placeholderMatch.forEach((placeholder) => {
        customMsg = customMsg.replace(placeholder, placeholders.convert(placeholder));
    });

    return customMsg;
}

export function constructStatement(text: string, statement: string) {
    const printStatement = getPrintStatement(statement);
    const placeholders = convertPlaceholders();

    const replacePlaceholders = printStatement.replace("{@}", placeholders);
    const replaceText = replacePlaceholders.replace(/\{text\}/g, text);

    return replaceText;
}

export function printStatement(statement: string): string {
    console.log("print statement: " + statement);
    return "yo";
}
