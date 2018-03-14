Feature: Guess Column Properties
  As a Data Packager
  I want to derive as many column properties as possible from the data and the CSV dialect
  So that I can quickly set the column properties

  The "Guess Column Properties" command can be invoked using a menu item or a toolbar button

  Read the first 100 rows of the data and for each column, infer the data type and format and set the 'type' and 'format' property values to the inferred values.

  If column properties already exist for the guessed properties, then prompt the user to ask if they should be over-written.

  @impl
  Scenario: Guess column properties immediately after opening Data Curator
    Given I have opened Data Curator
    When I invoke the Guess Column Properties command
    Then I should see the failure message

  Scenario: Guess column properties
    Given I have opened Data Curator
    And I have opened 1 data tab
    When I invoke the "Guess Column Properties" command
    Then set the 'name' property for each column to the value in the first row of the column
    And infer the column 'type' and 'format' properties from a sample of the data
    And open the Column Properties panel for the first column
