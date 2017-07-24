Feature: Edit data
In order to <meet some goal>
As a <type of stakeholder>
I want <a feature>

As a Data Packager, Amanda wants to edit the data when she finds an error. As a Data Creater, Jason wants to create new data by quickly typing values into a table

Scenario: Enter value into Table

Given Data Curator is open
Add the cursor is in a table cell

When Amanda types a value

Then the value is updated in the cell
But the data file is not saved

Scenario: Use edit menu commands

Given

When
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


Then


Scenario: Use editor shortcuts
  Should I create a scenario for all shortcuts?

Given Data Curator is open
Add the cursor is in a table cell

When Amanda uses an editor shortcut https://stephen-gates.github.io/csv-lingo/topic/all-topics.html#shortcuts-editor

Then the corresponding action is performed.
