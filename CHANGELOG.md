# Change Log

## [0.4.2] - 2022-03-05

### Added

- New placeholder `%w` for the active file relative path from workspace root directory.

## [0.4.1] - 2022-02-03

### Fixed

- Fixed a regex match that would potentially cause the extension to freeze when
printing the argument of a very long function name.

## [0.4.0] - 2022-01-15

### Added

- Custom statement.
- Print to newline.
- Change unicode character.

### Removed

- Default shortcut for the `help` statement.

## [0.3.0] - 2021-11-21

### Added

- Logging commands.
- Setting to include parent calls of hover word.
- Setting to include function call of hover word.
- Insert text out of code block when possible.

### Changed

- Command `Easy print settings for Python2` has been renamed to `Add py2 header statement`. This is to be able to write `py2` in the Command palette for quick find.

### Fixed

- Multiple statements can be printed individually, and is now a setting.

## [0.2.0] - 2021-07-30

- Added new command: `python-easy-print.easyPrintPy2` to initiate a Python2 file with the encoding declared and the `print_function` imported.

## [0.1.0] - 2021-07-30

- Added `repr` to the available commands.

## [0.0.1] - 2021-06-16

- Initial release
