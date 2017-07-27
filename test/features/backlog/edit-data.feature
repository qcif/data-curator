@backlog @sprint-1

Feature: Edit data
  In order to correct errors found in the data or add new data
  As a Data Packager
  I want to quickly add, modify or delete data, rows and columns in the data table.

# Do I add all the keyboard shortcuts as scenarios as well? https://stephen-gates.github.io/csv-lingo/topic/all-topics.html#shortcuts-editor

  Scenario: Enter value into Table
    Given I have opened Data Curator
    And the cursor is in a table cell
    When A value is typed
    Then the value is updated in the cell
    But the data is not saved to file.

  Scenario: Undo Edit
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Redo Edit
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Cut
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Copy
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Paste
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Select All
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Insert Row Above
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Insert Row Above
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Insert Column Before
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.


  Scenario: Insert Column After
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Delete Row(s)
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.

  Scenario: Delete Row Column(s)
#   Should I create a scenario for all shortcuts?
    Given I have opened Data Curator
    And an edit function has been performed (e.g. add row) or data typed in cell
    When Undo is selected from the menu, or
    When using macOS, the Command + Z shortcut is pressed, or
    When using Windows, the Control + Z shortcut is pressed, or
    When using Linux, the Control + Z shortcut is pressed
    Then reverse the last edit function or data entry.
