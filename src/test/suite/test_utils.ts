import * as vscode from "vscode";
import * as path from "path";
import { writeFileSync, createWriteStream } from "fs";

export const demoPath = path.join(path.resolve(__dirname, "../../../"), "demo");

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
 * Clean the settings.json file inside the demo folder.
 *
 */
export async function cleanSettings(): Promise<void> {
    const file = path.join(".vscode", "settings.json");
    createDemoContent(file, "{}");
}

/**
 * Open and focus a demo file.
 *
 * @param filename the name of a file to open.
 * @param line optional line number for the cursor to start at. Defaults to `0` which would be line `1`.
 * @param startChar optional position for the cursor to start at. Defaults to `0`
 * @param endChar optional position for the cursor to end at. If bigger than startChar,
 * will create a selection. Defaults to `0`
 */
export async function focusDemoFile(
    filename: string,
    line = 0,
    startChar = 0,
    endChar = 0
): Promise<vscode.TextEditor> {
    const filepath = path.join(demoPath, filename);
    const document = await vscode.workspace.openTextDocument(filepath);

    const startSelection = new vscode.Position(line, startChar);

    let endSelection = null;
    if (endChar) {
        endSelection = new vscode.Position(line, endChar);
    }
    const editor = await vscode.window.showTextDocument(document, {
        selection: new vscode.Selection(startSelection, endSelection || startSelection),
    });

    return editor;
}

export async function createDemoContent(filename: string, content: string) {
    const filepath = path.join(demoPath, filename);

    const file = createWriteStream(filepath);
    file.write(content);
    file.close();

    await sleep(50);
}
