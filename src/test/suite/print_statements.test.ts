import * as assert from "assert";
import * as vscode from "vscode";

import * as prints from "../../print_statements";
import * as testUtils from "./test_utils";

setup("Clean Demo files", async () => {
    await testUtils.cleanSettings();
    await testUtils.cleanDemoFile();
});

teardown("Clean Demo files", async () => {
    await testUtils.cleanSettings();
    await testUtils.cleanDemoFile();
});

suiteSetup("Open demo file", async () => {
    await testUtils.focusDemoFile();
});

suite("Print Statements template", async () => {
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
});

suite("Construct statement", () => {
    test("Print statement", async () => {
        await testUtils.updateConfig("customizeLogMessage", "line: %l");
        const replace = prints.constructPrintStatement("name", "print");
        assert.strictEqual(replace, `print("${prints.symbol} line: 1 name :", name)`);
    });

    test("Type statement", async () => {
        await testUtils.updateConfig("customizeLogMessage", "line: %l");
        const replace = prints.constructPrintStatement("name", "type");
        assert.strictEqual(replace, `print("${prints.symbol} line: 1 name type :", type(name))`);
    });

    test("Dir statement", async () => {
        await testUtils.updateConfig("customizeLogMessage", "%f");
        const replace = prints.constructPrintStatement("name", "dir");
        assert.strictEqual(replace, `print("${prints.symbol} demo_file.py name dir :", dir(name))`);
    });

    // XXX: shouldn't need to test other statements as they are identical to the one above

    test("Help statement", async () => {
        await testUtils.updateConfig("customizeLogMessage", "line: %l");
        const replace = prints.constructPrintStatement("name", "help");
        assert.strictEqual(replace, `help(name)`);
    });
});

suite("Placeholder Constructor", () => {
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
});

suite("Get document text", () => {
    setup("Write to file", async () => {
        await testUtils.writeDemoFile({
            line1: "import random",
            line2: "\n\n",
            line3: "name='virgil'",
        });
    });

    test("First word under cursor on first line", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const word = prints.getDocumentText(editor);
            assert.strictEqual(word, "import");
        }
    });

    test("Second word under cursor on first line", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // select first line
            const firstLineStart = new vscode.Position(0, 7);
            const firstLineEnd = editor.document.lineAt(0).range.end;

            editor.selection = new vscode.Selection(firstLineStart, firstLineEnd);
            const word = prints.getDocumentText(editor);
            assert.strictEqual(word, "random");
        }
    });

    test("Selected line1", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // select first line
            const firstLineStart = editor.document.lineAt(0).range.start;
            const firstLineEnd = editor.document.lineAt(0).range.end;
            editor.selection = new vscode.Selection(firstLineStart, firstLineEnd);

            const word = prints.getDocumentText(editor);
            assert.strictEqual(word, "import random");
        }
    });

    test("No word under cursor", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // select second line: empty line
            const firstLineStart = editor.document.lineAt(1).range.start;
            const firstLineEnd = editor.document.lineAt(1).range.end;
            editor.selection = new vscode.Selection(firstLineStart, firstLineEnd);

            const word = prints.getDocumentText(editor);
            assert.strictEqual(word, "");
        }
    });
});

suite("Final Print Statement", () => {
    setup("Write to file", async () => {
        await testUtils.writeDemoFile({
            line1: "import random",
            line2: "\n\n",
            line3: "name='virgil'",
        });
    });

    test("Print Statement first word under cursor on first line", () => {
        const statement = prints.executeCommand("print");
        assert.strictEqual(statement, `print("${prints.symbol} import :", import)`);
    });

    test("Print Type Statement word under cursor", () => {
        const statement = prints.executeCommand("type");
        assert.strictEqual(statement, `print("${prints.symbol} import type :", type(import))`);
    });

    test("Help Statement word under cursor", () => {
        const statement = prints.executeCommand("help");
        assert.strictEqual(statement, "help(import)");
    });

    test("Selected line", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // select first line
            const firstLineStart = editor.document.lineAt(0).range.start;
            const firstLineEnd = editor.document.lineAt(0).range.end;
            editor.selection = new vscode.Selection(firstLineStart, firstLineEnd);

            const statement = prints.executeCommand("print");
            assert.strictEqual(
                statement,
                `print("${prints.symbol} import random :", import random)`
            );
        }
    });

    test("No word under cursor", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // select second line: empty line
            const firstLineStart = editor.document.lineAt(1).range.start;
            const firstLineEnd = editor.document.lineAt(1).range.end;
            editor.selection = new vscode.Selection(firstLineStart, firstLineEnd);

            const statement = prints.executeCommand("print");
            assert.strictEqual(typeof statement, "undefined");
        }
    });
});
