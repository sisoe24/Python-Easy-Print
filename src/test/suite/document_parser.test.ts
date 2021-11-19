import * as assert from "assert";
import * as docParser from "../../document_parser";
import * as testUtils from "./test_utils";
import * as vscode from "vscode";

import { readFileSync } from "fs";
import { join } from "path";

/**
 * File content to write at the beginning of the test.
 */
const fileContent = `
print("➡ test :", test)
print("test :", test)
`.trim();

const demoFile = "document_parser_demo.py";

suiteSetup("Open demo file", async () => {
    testUtils.createDemoContent(demoFile, fileContent);
    await testUtils.sleep(100);
});

suite("Document Parser", () => {
    test("Comment Lines", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        docParser.executeCommand("comment");
        await testUtils.sleep(50);

        assert.strictEqual(
            editor.document.getText(),
            '# print("➡ test :", test)\nprint("test :", test)'
        );
    });

    test("Uncomment Lines", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        docParser.executeCommand("uncomment");
        await testUtils.sleep(50);

        assert.strictEqual(
            editor.document.getText(),
            'print("➡ test :", test)\nprint("test :", test)'
        );
    });

    test("Delete Lines", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        docParser.executeCommand("delete");
        await testUtils.sleep(50);

        assert.strictEqual(editor.document.getText(), 'print("test :", test)');
    });

    test("Invalid command", async () => {
        await testUtils.focusDemoFile(demoFile);

        assert.throws(() => {
            docParser.executeCommand("duplicate");
        }, Error);
    });
});
