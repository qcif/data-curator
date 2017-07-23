Feature: Close all tabs

Scenario: As a Data Packager, Amanda wants to close all open tabs
  as she has finished working with the data.

Given Data Curator is open
And one or more data tabs are open

When Amanda selects Close all Tabs from the menu

Then check that data has been saved
And if it has, close all the tabs
And if it hasn't, prompt Amanda to save the unsaved data in its current CSV Dialect
