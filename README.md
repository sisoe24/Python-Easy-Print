# Python Easy Print README

VSCode extension for easy commands of Python most useful prints.

---

**NOTE** Python 2 developers should start their file with:

```py
# -*- coding: utf-8 -*-
from __future__ import print_function
```

More info for [encoding](https://www.python.org/dev/peps/pep-0263/) and [print function](https://docs.python.org/3/library/__future__.html) on the official documentation.

---

## Features

* Fast commands to automatically print some helpful information like: `dir`, `type`, `repr`, `help` and normal `print`.
* Commands can be activate by selecting the whole word/s or just by hovering the cursor over.
* Comment, uncomment and delete statements made by extension.

## Commands & Key bindings

The main shortcut to remember is `ctrl+shift+l`. Then the initial letter of the action you will like tu execute:

 `p` for `print`, `d` for `dir`, `t` for `type` and so. The only different is `x` for delete

| Command ID                              | Key              |
| --------------------------------------- | ---------------- |
| `python-easy-print.easyPrint`           | `ctrl+shift+l p` |
| `python-easy-print.easyPrintDir`        | `ctrl+shift+l d` |
| `python-easy-print.easyPrintType`       | `ctrl+shift+l t` |
| `python-easy-print.easyPrintRepr`       | `ctrl+shift+l r` |
| `python-easy-print.easyHelp`            | `ctrl+shift+l h` |
| `python-easy-print.commentPrintLines`   | `ctrl+shift+l c` |
| `python-easy-print.uncommentPrintLines` | `ctrl+shift+l u` |
| `python-easy-print.deletePrintLines`    | `ctrl+shift+l x` |

MacOS: `ctrl` == `cmd`

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing: `Python EasyPrint...`

Every command can be re-assigned to a new shortcut. (see [docs](https://code.visualstudio.com/docs/getstarted/keybindings) for more info)

## Extension Settings

* `pythonEasyPrint.customizeLogMessage`: Customize the print message by adding some extra information like custom string or by using one of the placeholder provided: `%t`: time, `%f`: filename, `%l`: line num.

## Known Issues

* When using the command to delete, the extension will ignore the `help` statement.
* When using `type`, `dir` or `help` with more than 1 word (`foo, bar`), extension will include them inside the same call and thus Python will fail to execute: `print(" -> foo, bar :", type(foo, bar))`

## Screenshots

<img title="Settings" src="https://github.com/sisoe24/Python-Easy-Print/blob/main/images/example_settings.png?raw=true" width="100%"/>

<img title="HoverOrSelection" src="https://github.com/sisoe24/Python-Easy-Print/blob/main/images/hover_selection.gif?raw=true" width="80%"/>

<img title="Example" src="https://github.com/sisoe24/Python-Easy-Print/blob/main/images/example_statements4.gif?raw=true" width="80%"/>

<img title="CommentUncommentDelete" src="https://github.com/sisoe24/Python-Easy-Print/blob/main/images/comment_uncomment_delete.gif?raw=true" width="90%"/>