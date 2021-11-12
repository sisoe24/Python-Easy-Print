import * as vscode from "vscode";
import * as utils from "./utils";
import * as path from "path";

class PlaceholdersConverter {
    private editor;

    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    convert(key: string) {
        const obj: { [key: string]: string } = {
            "%f": this.getFilename(),
            "%F": this.getFuncName(),
            "%l": this.getLineNum(),
        };

        return obj[key];
    }

    getFuncName() {
        const currentLine = this.editor.selection.active.line;
        const currentLineSpace =
            this.editor.document.lineAt(currentLine).firstNonWhitespaceCharacterIndex;

        if (currentLineSpace === 0) {
            return "";
        }

        for (let line = currentLine; line >= 0; --line) {
            const lineObj = this.editor.document.lineAt(line);

            const pattern = new RegExp(/def\s(\w+)\(\):/);
            const match = pattern.exec(lineObj.text);

            if (match && currentLineSpace > lineObj.firstNonWhitespaceCharacterIndex) {
                return match[1];
            }
        }
        return "";
    }

    getFilename(): string {
        return path.basename(this.editor.document.fileName);
    }

    getLineNum(): string {
        return String(this.editor.selection.start.line + 1);
    }
}
class PrintConstructor {
    private statement: string;

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
    constructor(statement: string) {
        const statementsTypes: { [statement: string]: string } = {
            print: `print("${utils.symbol} {@} {text} :", {text})`,
            type: `print("${utils.symbol} {@} {text} type :", type({text}))`,
            dir: `print("${utils.symbol} {@} {text} dir :", dir({text}))`,
            repr: `print("${utils.symbol} {@} {text} repr :", repr({text}))`,
            help: "help({text})",
        };

        if (!Object.prototype.hasOwnProperty.call(statementsTypes, statement)) {
            throw new Error(`Invalid statement type: ${typeof statement}`);
        }

        this.statement = statementsTypes[statement];
    }

    private convertPlaceholders(): string {
        let customMsg = utils.pepConfig("customizePrintMessage") as string;
        // todo: match should be dynamic
        const placeholderMatch = customMsg.match(/%[flF]/g);

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

    string(): string {
        const placeholders = this.convertPlaceholders();

        // replacing the mark with no placeholders will leave an extra space to clean
        const replaceMark = placeholders ? "{@}" : "{@} ";

        return this.statement.replace(replaceMark, placeholders);
    }
}

export function logConstructor(statement: string): string {
    const logger = utils.pepConfig("customLogName") || "logging";

    const statementsTypes: { [statement: string]: string } = {
        debug: `${logger}.debug("{text} : %s", {@text})`,
        info: `${logger}.info("{text} : %s", {@text})`,
        warning: `${logger}.warning("{text} : %s", {@text})`,
        error: `${logger}.error("{text} : %s", {@text})`,
        critical: `${logger}.critical("{text} : %s", {@text})`,
    };

    if (!Object.prototype.hasOwnProperty.call(statementsTypes, statement)) {
        throw new Error(`Invalid statement type: ${statement}`);
    }

    if (utils.pepConfig("useReprToLog")) {
        return statementsTypes[statement].replace("{@text}", "repr({text})");
    }

    return statementsTypes[statement].replace("{@text}", "{text}");
}

export function getSelectedText(editor: vscode.TextEditor): string | null {
    function getWordUnderCursor(): string | null {
        const wordUnderCursor = document.getWordRangeAtPosition(editor.selection.active);

        // if no word is under cursor will return undefined, but document.getText(undefined)
        // will return the all document text.
        if (wordUnderCursor) {
            return document.getText(wordUnderCursor);
        }
        return null;
    }
    const document = editor.document;
    const selection = editor.selection;

    return document.getText(selection) || getWordUnderCursor();
}

export function statementConstructor(statement: string): string {
    try {
        return new PrintConstructor(statement).string();
    } catch (error) {
        return logConstructor(statement);
    }
}

export function executeCommand(statement: string): string | void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const text = getSelectedText(editor);
    // TODO: check here if there are more words selected so can iterate over them
    // and create a statement for each.

    if (text) {
        const stringStatement = statementConstructor(statement);
        const insertText = stringStatement.replace(/\{text\}/g, text);

        vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
            editor.edit((editBuilder) => {
                const selection = editor.selection;
                const cursorPosition = selection.start.line;
                const charPosition = selection.start.character;

                editBuilder.insert(new vscode.Position(cursorPosition, charPosition), insertText);
            });
        });
        return insertText;
    }
    return;
}
