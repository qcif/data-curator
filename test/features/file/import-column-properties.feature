Feature: Import Column Properties
  As a User
  I want to import column properties
  So that I can view the columns metadata in a data package table
  And use my existing table data

  Scenario: Open a valid column-properties json file where number of fields does not equal the current Data Curator table header length
    Given Data Curator is open
    And the current table has a header length of 3
    When "Import Column Properties" is invoked
    And a valid json file at a local file is selected with 5 fields
    Then an error message should be displayed


  Scenario: Open a valid column-properties json file
    Given Data Curator is open
    And the current table has a header length of 5
    When "Import Column Properties" is invoked
    And a valid json file at a local file is selected with 5 fields
    Then each column should have metadata matching the fields type.
    And the "Tools->Lock Table Schema" Menu should be selected
    And Column Properties should be locked
    And "Guess" menu should be locked

  Scenario: Open a valid column-properties json URL
    Given Data Curator is open
    And the current table has a header length of 5
    When "Import Column Properties->json from URL..." is invoked
    And a valid json URL source is selected
    Then each column should have metadata matching the fields type.
    And the "Tools->Lock Table Schema" Menu should be selected
    And Column Properties should be locked
    And "Guess" menu should be locked

