import * as vscode from "vscode";
import * as utils from "./utils";
import * as path from "path";

/**
 * Convert placeholders symbols from the configuration settings.
 */
export class PlaceholdersConverter {
    private editor;

    /**
     * Init method to initialize the class.
     *
     * @param editor vscode active text editor
     */
    constructor(editor: vscode.TextEditor) {
        this.editor = editor;
    }

    /**
     * Convert the placeholders symbols from the configuration settings.
     *
     * @param key the placeholder key to convert:
     * `%f`: filename, `%F`: function name, `%l`: line number.
     * @returns the converted placeholder.
     */
    convert(key: string): string {
        const placeholders: { [key: string]: string } = {
            "%f": this.getFilename(),
            "%F": this.getFuncName(),
            "%l": this.getLineNum(),
        };

        if (!Object.prototype.hasOwnProperty.call(placeholders, key)) {
            throw new Error(`Invalid placeholder type: ${key}`);
        }

        return placeholders[key];
    }

    /**
     * Get the function for the print statement.
     *
     * Method will traverse n reverse the document to search the first matching `def`
     * that is less indented. If statement has no function definition then method
     * will do nothing and return an empty string.
     *
     * @returns the function name or an empty string if no function is found.
     */
    getFuncName(): string {
        const startLine = this.editor.selection.active.line;
        const startLineIndentation =
            this.editor.document.lineAt(startLine).firstNonWhitespaceCharacterIndex;

        if (startLineIndentation === 0) {
            return "";
        }

        for (let line = startLine; line >= 0; --line) {
            const lineObj = this.editor.document.lineAt(line);

            const pattern = new RegExp(/def\s(\w+)\(.*\):/);
            const match = pattern.exec(lineObj.text);

            const currentLineIndentation = lineObj.firstNonWhitespaceCharacterIndex;

            if (match && startLineIndentation > currentLineIndentation) {
                return match[1];
            }

            if (currentLineIndentation === 0) {
                break;
            }
        }
        return "";
    }

    /**
     * Get the file name.
     *
     * @returns basename of the current active file text with extension.
     */
    getFilename(): string {
        return path.basename(this.editor.document.fileName);
    }

    /**
     * Get line position of the cursor.
     *
     * @returns string line number of the cursor last active position: "1".
     */
    getLineNum(): string {
        const lineNum = (this.editor.selection.start.line as number) + 1;
        return lineNum.toString();
    }
}

/**
 * Print Constructor class for the prints commands.
 */
export class PrintConstructor {
    private statement: string;
    private symbol: string;

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
     */
    constructor(statement: string) {
        this.symbol = utils.symbol();

        // TODO: dont really need to create the statements at each class init
        const statementsTypes: { [statement: string]: string } = {
            print: `print("${this.symbol} {@} {text} :", {text})`,
            type: `print("${this.symbol} {@} {text} type :", type({text}))`,
            dir: `print("${this.symbol} {@} {text} dir :", dir({text}))`,
            repr: `print("${this.symbol} {@} {text} repr :", repr({text}))`,
            help: "help({text})",
            custom: "{@}",
        };

        if (!Object.prototype.hasOwnProperty.call(statementsTypes, statement)) {
            throw new Error(`Invalid statement type: ${typeof statement}`);
        }

        if (utils.pepConfig("prints.printToNewLine")) {
            this.statement = statementsTypes[statement].replace(/(?<=:)/, "\\n");
        } else {
            this.statement = statementsTypes[statement];
        }
    }

    /**
     * Convert the placeholders from the settings option.
     *
     * If there are no custom placeholders will do nothing and return an empty string.
     * If placeholders are present will convert them via the class: `PlaceholdersConverter`
     *
     * @returns the converted placeholders
     */
    convertPlaceholders(): string {
        let customMsg: string;

        if (this.statement === "{@}") {
            customMsg = utils.pepConfig("prints.customStatement") as string;
            customMsg = customMsg.replace(/{symbol}/g, this.symbol);
        } else {
            customMsg = utils.pepConfig("prints.addCustomMessage") as string;
        }

        // todo: match should be based on settings
        const placeholderMatch = customMsg.match(/%[flF]/g);

        // TODO: maybe should pass the editor from executeCommand
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

    /**
     * Get the string statement for the print command.
     *
     * Will also convert the placeholders from the configuration settings if any.
     *
     * @returns the template statement: `print("➡ {text} :", {text})`
     */
    string(): string {
        const text = this.convertPlaceholders();

        // replacing the mark with no placeholders will leave an extra space to clean
        const replaceToken = text ? "{@}" : "{@} ";
        return this.statement.replace(replaceToken, text);
    }
}

/**
 * Construct the logging statement to print when invoking the command.
 *
 * Before returning the statement, will also replace the placeholder based on the
 * `useReprToLog` configuration setting.
 *
 * @param statement name of the logging level: `debug, info, warning, error, critical`.
 * @returns the template statement: `LOGGER.debug("{text} : %s", repr({text}))`
 */
export function logConstructor(statement: string): string {
    const logger = (utils.pepConfig("logging.customLogName") as string) || "logging";

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

    if (utils.pepConfig("logging.useRepr")) {
        return statementsTypes[statement].replace("{@text}", "repr({text})");
    }

    return statementsTypes[statement].replace("{@text}", "{text}");
}

/**
 * Construct the template statement for the command.
 *
 * Based on which statement is supplied as argument, the function will return either
 * a print statement or a log statement.
 *
 * @param statement name of the statement to get. Could be log or prints
 * @returns the template statement.
 */
export function statementConstructor(statement: string): string {
    try {
        if (statement === "custom" && !utils.pepConfig("prints.customStatement")) {
            vscode.window.showWarningMessage("No Custom Message supplied");
            return "";
        }

        return new PrintConstructor(statement).string();
    } catch (error) {
        return logConstructor(statement);
    }
}
