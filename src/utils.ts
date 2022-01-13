import * as vscode from "vscode";

export const py2Statement = "# coding: utf-8\nfrom __future__ import print_function\n";

/**
 * Get the symbol to insert inside the print statements.
 *
 * If no custom symbol is created by user, then a default one (➡) will be returned.
 *
 * @returns a unicode symbol
 */
export function symbol(): string {
    const customSymbol = pepConfig("prints.customSymbol") as string;
    return customSymbol || "➡";
}

/**
 * Get configuration property value.
 *
 * If property name is not found, throws an error.
 *
 * @param property - name of the configuration property to get.
 * @returns - the value of the property.
 */
export function pepConfig(property: string): unknown {
    const config = vscode.workspace.getConfiguration("pythonEasyPrint");
    const subConfig = config.get(property);

    if (typeof subConfig === "undefined") {
        throw new Error(`Configuration: ${property} doesn't exist`);
    }

    return subConfig;
}

/**
 * Insert python 2 statement for print and unicode.
 *
 * Insert at the beginning of the file 2 python statements that will enable the
 * to use the python 3 print function and display an utf-8 character.
 *
 * `# coding: utf-8`
 * `from __future__ import print_function`
 *
 * @returns void if command is called with no active text editor.
 */
export async function initPrintPython2(): Promise<void | string> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    await editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(0, 0), py2Statement);
    });
}
