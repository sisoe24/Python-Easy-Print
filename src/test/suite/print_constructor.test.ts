import * as assert from "assert";

import { printConstructor } from "../../print_constructor";

suite("Print Constructor", () => {

    test("Basic print statements", () => {
        const statement = "print('%f %F %l %w {text}', {text})";

        const print = printConstructor(statement);
        
        assert.strictEqual(print, "print('%f %F %l %w {text}', {text})");

    });

});