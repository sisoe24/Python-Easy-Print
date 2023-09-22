import * as assert from "assert";

import * as prints from "../../print_constructor";
import * as testUtils from "./test_utils";

/**
 * File content to write at the beginning of the test.
 */
const fileContent = `
def wrapper():
    foo = 'bar'
    def inner_func():
        bar = 'foo'
    return inner_func

foo = 'bar'
names = [
    foo
]`.trim();

const demoFile = "placeholder_demo.py";

suite("PlaceholderConverter", () => {
    suiteSetup("Open demo file", async () => {
        await testUtils.createDemoContent(demoFile, fileContent);
    });

    setup("Clean Demo files", () => {
        testUtils.cleanSettings();
    });

    teardown("Clean Demo files", () => {
        testUtils.cleanSettings();
    });

    suite("Get function name", () => {
        test("Get function name one level depth", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 1);

            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "wrapper");
        });

        test("Get function name two level depth", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 3);
            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "inner_func");
        });

        test("Get function return two level depth", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 4);

            // when printing the return of a function, it will assume that the function call
            // is the one above. although not exactly what I want, the test is mostly
            // so I can remember.
            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "wrapper");
        });

        test("Get func name but should return nothing because is top level indentation", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 7);

            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "");
            assert.strictEqual(placeholder.convert("%F"), "");
        });

        test("Get func name but should return nothing because parent is top level indentation", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 8, 4);

            const placeholder = new prints.PlaceholdersConverter(editor);
            assert.strictEqual(placeholder.getFuncName(), "");
            assert.strictEqual(placeholder.convert("%F"), "");
        });
    });

    test("Get file name ", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        const placeholder = new prints.PlaceholdersConverter(editor);
        assert.strictEqual(placeholder.getFilename(), demoFile);
        assert.strictEqual(placeholder.convert("%f"), demoFile);
    });

    test("Get line number ", async () => {
        const editor = await testUtils.focusDemoFile("placeholder_demo.py", 1);

        const placeholder = new prints.PlaceholdersConverter(editor);
        assert.strictEqual(placeholder.getLineNum(), "2");
        assert.strictEqual(placeholder.convert("%l"), "2");
    });

    test("Get line workspace relative path ", async () => {
        const editor = await testUtils.focusDemoFile("placeholder_demo.py", 1);

        const placeholder = new prints.PlaceholdersConverter(editor);
        assert.strictEqual(placeholder.getWorkspacePath(), demoFile);
        assert.strictEqual(placeholder.convert("%w"), demoFile);
    });

    test("Invalid placeholder key", async () => {
        const editor = await testUtils.focusDemoFile("placeholder_demo.py", 1);
        const placeholder = new prints.PlaceholdersConverter(editor);

        assert.throws(() => {
            placeholder.convert("%t");
        }, Error);
    });
});
