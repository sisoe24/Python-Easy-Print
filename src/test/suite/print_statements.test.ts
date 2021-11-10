import * as assert from "assert";
import * as vscode from "vscode";

import * as prints from "../../print_statements";
import * as testUtils from "./test_utils";

const demoFolder = testUtils.getDemoFolder();
const demoFile = testUtils.getDemoFolder("demo_file.py");

suite("Print Statements", async () => {
    test("Basic print", () => {
        const statement = prints.getPrintStatement("print");
        assert.strictEqual(statement, `print("${prints.symbol} {@} {text} :", {text})`);
    });

    test("Type print", () => {
        const statement = prints.getPrintStatement("type");
        assert.strictEqual(statement, `print("${prints.symbol} {@} {text} type :", type({text}))`);
    });

    test("Dir print", () => {
        const statement = prints.getPrintStatement("dir");
        assert.strictEqual(statement, `print("${prints.symbol} {@} {text} dir :", dir({text}))`);
    });

    test("Repr print", () => {
        const statement = prints.getPrintStatement("repr");
        assert.strictEqual(statement, `print("${prints.symbol} {@} {text} repr :", repr({text}))`);
    });

    test("Help print", () => {
        const statement = prints.getPrintStatement("help");
        assert.strictEqual(statement, "help({text})");
    });

    test("Invalid statement", () => {
        assert.throws(() => {
            prints.getPrintStatement("test");
        }, Error);
    });

    test("Invalid statement", () => {
        assert.throws(() => {
            prints.getPrintStatement("test");
        }, Error);
    });
});

// TODO: global hooks for cleaning settings before/after each suite

suite("Construct statement", () => {
    setup("Open demo file", async () => {
        const document = await vscode.workspace.openTextDocument(demoFile);
        await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One });

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const start = new vscode.Position(0, 0);
            editor.selection = new vscode.Selection(start, start);
        }
    });

    test("Basic statement", async () => {
        await testUtils.updateConfig("customizeLogMessage", "line: %l");
        const replace = prints.constructStatement("name", "print");
        assert.strictEqual(replace, `print("${prints.symbol} line: 1 name :", name)`);
    });

    test("Type statement", async () => {
        await testUtils.updateConfig("customizeLogMessage", "line: %l");
        const replace = prints.constructStatement("name", "type");
        assert.strictEqual(replace, `print("${prints.symbol} line: 1 name type :", type(name))`);
    });

    // XXX: shouldn't need to test other statements as they are identical to the one above

    test("Help statement", async () => {
        await testUtils.updateConfig("customizeLogMessage", "line: %l");
        const replace = prints.constructStatement("name", "help");
        assert.strictEqual(replace, `help(name)`);
    });
});

suite("Placeholder Constructor", () => {
    setup("Open demo file", async () => {
        const document = await vscode.workspace.openTextDocument(demoFile);
        await vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.One });

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const start = new vscode.Position(0, 0);
            editor.selection = new vscode.Selection(start, start);
        }
    });

    test("No placeholders", async () => {
        await testUtils.updateConfig("customizeLogMessage", "debug");
        const placeholder = prints.convertPlaceholders();
        assert.strictEqual(placeholder, "debug");
    });

    test("Replace %f for file.", async () => {
        await testUtils.updateConfig("customizeLogMessage", "%f - debug");
        const placeholder = prints.convertPlaceholders();
        assert.strictEqual(placeholder, "demo_file.py - debug");
    });

    test("Replace %l for line.", async () => {
        await testUtils.updateConfig("customizeLogMessage", "line: %l");
        const placeholder = prints.convertPlaceholders();
        assert.strictEqual(placeholder, "line: 1");
    });

    test("Replace %t for time.", async () => {
        await testUtils.updateConfig("customizeLogMessage", "%t");
        const placeholder = prints.convertPlaceholders();
        // basic date time format: 00/00/0000T00:00:00AM
        assert.match(placeholder, /\d{2}\/\d{2}\/\d{4}T\d{2}:\d{2}:\d{2}[AP]M/);
    });
});
