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

- [1. Python Easy Print](#1-python-easy-print)
  - [1.1. Features](#11-features)
  - [1.2. How to use](#12-how-to-use)
  - [1.3. Commands & Key bindings](#13-commands--key-bindings)
  - [1.4. Extension Settings](#14-extension-settings)
  - [1.5. Known Issues](#15-known-issues)
  - [1.6. Example Key Bindings](#16-example-key-bindings)
  - [1.7. Demo](#17-demo)

## 1.1. Features

- Commands for print statements: `dir`, `type`, `repr`, `help` and basic `print`.
- Commands for logging statements: `debug`, `info`, `warning`, `error` and `critical`.
- Commands can be activate by manually selected text or by hovering the cursor over.
- Comment, uncomment and delete statements made by extension.
- Quick command to initiate a Python 2 file with the declarations needed to use the extension.

## 1.2. How to use

> **NOTE**: Python 2 developers should start their file with the following declaration or use the included command when using this extension. (More info for [encoding](https://www.python.org/dev/peps/pep-0263/) and [print function](https://docs.python.org/3/library/__future__.html) on the official documentation):
>
> ```py
> # coding: utf-8
> from __future__ import print_function
> ```

- Manually select a piece of text or hover over it with the cursor, and use one of the commands provided.

![Print](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/print.gif)

## 1.3. Commands & Key bindings

> **NOTE**: To avoid shortcuts conflicts, default key bindings might be removed in the future versions.

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing: `Python EasyPrint...`

| Command Name             | Command ID                              | Shortcut         |
| ------------------------ | --------------------------------------- | ---------------- |
| print                    | `python-easy-print.easyPrint`           | `ctrl+shift+l p` |
| dir                      | `python-easy-print.easyPrintDir`        | `ctrl+shift+l d` |
| type                     | `python-easy-print.easyPrintType`       | `ctrl+shift+l t` |
| repr                     | `python-easy-print.easyPrintRepr`       | `ctrl+shift+l r` |
| help                     | `python-easy-print.easyHelp`            |                  |
| custom                   | `python-easy-print.easyCustom`          |                  |
| comment                  | `python-easy-print.commentPrintLines`   |                  |
| uncomment                | `python-easy-print.uncommentPrintLines` |                  |
| delete                   | `python-easy-print.deletePrintLines`    |                  |
| Add py2 header statement | `python-easy-print.easyPrintPy2`        |                  |
| debug                    | `python-easy-print.easyLogDebug`        |                  |
| info                     | `python-easy-print.easyLogInfo`         |                  |
| warning                  | `python-easy-print.easyLogWarning`      |                  |
| error                    | `python-easy-print.easyLogError`        |                  |
| critical                 | `python-easy-print.easyLogCritical`     |                  |

- Every command can be re-assigned to a new shortcut.(see [Key Bindings for Visual Studio Code](https://code.visualstudio.com/docs/getstarted/keybindings) for more information)
- The main shortcut to remember is `ctrl+shift+l`. Then the initial letter of the action you will like to execute: `p` for `print`, `d` for `dir`, `t` for `type` and so.
- The Python2 command includes the word `py2` to make the search in the command palette faster.
- MacOS: `ctrl` == `cmd`
- See [Example Key Bindings](#16-example-key-bindings) for more shortcuts example.

## 1.4. Extension Settings

- `pythonEasyPrint.prints.addCustomMessage`: `string`

  Customize the print message by adding some extra information with some text or by using one of the placeholder provided:

  - `%f`: File name.
  - `%l`: Line number.
  - `%F`: Function parent.
  - `%w`: Relative path of active file from workspace root.

  Examples:
  - VS Code friendly terminal hyperlink: `%w:%l`

    ![VscodeTerminalHyperlink](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/vscode_friendly2.gif)

- `pythonEasyPrint.multipleStatements`: `boolean`

  If `true`, when manually selecting multiple statements (eg: `foo, bar`), print each one individually.

  > **NOTE**: This settings might be removed in future version as it will create problem with other statements like `type`, `dir`, when `false`.

- `pythonEasyPrint.printToNewLine`: `boolean`

  If `true`, will insert a newline character in the print:

  ```py
  print("➡ name :\n", name)
  ```

- `pythonEasyPrint.customSymbol`: `string`

  A custom unicode symbol to be used inside the print. Could also be an emoji: 👉 (as symbol representation, not the unicode code point).

- `pythonEasyPrint.customStatement`: `string`

  A custom statement to be used with the command `Python EasyPrint: custom`. This allows for a complete new statement to be generated. In addition to the placeholders mentioned in _Add Custom Message_, the following two placeholders will be available:

  - `{text}`: The selected/hover text.
  - `{symbol}`: The unicode character.

  Examples:

  - `print('{symbol} {text} ->', {text}, '<-')`
  - `customFunction({text})`

    ![customPrint](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/customPrint.gif)

  > Note: This statement will be ignored from the comment/uncomment/delete commands.

- `pythonEasyPrint.hover.includeParentCall`: `boolean`

    If `true`, when hovering over a word (eg. hovering over `bar` of `foo.bar`), include its parent/s to the statement.

- `pythonEasyPrint.hover.includeParentheses`: `boolean`

    If `true`, when hovering over a word (eg. hovering over `bar` of `bar(foo)`), include the function parentheses to the statement.

    ![extraSelections](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/extra_selections.gif)

- `pythonEasyPrint.logging.customLogName`: `string`

    Specify a different logging instance name for the log commands. If empty, will default to `logging`. Example: specifying `LOGGER` as value, will result in:

    ```py
    LOGGER.debug("name: %s", name)
    ```

- `pythonEasyPrint.logging.useRepr`: `boolean`

    If `true`, the log command will include the `repr` method into its statement:

    ```py
    logging.debug("name: %s", repr(name))
    ```

## 1.5. Known Issues

- When using the command to delete, the extension will ignore the `help` statement.

## 1.6. Example Key Bindings

Prints

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

Logging

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

Document

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

## 1.7. Demo

Logging

![Simple Print](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/logging.gif)

Comment, Uncomment & Delete

![Simple Print](https://raw.githubusercontent.com/sisoe24/Python-Easy-Print/main/images/comment_uncomment_delete.gif)
