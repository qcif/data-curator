Feature: Initiate an editor command using a keyboard shortcut
As a User
I want to invoke an editor command using a keyboard shortcut
So that I can initiate a command using the keyboard instead of the mouse

  Scenario Outline: Initiate an editor command using a keyboard shortcut
    Given I have opened Data Curator in an <operating system>
     When I use a <operating system> <shortcut>
     Then the <editor command> is invoked

    Examples:
    | Editor shortcut                                                  | Windows / Linux     | macOS      |
    | Insert row below, if in last row                                 | Enter               | Enter      |
    | Insert column after if in last column                            | Tab                 | Tab        |
    | Cancel data entry                                                | Esc                 | Esc        |
    | Delete cell contents                                             | Backspace or Delete | Delete     |
    | Fill all selected cells with the same value                      | Ctrl Enter          | ⌘ Enter    |
    | Move Up from the current cell                                    | ↑                   | ↑          |
    | Move Down from the current cell                                  | ↓                   | ↓          |
    | Move Right from the current cell                                 | → or Tab            | → or Tab   |
    | Move Left from the current cell                                  | ← or ⇧ Tab          | ← or ⇧ Tab |
    | Move to Top cell in the current column                           | Ctrl Home           | ⌘ fn ↑     |
    | Move to Bottom cell in the current column                        | Ctrl End            | ⌘ fn ↓     |
    | Move to First cell in the current row                            | Home                | fn ←       |
    | Move to Last cell in the current row                             | End                 | fn →       |
    | Select All the data in the table                                 | Ctrl A              | ⌘ A        |
    | Select Up - expand column selection to the cell above            | ⇧ ↑                 | ⇧ ↑        |
    | Select Down - expand column selection to the cell below          | ⇧ ↓                 | ⇧ ↓        |
    | Select Right - expand row selection to the cell right            | ⇧ →                 | ⇧ →        |
    | Select Left - expand row selection to the cell left              | ⇧ ←                 | ⇧ ←        |
    | Select to Top - expand column selection to all cells above       | Ctrl ⇧ Home         | ⌘ ⇧ fn ↑   |
    | Select to Bottom - expand column selection to all cells below    | Ctrl ⇧ End          | ⌘ ⇧ fn ↓   |
    | Select to First - expand row selection to all cells to the right | ⇧ Home              | ⇧ fn ←     |
    | Select to Last - expand row selection to all cells to the left   | ⇧ End               | ⇧ fn →     |
    | Right click in a cell to display the context menu                |                     |            |
    | Choose Next option in context menu                               | ↑                   | ↑          |
    | Choose Previous option in context menu                           | ↓                   | ↓          |
    | Perform Option from context menu                                 | Enter               | Enter      |
