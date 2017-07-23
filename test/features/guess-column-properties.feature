Feature: Guess column properties
In order to complete the properties for each column quickly
As a Data Packager (Amanda)
I want to press a button and quickly derive as many column properties as possible from the data.


Scenario: Scenario name
  the scenario name is returned in failing test - use Given and When (not Then) in the name.

Given Data Curator is open
And one data tab is open

When Amanda selects Guess Column Properties from the menu

Then the name from the Header Row (if the table has a Header Row) will become the Name property for each column http://specs.frictionlessdata.io/table-schema/#name
And the infered Type and Format will become the type and format for each column http://specs.frictionlessdata.io/table-schema/#types-and-formats
But if column properties already exist for the guessed properties, Amanda will be asked if she wants to over-write them.
