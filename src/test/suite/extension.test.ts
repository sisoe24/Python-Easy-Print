import * as assert from "assert";

import * as utils from "../../utils";
import * as testUtils from "./test_utils";

import { readFileSync } from "fs";
import { join } from "path";

suiteSetup("Clean settings", () => {
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

    suiteTeardown("Clean settings", () => {
        testUtils.cleanSettings();
    });
});

suite("Misc", () => {
    const demoFile = "py2_header_demo.py";

    suiteSetup("Open demo file", async () => {
        testUtils.createDemoContent(demoFile, "\ntest\n\n");
        await testUtils.sleep(500);
    });

    test("Python 2 print header", async () => {
        await testUtils.focusDemoFile(demoFile);
        const py2Statement = await utils.initPrintPython2();

        assert.strictEqual(
            py2Statement,
            "# coding: utf-8\nfrom __future__ import print_function\n"
        );

        await testUtils.sleep(100);
    });

    test("Python 2 print header inside file", async () => {
        await testUtils.focusDemoFile(demoFile);

        await testUtils.sleep(1000);

        const file = readFileSync(join(testUtils.demoPath, demoFile), "utf-8");
        assert.strictEqual(
            file,
            "# coding: utf-8\nfrom __future__ import print_function\n\ntest\n\n"
        );
    });
});
