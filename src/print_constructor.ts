import * as vscode from "vscode";
import * as path from "path";

import * as config from "./config";


/**
 * Convert placeholders symbols from the configuration settings.
 */
export class PlaceholdersConverter {
    private editor;
    public statement: string;

    /**
     * Init method to initialize the class.
     *
     * @param editor vscode active text editor
     */
    constructor(statement: string) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error("No active text editor");
        }

        this.statement = statement;
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

            const currentLineIndentation =
                line.firstNonWhitespaceCharacterIndex;

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
    private convertPlaceholder(key: string): string {
        const placeholders: { [key: string]: string } = {
            "%f": this.getFilename(),
            "%F": this.getFuncName(),
            "%l": this.getLineNum(),
            "%w": this.getWorkspacePath(),
        };
        return placeholders[key];
    }

    /**
     * Convert the placeholders from the settings option.
     *
     * If there are no custom placeholders will do nothing and return an empty string.
     * If placeholders are present will convert them via the class: `PlaceholdersConverter`
     *
     * @returns the converted placeholders
     */
    convert(): string {
        let customMsg = "";

        if (this.statement === "{@}") {
            customMsg = config.getCustomMessage();
        } else {
            customMsg = config.getConfig("prints.addCustomMessage") as string;
        }

        const placeholderMatch = customMsg.match(/%[flFw]/g);
        if (!placeholderMatch) {
            return customMsg;
        }

        placeholderMatch.forEach((placeholder) => {
            customMsg = customMsg.replace(
                placeholder,
                this.convertPlaceholder(placeholder)
            );
        });

        return customMsg;
    }
}

/**
 * Get the string statement for the print command.
 *
 * The statement could be a print statement or a logging statement based on the
 * statement type. Placeholders are also converted if present.
 *
 * @returns the template statement: `print("➡ {text} :", {text})`
 */
export function printConstructorWithPlaceholders(
    statement: string,
    placeholders: string,
): string {
    let s = "";

    // statement is a logging statement
    if (statement.includes("{logger}")) {
        s = statement.replace("{logger}", config.logger());

        if (config.getConfig("logging.useRepr")) {
            s = s.replace("{#text}", "repr({text})");
        } else {
            s = s.replace("{#text}", "{text}");
        }
    } else {
        // when no placeholders are present, we need to replace the {@} with a space
        const replaceToken = placeholders ? "{@}" : "{@} ";

        s = statement
            .replace(replaceToken, placeholders)
            .replace("{symbol}", config.symbol());

        if (config.getConfig("prints.printToNewLine")) {
            s = s.split(":'").join(":\\n'");
        }
    }

    return s;
}

export function printConstructor(statement: string) {
    const placeholders = new PlaceholdersConverter(statement);
    return printConstructorWithPlaceholders(
        statement,
        placeholders.convert()
    );
}
