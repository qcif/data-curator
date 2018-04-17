@backlog

Feature: Save progress
  As an Data Packager
  I want to save work in progress  
  So that I can come back to my work later without losing any information I've entered  

  Working with complex data with many foreign key relationships or even dealing with a laptop battery issue, can take time. It would be good to save the work done so far; Saving all work done as a potentially invalid datapackage.zip file.

  RULES
  =====
  
  - Data must be saved first
  - All data, properties and provenance information are saved as a [tabular data package](https://frictionlessdata.io/specs/tabular-data-package/) in a .zip file
  - No validation is performed
  - "Save Progress" can be invoked from the menu or shortcut

  QUESTIONS
  =========

  - What should the menu item be called?
  - What should be the keyboard shortcut?
  - Should the name of the .zip file have something to indicate that it's work in progress or should that be left to the user?

  Scenario: Save progress
    Given Data Curator is open
    And all data has been saved
    And some properties have been entered or derived
    When "Save Progress" is invoked
    Then a prompt for location and name to save the file should be displayed
    And the data, properties and provenance information should be saved into a .zip file
