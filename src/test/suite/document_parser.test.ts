import * as assert from "assert";
import * as docParser from "../../document_parser";
import * as testUtils from "./test_utils";

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
    await testUtils.sleep(500);
});

async function getFileContent() {
    await testUtils.sleep(1500);
    return readFileSync(join(testUtils.demoPath, demoFile), "utf-8");
}

// TODO: dont like this. too much wait

suite("Document Parser", () => {
    test("Comment Lines", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        docParser.commentLines(editor);

        const file = await getFileContent();
        assert.strictEqual(file, '# print("➡ test :", test)\nprint("test :", test)');
    });

    test("Uncomment Lines", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        docParser.uncommentLines(editor);

        const file = await getFileContent();
        assert.strictEqual(file, 'print("➡ test :", test)\nprint("test :", test)');
    });

    test("Uncomment Lines", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        docParser.deleteLines(editor);

        const file = await getFileContent();
        assert.strictEqual(file, 'print("test :", test)');
    });
});
