Feature: Import Column Properties
  As a Data Packager
  I want access a library of pre-defined column properties
  So that I can quickly and consistently apply column properties to similar data

  Scenario: Import Column Properties
    Given I have opened Data Curator
    And the cursor is in a column in a data tab
    When I invoke the "Import Column Properties" command
    Then a prompt, requesting the 'filename' and location, or a url is shown
    And only files ending with a ".json" can be selected
    And the contents of the file is validated as being a valid table schema fragment
    And the values are decoded and inserted into the relevant Column Properties
