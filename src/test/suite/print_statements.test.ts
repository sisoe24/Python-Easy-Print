import * as assert from "assert";

import * as prints from "../../print_statements";
import * as testUtils from "./test_utils";

// TODO: cleaning file should be based on which file is currently used.

const demoFile = "demo_file.py";

suiteSetup("Open demo file", async () => {
    await testUtils.createDemoContent(demoFile, "");
});

setup("Clean Demo files", async () => {
    testUtils.cleanSettings();
    await testUtils.focusDemoFile(demoFile);
});

teardown("Clean Demo files", () => {
    testUtils.cleanSettings();
});

suite("PrintConstructor", () => {
    test("Basic print statements", () => {
        const statement = new prints.PrintConstructor("print");
        assert.strictEqual(statement.string(), 'print("➡ {text} :", {text})');
    });

    test("Help statement", () => {
        const statement = new prints.PrintConstructor("help");
        assert.strictEqual(statement.string(), "help({text})");
    });

    test("Custom statement", () => {
        const statement = new prints.PrintConstructor("custom");
        assert.strictEqual(statement.string(), "{@}");
    });

    test("Helpers print statements: dir, type, repr", () => {
        for (const print of ["dir", "type", "repr"]) {
            const statement = new prints.PrintConstructor(print);
            assert.strictEqual(
                statement.string(),
                `print("➡ {text} ${print} :", ${print}({text}))`
            );
        }
    });

    test("Invalid print level", () => {
        assert.throws(() => {
            new prints.PrintConstructor("verbose");
        }, Error);
    });

    test("Basic print with placeholders", async () => {
        await testUtils.updateConfig("prints.addCustomMessage", "DEBUG");
        const statement = new prints.PrintConstructor("print");
        assert.strictEqual(statement.string(), 'print("➡ DEBUG {text} :", {text})');
    });

    test("Custom statement with placeholders", async () => {
        await testUtils.updateConfig("prints.customStatement", "DEBUG");
        const statement = new prints.PrintConstructor("custom");
        assert.strictEqual(statement.string(), "DEBUG");
    });

    test("Help should not have any placeholders", async () => {
        await testUtils.updateConfig("prints.addCustomMessage", "DEBUG");
        const statement = new prints.PrintConstructor("help");
        assert.strictEqual(statement.string(), "help({text})");
    });

    test("Convert placeholders from config", async () => {
        await testUtils.updateConfig("prints.addCustomMessage", "%f %l DEBUG");
        const statement = new prints.PrintConstructor("print");
        const placeholders = statement.convertPlaceholders();
        assert.strictEqual(placeholders, "demo_file.py 1 DEBUG");
    });

    test("Convert placeholders from config for custom statement", async () => {
        await testUtils.updateConfig("prints.customStatement", "%f %l {text} {symbol}");
        const statement = new prints.PrintConstructor("custom");
        const placeholders = statement.convertPlaceholders();
        assert.strictEqual(placeholders, "demo_file.py 1 {text} ➡");
    });

    test("Convert placeholders from config but no config", async () => {
        await testUtils.updateConfig("prints.addCustomMessage", "");
        const statement = new prints.PrintConstructor("help");
        const placeholders = statement.convertPlaceholders();
        assert.strictEqual(placeholders, "");
    });

    test("Basic print statements with workspace relative path", async () => {
        await testUtils.updateConfig("prints.addCustomMessage", "%w:%l");
        const statement = new prints.PrintConstructor("print");
        assert.strictEqual(statement.string(), 'print("➡ demo_file.py:1 {text} :", {text})');
    });

    test("Basic print statements with new line", async () => {
        await testUtils.updateConfig("prints.printToNewLine", true);
        const statement = new prints.PrintConstructor("print");
        assert.strictEqual(statement.string(), 'print("➡ {text} :\\n", {text})');
        await testUtils.updateConfig("prints.printToNewLine", false);
    });
});

suite("Statement Constructor", () => {
    test("Is PrintConstructor", () => {
        const constructor = prints.statementConstructor("print");
        assert.strictEqual(constructor, 'print("➡ {text} :", {text})');
    });

    test("Is Custom Statement", () => {
        const constructor = prints.statementConstructor("custom");
        assert.strictEqual(constructor, "");
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

suite("Log Constructor", () => {
    test("Basic logging statements", () => {
        for (const logger of ["debug", "info", "warning", "error", "critical"]) {
            const statement = prints.logConstructor(logger);
            assert.strictEqual(statement, `logging.${logger}("{text} : %s", repr({text}))`);
        }
    });

    test("Custom logging statement", async () => {
        await testUtils.updateConfig("logging.customLogName", "LOGGER");
        const statement = prints.logConstructor("debug");
        assert.strictEqual(statement, 'LOGGER.debug("{text} : %s", repr({text}))');
    });

    test("Dont use repr", async () => {
        await testUtils.updateConfig("logging.useRepr", false);
        const statement = prints.logConstructor("debug");
        assert.strictEqual(statement, 'logging.debug("{text} : %s", {text})');
    });

    test("Invalid logging level", () => {
        assert.throws(() => {
            prints.logConstructor("verbose");
        }, Error);
    });
});
