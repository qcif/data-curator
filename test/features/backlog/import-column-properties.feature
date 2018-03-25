@backlog

Feature: Import Column Properties
  As a Data Packager
  I want access a [library of pre-defined column properties](https://github.com/Stephen-Gates/table-schema-snippets/blob/master/mobile-phone-number-au.json)
  So that I can quickly and consistently apply column properties to similar data

  Scenario: Import Column Properties
    Given Data Curator is open
    And the cursor is in a data tab
    When I invoke the "Import Column Properties" command
    Then a prompt, requesting the 'filename' and location, or a url is shown
    And only files ending with a ".json" can be selected
    And the contents of the file is validated as being a valid table schema fragment
    And the values are decoded and inserted into the relevant Column Properties
