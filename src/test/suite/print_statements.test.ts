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
    await testUtils.focusDemoFile("demo_file.py");
});

suite("PlaceholderConverter", () => {
    suiteSetup("Open demo file", async () => {
        await testUtils.focusDemoFile("placeholder_demo.py");
    });

    test("Get function name one level depth", async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            await testUtils.focusDemoFile("placeholder_demo.py", 1, 0);
            const placeholder = new prints.PlaceholdersConverter(editor);

            assert.strictEqual(placeholder.getFuncName(), "placeholders_function");
        }
    });

    test("Get function name one level depth", async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            await testUtils.focusDemoFile("placeholder_demo.py", 1, 0);
            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "placeholders_function");
        }
    });

    test("Get function name two level depth", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.focusDemoFile("placeholder_demo.py", 3, 0);
            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "inner_func");
        }
    });

    test("Get function return two level depth", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.focusDemoFile("placeholder_demo.py", 4, 0);
            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "placeholders_function");
        }
    });

    test("Get function name", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.focusDemoFile("placeholder_demo.py", 7, 4);
            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "");
            assert.strictEqual(placeholder.convert("%F"), "");
        }
    });

    test("Get file name ", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.focusDemoFile("placeholder_demo.py");
            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFilename(), "placeholder_demo.py");
            assert.strictEqual(placeholder.convert("%f"), "placeholder_demo.py");
        }
    });

    test("Get line number ", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.focusDemoFile("placeholder_demo.py", 1);
            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getLineNum(), "2");
            assert.strictEqual(placeholder.convert("%l"), "2");
        }
    });

    test("Invalid placeholder key", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.focusDemoFile("placeholder_demo.py", 1);
            const placeholder = new prints.PlaceholdersConverter(editor);

            assert.throws(() => {
                placeholder.convert("%t");
            }, Error);
        }
    });
});

suite("PrintConstructor", () => {
    suiteSetup("Open demo file", async () => {
        await testUtils.focusDemoFile("demo_file.py");
    });

    test("Basic print statements", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const statement = new prints.PrintConstructor("print");
            assert.strictEqual(statement.string(), 'print("➡ {text} :", {text})');
        }
    });

    test("Help statement", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const statement = new prints.PrintConstructor("help");
            assert.strictEqual(statement.string(), "help({text})");
        }
    });

    test("Helpers print statements: dir, type, repr", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const helpers = ["dir", "type", "repr"];
            for (const print of helpers) {
                const statement = new prints.PrintConstructor(print);
                assert.strictEqual(
                    statement.string(),
                    `print("➡ {text} ${print} :", ${print}({text}))`
                );
            }
        }
    });

    test("Invalid print level", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            assert.throws(() => {
                new prints.PrintConstructor("verbose");
            }, Error);
        }
    });

    test("Basic print with placeholders", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.updateConfig("customizePrintMessage", "DEBUG");
            const statement = new prints.PrintConstructor("print");
            assert.strictEqual(statement.string(), 'print("➡ DEBUG {text} :", {text})');
        }
    });

    test("Help should not have any placeholders", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.updateConfig("customizePrintMessage", "DEBUG");
            const statement = new prints.PrintConstructor("help");
            assert.strictEqual(statement.string(), "help({text})");
        }
    });

    test("Convert placeholders from config", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.updateConfig("customizePrintMessage", "%f %l DEBUG");
            const statement = new prints.PrintConstructor("help");
            const placeholders = statement.convertPlaceholders();
            assert.strictEqual(placeholders, "demo_file.py 1 DEBUG");
        }
    });

    test("Convert placeholders from config but no config", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.updateConfig("customizePrintMessage", "");
            const statement = new prints.PrintConstructor("help");
            const placeholders = statement.convertPlaceholders();
            assert.strictEqual(placeholders, "");
        }
    });
});

suite("Log Constructor", () => {
    suiteSetup("Open demo file", async () => {
        await testUtils.focusDemoFile("demo_file.py");
    });

    test("Basic logging statements", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const loggers = ["debug", "info", "warning", "error", "critical"];
            for (const logger of loggers) {
                const statement = prints.logConstructor(logger);
                assert.strictEqual(statement, `logging.${logger}("{text} : %s", repr({text}))`);
            }
        }
    });

    test("Custom logging statement", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.updateConfig("customLogName", "LOGGER");
            const statement = prints.logConstructor("debug");
            assert.strictEqual(statement, 'LOGGER.debug("{text} : %s", repr({text}))');
        }
    });

    test("Dont use repr", async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            await testUtils.updateConfig("useReprToLog", false);
            const statement = prints.logConstructor("debug");
            assert.strictEqual(statement, 'logging.debug("{text} : %s", {text})');
        }
    });

    test("Invalid logging level", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            assert.throws(() => {
                prints.logConstructor("verbose");
            }, Error);
        }
    });
});

suite("Statement Constructor", () => {
    test("Is PrintConstructor", () => {
        const constructor = prints.statementConstructor("print");
        assert.strictEqual(constructor, 'print("➡ {text} :", {text})');
    });

    test("Is LogConstructor", () => {
        const constructor = prints.statementConstructor("debug");
        assert.strictEqual(constructor, 'logging.debug("{text} : %s", repr({text}))');
    });

    test("Is invalid constructor", () => {
        assert.throws(() => {
            prints.statementConstructor("verbose");
        }, Error);
    });
});
