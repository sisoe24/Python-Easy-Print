import * as assert from "assert";

import * as utils from "../../utils";
import * as testUtils from "./test_utils";

suite("Extension Settings", () => {
    suiteSetup("Clean settings", () => {
        testUtils.cleanSettings();
    });

    test("Test settings name", () => {
        const config = utils.pepConfig("customizeLogMessage");
        assert.strictEqual(typeof config, "string");
    });

    test("Test settings invalid configuration name", () => {
        assert.throws(() => {
            utils.pepConfig("customizeLogMessages");
        }, Error);
    });

    test("Test settings name", async () => {
        await testUtils.updateConfig("customizeLogMessage", "test1");
        const config = utils.pepConfig("customizeLogMessage");
        assert.strictEqual(config, "test1");
    });

    suiteTeardown("Clean settings", () => {
        testUtils.cleanSettings();
    });
});
