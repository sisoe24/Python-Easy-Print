import * as assert from "assert";

import * as selectedText from "../../selected_text";
import * as testUtils from "./test_utils";

/**
 * File content to write at the beginning of the test.
 */
const fileContent = `
foo.bar.foo.bar(*args, **kwargs)
foo-bar
foo, bar

foo(0).bar(1).foo(2).bar(3)
foo(0), bar(1), foo(2), bar(3)

square = [
    'test'
]
round = (
    'test'
)
graph = {
    'test'
}
round2 = (test)

name = 'test'

`.trim();

const demoFile = "selected_text_demo.py";

setup("Clean Demo files", () => {
    testUtils.cleanSettings();
});

teardown("Clean Demo files", () => {
    testUtils.cleanSettings();
});

suiteSetup("Open demo file", async () => {
    await testUtils.createDemoContent(demoFile, fileContent);
});

suite("SelectedText class", () => {
    suite("Hover default options", () => {
        test("Hover text line 1: word 1", async () => {
            const editor = await testUtils.focusDemoFile(demoFile);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo"]);
        });

        test("Hover text line 1: word 2", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 0, 4);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo.bar"]);
        });

        test("Hover text line 1: word 3", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 0, 8);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo.bar.foo"]);
        });

        test("Hover text line 1: full line", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 0, 12);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo.bar.foo.bar(*args, **kwargs)"]);
        });

        test("Hover text line 2: full line", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 1);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo"]);
        });

        test("Hover text line 3: full line", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 2);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo"]);
        });

        test("Hover text line 4: empty line", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 3);

            const text = new selectedText.SelectedText(editor);
            assert.strictEqual(text.text(), null);
        });

        test("Hover text line 4: full line", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 4, 21);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo(0).bar(1).foo(2).bar(3)"]);
        });
    });

    suite("Hover custom options", () => {
        test("No parents", async () => {
            await testUtils.updateConfig("hover.includeParentCall", false);
            const editor = await testUtils.focusDemoFile(demoFile, 0, 12);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["bar(*args, **kwargs)"]);
        });

        test("No parentheses", async () => {
            await testUtils.updateConfig("hover.includeParentheses", false);
            const editor = await testUtils.focusDemoFile(demoFile, 0, 12);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo.bar.foo.bar"]);
        });

        test("No parents and no parentheses", async () => {
            await testUtils.updateConfig("hover.includeParentCall", false);
            await testUtils.updateConfig("hover.includeParentheses", false);
            const editor = await testUtils.focusDemoFile(demoFile, 0, 12);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["bar"]);
        });
    });

    suite("Manually selected text", () => {
        test("Select text line 1: word 4", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 0, 0, 15);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo.bar.foo.bar"]);
        });

        test("Select text line 1: full line", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 0, 0, 32);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo.bar.foo.bar(*args, **kwargs)"]);
        });

        test("Select text line 1: full line with multipleStatements", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 2, 0, 8);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo", "bar"]);
        });

        test("Select text line 1: full line with no multipleStatements", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 5, 0, 30);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo(0)", "bar(1)", "foo(2)", "bar(3)"]);
        });

        test("Select text line 1: full line with no multipleStatements", async () => {
            await testUtils.updateConfig("multipleStatements", false);
            const editor = await testUtils.focusDemoFile(demoFile, 2, 0, 8);

            const text = new selectedText.SelectedText(editor);
            assert.deepStrictEqual(text.text(), ["foo, bar"]);
        });
    });

    suite("Is Code Block", () => {
        test("Is Code Block: [", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 7);

            const text = new selectedText.SelectedText(editor);
            assert.ok(text.hasCodeBlock());
        });

        test("Is Code Block: (", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 10);

            const text = new selectedText.SelectedText(editor);
            assert.ok(text.hasCodeBlock());
        });

        test("Is Code Block: {", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 13);

            const text = new selectedText.SelectedText(editor);
            assert.ok(text.hasCodeBlock());
        });
        test("Is Code Block: ( same line", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 16);

            const text = new selectedText.SelectedText(editor);
            assert.ok(text.hasCodeBlock());
        });

        test("Is NOT code block", async () => {
            const editor = await testUtils.focusDemoFile(demoFile, 17);
            const text = new selectedText.SelectedText(editor);
            assert.ok(!text.hasCodeBlock());
        });
    });
});
