import * as assert from "assert";

import * as testUtils from "./test_utils";
import * as vscode from "vscode";

suite("Basic print command", () => {
    const demoFile = "execute_prints_demo.py";
    const fileContent = "name = 'foo'\n\n";

    setup("Open demo file", async () => {
        await testUtils.createDemoContent(demoFile, fileContent);
    });

    test("Basic print no text", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 1);

        await vscode.commands.executeCommand("python-easy-print.easyPrint");

        assert.strictEqual(editor.document.lineAt(2).text, "");
    });

    test("Logging debug no text", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 1);

        await vscode.commands.executeCommand("python-easy-print.easyLogDebug");

        assert.strictEqual(editor.document.lineAt(2).text, "");
    });

    test("Basic print", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        await vscode.commands.executeCommand("python-easy-print.easyPrint");
        await testUtils.sleep(50);

        assert.strictEqual(editor.document.lineAt(1).text, 'print("➡ name :", name)');
    });

    test("Basic loggin debug", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        await vscode.commands.executeCommand("python-easy-print.easyLogDebug");
        await testUtils.sleep(50);

        assert.strictEqual(
            editor.document.lineAt(1).text,
            'logging.debug("name : %s", repr(name))'
        );
    });
});

suite("Code Block", () => {
    const demoFile = "code_block_demo.py";
    const fileContent = "names = [\n\t'foo',\n\t'bar'\n]";

    setup("Open demo file", async () => {
        await testUtils.createDemoContent(demoFile, fileContent);
    });

    test("Print with code block in multiple lines", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        await vscode.commands.executeCommand("python-easy-print.easyPrint");
        await testUtils.sleep(50);

        assert.strictEqual(editor.document.lineAt(4).text, 'print("➡ names :", names)');
    });

    test("Debug log with code block in multiple lines", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        await vscode.commands.executeCommand("python-easy-print.easyLogDebug");
        await testUtils.sleep(50);

        assert.strictEqual(
            editor.document.lineAt(4).text,
            'logging.debug("names : %s", repr(names))'
        );
    });
});

suite("Multiple Statements", () => {
    const demoFile = "multiple_statement_demo.py";
    const fileContent = "first, last = 'foo', 'bar'";

    setup("Open demo file", async () => {
        await testUtils.createDemoContent(demoFile, fileContent);
    });

    test("Print with multiple statements", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 0, 0, 11);

        await vscode.commands.executeCommand("python-easy-print.easyPrint");
        await testUtils.sleep(100);

        assert.strictEqual(editor.document.lineAt(1).text, 'print("➡ first :", first)');
        assert.strictEqual(editor.document.lineAt(2).text, 'print("➡ last :", last)');
    });

    test("Logging debug with multiple statements", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 0, 0, 11);

        await vscode.commands.executeCommand("python-easy-print.easyLogDebug");
        await testUtils.sleep(100);

        assert.strictEqual(
            editor.document.lineAt(1).text,
            'logging.debug("first : %s", repr(first))'
        );
        assert.strictEqual(
            editor.document.lineAt(2).text,
            'logging.debug("last : %s", repr(last))'
        );
    });
});
