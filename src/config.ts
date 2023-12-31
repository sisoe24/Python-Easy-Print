import * as vscode from "vscode";

/**
 * Get configuration property value.
 *
 * If property name is not found, throws an error.
 *
 * @param property - name of the configuration property to get.
 * @returns - the value of the property.
 */
export function getConfig(property: string): unknown {
    const config = vscode.workspace.getConfiguration("pythonEasyPrint");
    const subConfig = config.get(property);

    if (typeof subConfig === "undefined") {
        throw new Error(`Configuration: ${property} doesn't exist`);
    }

    return subConfig;
}

export function symbol(): string {
    const customSymbol = getConfig("prints.customSymbol") as string;
    return customSymbol || "➡";
}

export function logger(): string {
    const customLogger = getConfig("logging.customLogName") as string;
    return customLogger || "logging";
}

export function getCustomMessage(): string {
    const customMessage = getConfig("prints.customStatement") as string;
    return customMessage || "print('─' * 50, '\\n┌─ %w:%l - {text}\\n└─', {text})";
}