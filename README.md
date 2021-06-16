# Python Easy Print README

VSCode extension for easy commands of Python most useful prints.

---

**NOTE** for Python 2: Because the extension uses an utf-8 character to create statements, Python2 developers must declare the encoding the the beginning of the file: `#coding: utf-8`. More info [here](https://www.python.org/dev/peps/pep-0263/).

---

## Features

* Fast commands to automatically print some helpful information like: `dir`, `type`, `help` and normal `print`.
* Commands can be activate by selecting the whole word/s or just by hovering the cursor over.
* Comment, uncomment and delete statements made by extension.

Multiple helpers:
[<img title="Multiple helpers" src="/images/example_statements4.gif" width="500"/>](/images/example_statements4.gif)

Hover or select:
[<img title="Select or Hover" src="/images/hover_selection.gif" width="500"/>](/images/hover_selection.gif)

Comment, uncomment and delete:
[<img title="Comment, uncomment and delete" src="/images/comment_uncomment_delete.gif" width="500"/>](/images/comment_uncomment_delete.gif)

## Extension Settings

* `pythonEasyPrint.customizeLogMessage`: Customize the print message by adding some extra information like custom string or by using one of the placeholder provided: `%t`: time, `%f`: filename, `%l`: line num.

![customize_message](/images/example_settings.png)

## Commands & Key bindings

MacOS: `ctrl` == `cmd`

| Commands                                | Key              |
| --------------------------------------- | ---------------- |
| `python-easy-print.easyPrint`           | `ctrl+shift+l p` |
| `python-easy-print.easyPrintDir`        | `ctrl+shift+l d` |
| `python-easy-print.easyPrintType`       | `ctrl+shift+l t` |
| `python-easy-print.easyHelp`            | `ctrl+shift+l h` |
| `python-easy-print.commentPrintLines`   | `ctrl+shift+l c` |
| `python-easy-print.uncommentPrintLines` | `ctrl+shift+l u` |
| `python-easy-print.deletePrintLines`    | `ctrl+shift+l x` |

## Known Issues

* When using the command to delete, the extension will ignore the `help` statement.
* When using `type`, `dir` or `help` with more than 1 word (`foo, bar`), extension will include them inside the same call and thus Python will fail to execute: `print(" -> foo, bar :", type(foo, bar))`

## Release Notes

### 0.0.1

Initial release of Python EasyPrint.
