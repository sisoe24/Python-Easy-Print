import * as assert from "assert";
import * as vscode from "vscode";

import * as selectedText from "../../selected_text";
import * as testUtils from "./test_utils";

/**
 * File content to write at the beginning of the test.
 */
const fileContent = `
foo.bar.foo.bar(*args, **kwargs)
foo-bar
foo_bar.foo
foo, bar

foo.bar
foo bar

foo.bar_foo
fooBar

# callables
foo.bar()
foo.bar(x)
foo.bar('x')
foo.bar(x='x')
`.trim();

const demoFile = "selected_text_demo.py";

setup("Clean Demo files", async () => {
    console.log("cleaning yo");
    await testUtils.cleanSettings();
});

teardown("Clean Demo files", async () => {
    await testUtils.cleanSettings();
});

suiteSetup("Open demo file", async () => {
    await testUtils.createDemoContent(demoFile, fileContent);
});

suite.only("Get hover text with no options", () => {
    test("Hover text line 1: foo", async () => {
        const editor = await testUtils.focusDemoFile(demoFile);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "foo");
    });

    test("Hover text line 1 second word: bar", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 0, 4);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "bar");
    });

    test("Hover text line 2: foo", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 1);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "foo");
    });

    test("Hover text line 3: foo_bar", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 2);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "foo_bar");
    });

    test("Hover text line 4: foo", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 3);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "foo");
    });

    test("Hover text line 5: empty", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 4);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, null);
    });
});

suite.only("Get hover text with options", () => {
    // suiteSetup("Enable parent call", async () => {
    // });

    test("Hover text line 1: default option value", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 0, 12);
        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "foo.bar.foo.bar(*args, **kwargs)");
    });

    test("Hover text line 2: default options but word has no parent/caller ", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 1, 4);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "bar");
    });

    test("Hover text line 1: no parentheses", async () => {
        await testUtils.updateConfig("includeParentheses", false);

        const editor = await testUtils.focusDemoFile(demoFile, 0, 12);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "foo.bar.foo.bar");
    });

    test("Hover text line 1: no parentheses and no parent", async () => {
        await testUtils.updateConfig("includeParentCall", false);
        await testUtils.updateConfig("includeParentheses", false);

        const editor = await testUtils.focusDemoFile(demoFile, 0, 12);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "bar");
    });
});

suite.skip("Get hover text with options", () => {
    // suiteSetup("Enable parent call", async () => {
    // });

    test("Hover text line 1: default option value", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 0, 12);
        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "foo.bar.foo.bar(*args, **kwargs)");
    });

    test("Hover text line 2: default options but word has no parent/caller ", async () => {
        const editor = await testUtils.focusDemoFile(demoFile, 1, 4);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "bar");
    });

    test("Hover text line 1: no parentheses", async () => {
        await testUtils.updateConfig("includeParentheses", false);

        const editor = await testUtils.focusDemoFile(demoFile, 0, 12);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "foo.bar.foo.bar");
    });

    test("Hover text line 1: no parentheses and no parent", async () => {
        await testUtils.updateConfig("includeParentCall", false);
        await testUtils.updateConfig("includeParentheses", false);

        const editor = await testUtils.focusDemoFile(demoFile, 0, 12);

        const text = selectedText.getSelectedText(editor);
        assert.strictEqual(text, "bar");
    });
});
