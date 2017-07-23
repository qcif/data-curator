Feature: Close tab

Scenario: As a Data Packager, Amanda wants to close an open tab
  as she has finished working with that data table.

Given Data Curator is open
And one or more data tabs are open

When Amanda selects the Close ("X") icon on the tab she wishes to close

Then check that the data has been saved
And if it has, close the tab
And if it hasn't, prompt Amanda to save the unsaved data in its current CSV Dialect
