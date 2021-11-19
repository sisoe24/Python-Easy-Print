import * as assert from "assert";
import * as vscode from "vscode";
import * as utils from "../../utils";
import * as testUtils from "./test_utils";

suiteSetup("Clean settings", () => {
    testUtils.cleanSettings();
});

suiteTeardown("Clean settings", () => {
    testUtils.cleanSettings();
});

suite("Extension Settings", () => {
    test("Test settings name", () => {
        const config = utils.pepConfig("prints.addCustomMessage");
        assert.strictEqual(typeof config, "string");
    });

    test("Test settings invalid configuration name", () => {
        assert.throws(() => {
            utils.pepConfig("randomTest");
        }, Error);
    });

    test("Test settings name", async () => {
        await testUtils.updateConfig("prints.addCustomMessage", "test1");
        const config = utils.pepConfig("prints.addCustomMessage");
        assert.strictEqual(config, "test1");
    });
});

suite("Misc", () => {
    const demoFile = "py2_header_demo.py";

    suiteSetup("Open demo file", async () => {
        await testUtils.createDemoContent(demoFile, "\ntest\n\n");
    });

    test("Python 2 print header statements", async () => {
        assert.strictEqual(
            utils.py2Statement,
            "# coding: utf-8\nfrom __future__ import print_function\n"
        );
    });

    test("Python 2 print header inside file", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        await vscode.commands.executeCommand("python-easy-print.easyPrintPy2");
        await testUtils.sleep(50);

        assert.strictEqual(
            editor.document.getText(),
            "# coding: utf-8\nfrom __future__ import print_function\n\ntest\n\n"
        );
    });
});
