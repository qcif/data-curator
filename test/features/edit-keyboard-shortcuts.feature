Feature: Initiate an edit feature using a keyboard shortcut
As a User
I want to select a command using a keyboard shortcut
So that I can initiate a command using the keyboard instead of the mouse

Some keyboard shortcut are specific to an operating system e.g. Hide Application using command + H on macOS

  Scenario Outline: Initiate an edit feature using a keyboard shortcut
    Given I have opened Data Curator in an <operating system>
     When I use a <operating system> <shortcut>
     Then the <edit command> is initiated

    Examples:
      | edit command                                                              | windows shortcut       | linux shortcut                     | macOS shortcut |
      | Insert column right (if in rightmost column)                              | Tab                    |                                    |                |
      | Open cell editor                                                          | F2                     |                                    |                |
      | Cancel editing and close cell editor                                      | Esc                    |                                    |                |
      | Empty cell                                                                | Backspace or Delete    |                                    |                |
      | Fill all selected cells with edited cell's value                          | Control + Enter        |                                    |                |
      | Move to the cell above current active cell (if exists)                    | up arrow               | up arrow                           |                |
      | Move to cell underneath current active cell (if exists)                   | down arrow             | down arrow                         |                |
      | move to the cell on the right side of the current active cell (if exists) | right arrow            | right arrow                        |                |
      | move to the cell on the left side of current active cell (if exists)      | left arrow             | left arrow                         |                |
      | Move to the cell on the right side of the current active cell (if exists) | Tab                    | Tab                                |                |
      | Move to the cell on the left side of current active cell (if exists)      | Shift + Tab            | Shift + Tab                        |                |
      | Move to the first cell in a row                                           | Home                   | fn + right arrow                   |                |
      | Move to the last cell in a row                                            | End                    | fn + left arrow                    |                |
      | Move to the first cell in a column                                        | Control + Home         | Command + fn + right arrow         |                |
      | Move to the last cell in a column                                         | Control + End          | Command + fn+  left arrow          |                |
      | Extend selection of the cell underneath                                   | Shift + right arrow    |                                    |                |
      | Extend selection of the cell on the right                                 | Shift + left arrow     |                                    |                |
      | Extend selection of the cell on the left                                  | Shift + up arrow       |                                    |                |
      | select all cells in the row to the right including the current cell       | Shift + Home           | Shift + fn + right arrow           |                |
      | Select all cells in the row to the left including the current cell        | Shift + End            | Shift + fn + left arrow            |                |
      | Select all cells in the column to the top including the current cell      | Control + Shift + Home | Command + Shift + fn + right arrow |                |
      | Select all cells in the column to the bottom including the current cell   | Control + Shift + End  | Command + Shift + fn + left arrow  |                |
  
