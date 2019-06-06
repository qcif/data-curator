Feature: Save
  As an Data Packager
  I want to save the changes made to the data in the active data tab using the appropriate CSV dialect settings
  So that I can progressively save my work

  RULES
  =====

  - The "Save" command can be invoked from a menu item or a keyboard shortcut
  - The "Save" command is only enabled after a file has been saved for the first time using "Save As"

  LATER
  =====

  - Write the size of the file to the `bytes` table property

  Scenario: Save data
    Given Data Curator is open
    And one data tab is open
    And the data has been saved at least once
    When "Save" is invoked
    Then the data in the active tab should be saved at its current location and filename
    And the file size in bytes should be written to the `bytes` table property

  @impl
  Scenario Outline: Enter text and save, capturing all of the text
    Given Data Curator is open
    And the table should have 1 row by 3 columns
    When the user clicks in row 1, column 1
    And the user presses keys: <keys>
    Then the saved data should match: <expected>
    Examples:
      | keys                         | expected       |
      | ["t","Tab","a"]              | ["t,a,"]       |
      | ["t","Tab","a","Return","x"] | ["t,a,","x,,"] |
