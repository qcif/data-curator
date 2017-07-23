Feature: Save data as a separated value file

Scenario: As a Data Packager, Amanda wants to save any edits she has made to the data as a separated value file. The type of separated file will depend on the CSV dialect settings. By default this will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

Given Data Curator is open
And a data tab is open
And one value is in a cell

When Amanda selects Save from the menu, or presses Command/Control + S

Then save the data in the active data tab in the set CSV dialect
