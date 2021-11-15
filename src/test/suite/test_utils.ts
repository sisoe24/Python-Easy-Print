import * as vscode from "vscode";
import * as path from "path";
import { writeFileSync, existsSync } from "fs";

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
 * @param file - optional file name to get from the demo folder. If file does not exist,
 * will get created.
 * @returns path of the tmp directory or undefined if it couldn't resolve.
 */
export function getDemoFolder(file?: string): string {
    const cwd = vscode.extensions.getExtension("virgilsisoe.python-easy-print")?.extensionPath;
    if (cwd) {
        const demoPath = path.join(cwd, "demo");

        if (file) {
            const filepath = path.join(demoPath, file);
            if (!existsSync(filepath)) {
                writeFileSync(filepath, "");
            }
            return filepath;
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
 *
 * Will also put cursor at the beginning of the file so the placeholder %l which
 * should be: 1
 *
 */

/**
 * Open and focus a demo file.
 *
 * @param filename the name of a file to open.
 * @param line optional line number for the cursor to start at. Defaults to `0` which would be line `1`.
 * @param char optional character position for the cursor to start at when opening the file.
 * Defaults to `0`
 */
export async function focusDemoFile(filename: string, line = 0, char = 0): Promise<void> {
    const demoFile = getDemoFolder(filename);
    const document = await vscode.workspace.openTextDocument(demoFile);
    await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One });

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const startOfFile = new vscode.Position(line, char);
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
