# 1. Python Easy Print

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1d2406e640f647978438e8634f4f7df3)](https://www.codacy.com/gh/sisoe24/Python-Easy-Print/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sisoe24/Python-Easy-Print&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/1d2406e640f647978438e8634f4f7df3)](https://www.codacy.com/gh/sisoe24/Python-Easy-Print/dashboard?utm_source=github.com&utm_medium=referral&utm_content=sisoe24/Python-Easy-Print&utm_campaign=Badge_Coverage)
[![DeepSource](https://deepsource.io/gh/sisoe24/Python-Easy-Print.svg/?label=active+issues&show_trend=true&token=30uB5oEZbccV2AOoOX7AgXAT)](https://deepsource.io/gh/sisoe24/Python-Easy-Print/?ref=repository-badge)

[![Download](https://img.shields.io/badge/Marketplace-Download-blue)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print)
[![Version](https://img.shields.io/visual-studio-marketplace/v/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print&ssr=false#version-history)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print)
[![Last Update](https://img.shields.io/visual-studio-marketplace/last-updated/virgilsisoe.python-easy-print)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.python-easy-print)



Visual Studio Code extension for easy commands of Python most useful prints.


---

**NOTE**: Python 2 developers should start their file with the following declaration or use the included command when using this extension:

```py
# coding: utf-8
from __future__ import print_function
```

More info for [encoding](https://www.python.org/dev/peps/pep-0263/) and [print function](https://docs.python.org/3/library/__future__.html) on the official documentation.

---

- [1. Python Easy Print](#1-python-easy-print)
  - [1.1. Features](#11-features)
  - [1.2. Commands & Key bindings](#12-commands--key-bindings)
    - [1.2.1. NOTE](#121-note)
  - [1.3. Extension Settings](#13-extension-settings)
    - [1.3.1. `pythonEasyPrint.prints.addCustomMessage`: `string`](#131-pythoneasyprintprintsaddcustommessage-string)
    - [1.3.2. `pythonEasyPrint.multipleStatements`: `boolean`](#132-pythoneasyprintmultiplestatements-boolean)
    - [1.3.3. `pythonEasyPrint.printToNewLine`: `boolean`](#133-pythoneasyprintprinttonewline-boolean)
    - [1.3.4. `pythonEasyPrint.customSymbol`: `string`](#134-pythoneasyprintcustomsymbol-string)
    - [1.3.5. `pythonEasyPrint.customStatement`: `string`](#135-pythoneasyprintcustomstatement-string)
    - [1.3.6. `pythonEasyPrint.hover.includeParentCall`: `boolean`](#136-pythoneasyprinthoverincludeparentcall-boolean)
    - [1.3.7. `pythonEasyPrint.hover.includeParentheses`: `boolean`](#137-pythoneasyprinthoverincludeparentheses-boolean)
    - [1.3.8. `pythonEasyPrint.logging.customLogName`: `string`](#138-pythoneasyprintloggingcustomlogname-string)
    - [1.3.9. `pythonEasyPrint.logging.useRepr`: `boolean`](#139-pythoneasyprintlogginguserepr-boolean)
  - [1.4. Known Issues](#14-known-issues)
  - [1.5. Example Key Bindings](#15-example-key-bindings)
    - [1.5.1. Prints](#151-prints)
    - [1.5.2. Logging](#152-logging)
    - [1.5.3. Document](#153-document)
  - [1.6. Screenshots](#16-screenshots)

## 1.1. Features

- Commands for print statements: `dir`, `type`, `repr`, `help` and basic `print`.
- Commands for logging statements: `debug`, `info`, `warning`, `error` and `critical`.
- Commands can be activate by selecting the whole word/s or just by hovering the cursor over.
- Comment, uncomment and delete statements made by extension.
- Quick command to initiate a Python 2 file with the declarations needed to use the extension.

## 1.2. Commands & Key bindings

---

### 1.2.1. NOTE

Default key bindings will be removed in the future version(`> 0.5.0`). This is avoid shortcuts conflicts and let the user decide which and what shortcut needs more.

---

The main shortcut to remember is `ctrl+shift+l`. Then the initial letter of the action you will like to execute:

 `p` for `print`, `d` for `dir`, `t` for `type` and so. The only different is `x` for delete

| Description                       | Command ID                              | Key              |
| --------------------------------- | --------------------------------------- | ---------------- |
| Simple `print()`                  | `python-easy-print.easyPrint`           | `ctrl+shift+l p` |
| Print `dir()`                     | `python-easy-print.easyPrintDir`        | `ctrl+shift+l d` |
| Print `type()`                    | `python-easy-print.easyPrintType`       | `ctrl+shift+l t` |
| Print `repr()`                    | `python-easy-print.easyPrintRepr`       | `ctrl+shift+l r` |
| Call `help()`                     | `python-easy-print.easyHelp`            |                  |
| Call custom                       | `python-easy-print.easyCustom`          |                  |
| Comment lines made by extension   | `python-easy-print.commentPrintLines`   | `ctrl+shift+l c` |
| Uncomment lines made by extension | `python-easy-print.uncommentPrintLines` | `ctrl+shift+l u` |
| Delete lines made by extension    | `python-easy-print.deletePrintLines`    | `ctrl+shift+l x` |
| Init Python2 header declaration   | `python-easy-print.easyPrintPy2`        |                  |
| Log `debug`                       | `python-easy-print.easyLogDebug`        |                  |
| Log `info`                        | `python-easy-print.easyLogInfo`         |                  |
| Log `warning`                     | `python-easy-print.easyLogWarning`      |                  |
| Log `error`                       | `python-easy-print.easyLogError`        |                  |
| Log `critical`                    | `python-easy-print.easyLogCritical`     |                  |

MacOS: `ctrl` == `cmd`

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing: `Python EasyPrint...`

Every command can be re-assigned to a new shortcut. (see [docs](https://code.visualstudio.com/docs/getstarted/keybindings) for more info)

## 1.3. Extension Settings

### 1.3.1. `pythonEasyPrint.prints.addCustomMessage`: `string`

Customize the print message by adding some extra information with some text or by using one of the placeholder provided:

- `%f`: File name.
- `%l`: Line number.
- `%F`: Function parent.

Example: `Debug - %f - %F line %l -` will result in:

```py
print("➡ DEBUG - test.py - foo line 1 - name :", name)
```

### 1.3.2. `pythonEasyPrint.multipleStatements`: `boolean`

If `true`, when manually selecting multiple statements (eg: `foo, bar`), print each one individually.

### 1.3.3. `pythonEasyPrint.printToNewLine`: `boolean`

If `true`, will insert a newline character in the print:

```py
print("➡ name :\n", name)
```

### 1.3.4. `pythonEasyPrint.customSymbol`: `string`

A custom unicode symbol to be used inside the print. Could also be an emoji: 👉.

>Note: it should be the symbol representation and not the unicode code point.

### 1.3.5. `pythonEasyPrint.customStatement`: `string`

A custom statement to be used when using the command `pythonEasyPrint.customStatement`. This setting allows for a complete new statement to be generated. In addition to the placeholders mentioned in [Add Custom Message](#pythoneasyprintprintsaddcustommessage-string) the following two placeholders will be available:

- `{text}`: The selected/hover text.
- `{symbol}`: The unicode character.

Examples:

- `print('{symbol} {text} ->', {text}, '<-)`
- `customFunction({text})`

> Note: Currently this statement will be ignored from the comment/uncomment/delete functionality.

### 1.3.6. `pythonEasyPrint.hover.includeParentCall`: `boolean`

If `true`, when hovering over a word (eg. hovering over `bar` of `foo.bar`), include its parent/s to the statement.

### 1.3.7. `pythonEasyPrint.hover.includeParentheses`: `boolean`

If `true`, when hovering over a word (eg. hovering over `bar` of `bar(foo)`), include the function parentheses to the statement.

### 1.3.8. `pythonEasyPrint.logging.customLogName`: `string`

Specify a different logging instance name for the log commands. If empty, will default to `logging.debug()`.

Example: specifying `LOGGER` as a custom name will result in the following statements: `LOGGER.debug()`.

### 1.3.9. `pythonEasyPrint.logging.useRepr`: `boolean`

If `true`, the log command will include the `repr` method into its statement: `logging.debug("name: %s", repr(name))`.

## 1.4. Known Issues

- When using the command to delete, the extension will ignore the `help` statement.

## 1.5. Example Key Bindings

### 1.5.1. Prints

```json
[
    {
        "key": "ctrl+shift+l p",
        "command": "python-easy-print.easyPrint",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l t",
        "command": "python-easy-print.easyPrintType",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l r",
        "command": "python-easy-print.easyPrintRepr",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l d",
        "command": "python-easy-print.easyPrintDir",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l h",
        "command": "python-easy-print.easyHelp",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l f",
        "command": "python-easy-print.easyCustom",
        "when": "editorTextFocus"
    }
]
```

### 1.5.2. Logging

```json
[
    {
        "key": "ctrl+alt+l d",
        "command": "python-easy-print.easyLogDebug",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l i",
        "command": "python-easy-print.easyLogInfo",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l w",
        "command": "python-easy-print.easyLogWarning",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l e",
        "command": "python-easy-print.easyLogError",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l c",
        "command": "python-easy-print.easyLogCritical",
        "when": "editorTextFocus"
    }
]
```

### 1.5.3. Document

```json
[
    {
        "key": "ctrl+shift+l c",
        "command": "python-easy-print.commentPrintLines",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l u",
        "command": "python-easy-print.uncommentPrintLines",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+l x",
        "command": "python-easy-print.deletePrintLines",
        "when": "editorTextFocus"
    }
]
```

Note: you could add the `resourceLangId == python` condition to restrict commands only to python files.

```json
"when": "editorTextFocus && resourceLangId == python"
```

## 1.6. Screenshots

Simple print

![Simple Print](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/simple_print.gif)

Logging

![Simple Print](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/logging.gif)

Extra selection

![Simple Print](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/extra_selection.gif)

Comment, Uncomment & Delete

![Simple Print](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/comment_uncomment_delete.gif)
