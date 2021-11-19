import * as vscode from "vscode";

export const symbol = "\u{27A1}";

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

    const startupStatement = "# coding: utf-8\nfrom __future__ import print_function\n";

    await editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(0, 0), startupStatement);
    });

    return startupStatement;
}
