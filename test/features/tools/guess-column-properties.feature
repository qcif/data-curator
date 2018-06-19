Feature: Guess Column Properties
  As a Data Packager
  I want to derive as many column properties as possible from the data and the CSV dialect
  So that I can quickly set the column properties

  RULES
  =====

    - The "Guess Column Properties" command can be invoked using a menu item or a toolbar button
    - Read a sample of the data and for each column, infer the data type and format and set the 'type' and 'format' property values to the inferred values

  LATER
  =====

    - If column properties for `type`, `format` and `constraints` already exist, then prompt the user to ask if they should be over-written.

  @dev
  @impl
  Scenario Outline: Guess column properties immediately after opening Data Curator
    Given Data Curator is open
    When "<name>" is invoked using the "<type>": "<sequence>"
    Then the failure message should be displayed with message "Guess column properties failed"
    Examples:
    | name                     | type                        | sequence                       |
    | Guess Column Properties  | toolbar menu button         | Guess                          |
    | Guess Column Properties  | application menu selection  | Tools->Guess Column Properties |

  Scenario: Guess column properties
    Given Data Curator is open
    And 1 data tab is displayed
    When "Guess Column Properties" is invoked
    Then set the 'name' property for each column to the value in the first row of the column
    And infer the column 'type' and 'format' properties from a sample of the data
    And open the Column Properties panel for the first column

  Scenario: Guess column properties will overwrite existing properties
    Given Data Curator is open
    And column properties exist
    When "Guess Column Properties" is invoked
    Then a prompt to continue/cancel should be displayed
