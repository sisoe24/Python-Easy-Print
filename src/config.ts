import * as vscode from "vscode";

export const DEFAULT_CONFIG = {
    printSymbol : "print",
    customStatement : "print('{symbol} {text}:', {text})",
};

/**
 * Get configuration property value.
 *
 * If property name is not found, throws an error.
 *
 * @param property - name of the configuration property to get.
 * @returns - the value of the property.
 */
export function getConfig(property: string, missing?: unknown): unknown {
    const config = vscode.workspace.getConfiguration("pythonEasyPrint");
    const subConfig = config.get(property);

    if (typeof subConfig === "undefined") {
        if (missing) {
            console.warn(`Configuration: ${property} doesn't exist`);
            return missing;
        }
        throw new Error(`Configuration: ${property} doesn't exist`);
    }

    return subConfig;
}
