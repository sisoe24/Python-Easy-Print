import * as assert from "assert";
import * as vscode from "vscode";

import * as path from "path";
import { readdirSync, readFileSync } from "fs";

import * as utils from "../../utils";
import * as testUtils from "./test_utils";
import { printCommands, logCommands, documentCommands } from "../../extension";

suiteSetup("Clean settings", () => {
    testUtils.cleanSettings();
});

suiteTeardown("Clean settings", () => {
    testUtils.cleanSettings();
});

suite("Extension Settings", () => {
    test("logging.customLogName type", () => {
        const config = utils.pepConfig("logging.customLogName");
        assert.strictEqual(typeof config, "string");
    });

    test("logging.useRepr type", () => {
        const config = utils.pepConfig("logging.useRepr");
        assert.strictEqual(typeof config, "boolean");
    });

    test("prints.addCustomMessage type", () => {
        const config = utils.pepConfig("prints.addCustomMessage");
        assert.strictEqual(typeof config, "string");
    });

    test("multipleStatements type", () => {
        const config = utils.pepConfig("multipleStatements");
        assert.strictEqual(typeof config, "boolean");
    });

    test("prints.includeParentCall type", () => {
        const config = utils.pepConfig("hover.includeParentCall");
        assert.strictEqual(typeof config, "boolean");
    });

    test("hover.includeParentheses type", () => {
        const config = utils.pepConfig("hover.includeParentheses");
        assert.strictEqual(typeof config, "boolean");
    });

    test("Test settings invalid configuration name", () => {
        assert.throws(() => {
            utils.pepConfig("randomTest");
        }, Error);
    });

    test("Test settings update", async () => {
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

suite("Commands name", () => {
    const commands = testUtils.packageCommands();

    test("Print Commands", () => {
        for (const command of Object.values(printCommands)) {
            assert.ok(commands.includes(command), `Extension command name mismatched: ${command}`);
        }
    });

    test("Log Commands", () => {
        for (const command of Object.values(logCommands)) {
            assert.ok(commands.includes(command), `Extension command name mismatched: ${command}`);
        }
    });

    test("Document Commands", () => {
        for (const command of Object.values(documentCommands)) {
            assert.ok(commands.includes(command), `Extension command name mismatched: ${command}`);
        }
    });
});

suite("Configuration names", () => {
    /**
     * Parse a directory for its files and check if has any configuration names.
     *
     * Check if configuration names match the one from the package.json.
     *
     * @param source string like path to parse for files
     */
    function parseDir(source: string) {
        const configurations = testUtils.packageConfigurations();
        readdirSync(source, { withFileTypes: true })
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name)
            .forEach((file) => {
                const _file = path.join(source, file);
                const fileContents = readFileSync(_file, "utf8");

                const configs = fileContents.match(/(?<=pepConfig\(")(.+?)(?=")/g);
                if (configs) {
                    for (const config of configs) {
                        // I test a wrong configuration so will certainly fail
                        if (config === "randomTest") {
                            continue;
                        }
                        assert.ok(
                            configurations.includes(config),
                            `file: ${file} - configuration name mismatch: ${config}`
                        );
                    }
                }
            });
    }

    test("In src files", () => {
        const _path = path.join(testUtils.root, "src");
        parseDir(_path);
    });

    test("In tests files", () => {
        const _path = path.join(testUtils.root, "src", "test", "suite");
        parseDir(_path);
    });
});
