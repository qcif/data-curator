Feature: Edit data
  In order to correct errors found in the data or add new data
  As a Data Packager
  I want to quickly add, modify or delete data, rows and columns in the data table.

  Scenario: Enter value into Table

     Given Data Curator is open
       And the cursor is in a table cell

      When A value is typed

      Then the value is updated in the cell
       But the data is not saved to file.


  Scenario: Use edit menu commands
    Should I create a scenario for all shortcuts?

     Given Data Curator is open
       And the cursor is in a table cell

      When any of the following menu items are pressed
            - undo
            - redo
            - cut
            - copy
            - paste
            - select all
            - insert row above
            - insert row below
            - insert column before
            - insert column after
            - delete row(s)
            - delete column(s)

      Then the corresponding action is performed.


  Scenario: Use editor shortcuts
    Should I create a scenario for all shortcuts?

     Given Data Curator is open
       And the cursor is in a table cell

      When an editor shortcut is pressed (see them all at  https://stephen-gates.github.io/csv-lingo/topic/all-topics.html#shortcuts-editor)

      Then the corresponding action is performed.
