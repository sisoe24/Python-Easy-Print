import * as vscode from "vscode";

// This script is based on: https://stackoverflow.com/a/66307695/9392852

/**
 * Show update message box if version is newer or update message is different.
 *
 * @param context vscode ExtensionContext
 */
export function showUpdateMessage(context: vscode.ExtensionContext): void {
    const extensionId = "virgilsisoe.pythonEasyPrint";

    // get the value stored inside the global state key: _value['virgilsisoe.pythonEasyPrint.version']
    const extVersion = extensionId + ".version";
    const previousVersion = context.globalState.get<string>(extVersion) as string;

    // get the value stored inside the global key: _value['virgilsisoe.pythonEasyPrint.updateMsg']
    const extUpdateMsg = extensionId + ".updateMsg";
    const previousMsg = context.globalState.get<string>(extUpdateMsg) as string;

    // get the package.json version
    // if it cannot resolve the version will return 0.0.0
    const currentVersion =
        (vscode.extensions.getExtension(extensionId)?.packageJSON.version as string) ?? "0.0.0";

    // store the current version in the global state key _value['virgilsisoe.pythonEasyPrint.version']
    context.globalState.update(extVersion, currentVersion);

    const updateMsg =
        "Shortcuts for Python EasyPrint have been removed. Please refer to the example below.";

    // store the current update message in the global state key _value['virgilsisoe.pythonEasyPrint.updateMsg']
    context.globalState.update(extUpdateMsg, updateMsg);

    if (currentVersion > previousVersion && updateMsg !== previousMsg) {
        vscode.window
            .showInformationMessage(updateMsg, "Show example", "Close")
            .then((selection) => {
                if (selection === "Show example") {
                    vscode.env.openExternal(
                        vscode.Uri.parse(
                            "https://github.com/sisoe24/Python-Easy-Print#example-key-bindings"
                        )
                    );
                }
            });
    }
}
