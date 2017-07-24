Feature: Guess column properties
  In order to complete the properties for each column quickly
  As a Data Packager
  I want to quickly derive as many column properties as possible from the data and the CSV dialect. 

  Scenario: Guess column properties

     Given Data Curator is open
       And one data tab is open

      When Guess Column Properties is selected from the menu

      Then for each column, if the Header Row is set to in the CSV Dialect, then set the name property to the value in the first row of the column.
       http://specs.frictionlessdata.io/table-schema/#name
      And the infered Type and Format will become the type and format for each column http://specs.frictionlessdata.io/table-schema/#types-and-formats
      But if column properties already exist for the guessed properties, Amanda will be asked if she wants to over-write them.
