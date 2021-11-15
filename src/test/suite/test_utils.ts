import * as vscode from "vscode";
import * as path from "path";
import { writeFileSync, existsSync, writeFile, createWriteStream } from "fs";

const demoPath = path.join(path.resolve(__dirname, "../../../"), "demo");

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
 * Method will wait for 200ms before completing. This is to give enough time to
 * vscode to register the changes.
 */
export async function cleanSettings(): Promise<void> {
    const settings = path.join(demoPath, ".vscode", "settings.json");
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
    const filepath = path.join(demoPath, "demo_file.py");
    writeFileSync(filepath, "");
    await sleep(50);
}

/**
 * Open and focus a demo file.
 *
 * @param filename the name of a file to open.
 * @param line optional line number for the cursor to start at. Defaults to `0` which would be line `1`.
 * @param char optional character position for the cursor to start at when opening the file.
 * Defaults to `0`
 */
export async function focusDemoFile(
    filename: string,
    line = 0,
    char = 0
): Promise<vscode.TextEditor> {
    const filepath = path.join(demoPath, filename);
    const document = await vscode.workspace.openTextDocument(filepath);

    const selection = new vscode.Position(line, char);
    const editor = await vscode.window.showTextDocument(document, {
        selection: new vscode.Selection(selection, selection),
    });

    return editor;
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

export async function createDemoContent(filename: string, content: string) {
    const filepath = path.join(demoPath, filename);
    const f = createWriteStream(filepath);
    f.write(content);
}
