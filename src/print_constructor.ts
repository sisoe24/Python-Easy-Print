import * as vscode from "vscode";
import * as path from "path";

import * as config from "./config";

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
     * Get the workspace relative file path.
     *
     * @returns a string like path or an empty string if could not resolve the path.
     */
    getWorkspacePath(): string {
        const relativePath = vscode.workspace.asRelativePath(
            this.editor.document.uri
        );

        if (!relativePath) {
            return "";
        }
        return relativePath;
    }

    /**
     * Get the function for the print statement.
     *
     * Traverse in reverse the document to search the first matching `def`
     * that is less indented. If statement has no function definition then method
     * will do nothing and return an empty string.
     *
     * @returns the function name or an empty string if no function is found.
     */
    getFuncName(): string {
        const startLine = this.editor.selection.active.line;
        const startLineIndentation =
            this.editor.document.lineAt(
                startLine
            ).firstNonWhitespaceCharacterIndex;

        if (startLineIndentation === 0) {
            return "";
        }

        for (let l = startLine; l >= 0; --l) {
            const line = this.editor.document.lineAt(l);

            if (line.isEmptyOrWhitespace) {
                continue;
            }

            const currentLineIndentation = line.firstNonWhitespaceCharacterIndex;

            const match = /def\s(\w+)\(.*\):/.exec(line.text);
            if (match && startLineIndentation > currentLineIndentation) {
                return match[1];
            }

            if (currentLineIndentation === 0) {
                break;
            }
        }

        return "";
    }

    getFilename(): string {
        return path.basename(this.editor.document.fileName);
    }

    getLineNum(): string {
        const lineNum = (this.editor.selection.start.line as number) + 1;
        return lineNum.toString();
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
            "%w": this.getWorkspacePath(),
        };

        if (!Object.prototype.hasOwnProperty.call(placeholders, key)) {
            throw new Error(`Invalid placeholder type: ${key}`);
        }

        return placeholders[key];
    }
}

/**
 * Print Constructor class for the prints commands.
 */
export class PrintConstructor {
    private statement: string;

    constructor(statement: string) {
        this.statement = statement;
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
            customMsg = config.getCustomMessage();
        } else {
            customMsg = config.getConfig("prints.addCustomMessage") as string;
        }

        // todo: would like to make this automated when adding a new placeholder
        const placeholderMatch = customMsg.match(/%[flFw]/g);

        // TODO: maybe should pass the editor from executeCommand
        const editor = vscode.window.activeTextEditor;
        if (!placeholderMatch || !editor) {
            return customMsg;
        }

        const placeholders = new PlaceholdersConverter(editor);
        placeholderMatch.forEach((placeholder) => {
            customMsg = customMsg.replace(
                placeholder,
                placeholders.convert(placeholder)
            );
        });

        return customMsg;
    }

    /**
     * Get the string statement for the print command.
     *
     * The statement could be a print statement or a logging statement based on the
     * statement type. Placeholders are also converted if present.
     *
     * @returns the template statement: `print("➡ {text} :", {text})`
     */
    string(): string {
        let s = "";

        // statement is a logging statement
        if (this.statement.includes("{logger}")) {
            s = this.statement.replace("{logger}", config.logger());

            if (config.getConfig("logging.useRepr")) {
                s = s.replace("{#text}", "repr({text})");
            } else {
                s = s.replace("{#text}", "{text}");
            }
        } else {
            const placeholders = this.convertPlaceholders();

            // when no placeholders are present, we need to replace the {@} with a space
            const replaceToken = placeholders ? "{@}" : "{@} ";

            s = this.statement
                .replace(replaceToken, placeholders)
                .replace("{symbol}", config.symbol());

            if (config.getConfig("prints.printToNewLine")) {
                s = s.split(":'").join(":\\n'");
            }
        }

        return s;
    }
}

/**
 * Construct the template statement for the command.
 *
 * Based on which statement is supplied as argument, the function will return either
 * a print statement or a log statement.
 *
 * @param statementType name of the statement to get. Could be log or prints
 * @returns the template statement (`print("➡ {text} :", {text})`)
 */
export function printConstructor(statement: string): string {
    return new PrintConstructor(statement).string();
}
