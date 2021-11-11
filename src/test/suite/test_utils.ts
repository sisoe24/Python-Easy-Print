import * as vscode from "vscode";
import * as path from "path";
import { writeFileSync } from "fs";

/**
 * Some tests will need to wait for vscode to register the actions. An example will
 * be creating/killing terminals and configuration update.
 *
 * @param milliseconds - time to sleep
 * @returns
 */
export const sleep = (milliseconds: number): Promise<unknown> => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

/**
 * Configuration changes require async/await operation to let vscode register
 * the action.
 *
 * @param name - name of the configuration property to update.
 * @param value - the new value for the property.
 */
export async function updateConfig(name: string, value: unknown): Promise<void> {
    const config = vscode.workspace.getConfiguration("pythonEasyPrint");
    await config.update(name, value, vscode.ConfigurationTarget.Workspace);
}

/**
 * Get the tmp folder path in rootDir.
 *
 * @param file - optional file name to get from the demo folder.
 * @returns path of the tmp directory or undefined if it couldn't resolve.
 */
export function getDemoFolder(file?: string): string {
    const cwd = vscode.extensions.getExtension("virgilsisoe.python-easy-print")?.extensionPath;
    if (cwd) {
        const demoPath = path.join(cwd, "demo");

        // TODO: should check if file exists first.
        if (file) {
            return path.join(demoPath, file);
        }
        return demoPath;
    }

    // TODO: this does not throw an error when called by setup/teardown
    throw new Error("Could not resolve the tmp folder path");
}

/**
 * Clean the settings.json file inside the demo folder.
 *
 * Method will wait for 200ms before completing. This is to give enough time to
 * vscode to register the changes.
 */
export async function cleanSettings(): Promise<void> {
    const settings = getDemoFolder(path.join(".vscode", "settings.json"));
    writeFileSync(settings, "{}");
    // await sleep(100);
}

/**
 * Clean the settings.json file inside the demo folder.
 *
 * Method will wait for 200ms before completing. This is to give enough time to
 * vscode to register the changes.
 */
export async function cleanDemoFile(): Promise<void> {
    const settings = getDemoFolder("demo_file.py");
    writeFileSync(settings, "");
    await sleep(50);
}

/**
 * Open and focus the demo file.
 *
 * Will also put cursor at the beginning of the file so the placeholder %l which
 * should be: 1
 *
 */
export async function focusDemoFile(): Promise<void> {
    const demoFile = getDemoFolder("demo_file.py");
    const document = await vscode.workspace.openTextDocument(demoFile);
    await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One });

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        // put cursor at line 1, char 0
        const startOfFile = new vscode.Position(0, 0);
        editor.selection = new vscode.Selection(startOfFile, startOfFile);
    }
}

/**
 * Write content to the demo file.
 *
 * @param lines string of objects to write into the file so to make it clear to
 * understand which line of text should check for tests. Example: `{line1: 'hello'}`
 */
export async function writeDemoFile(lines: object) {
    await cleanDemoFile();

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        let msg = "";

        for (const v of Object.values(lines)) {
            msg += v;
        }

        const startOfFile = new vscode.Position(0, 0);
        await editor.edit((editBuilder) => {
            // replace all text
            editBuilder.replace(
                new vscode.Range(startOfFile, new vscode.Position(editor.document.lineCount, 0)),
                msg
            );
        });

        // deselect any text
        editor.selection = new vscode.Selection(startOfFile, startOfFile);
    }
}
