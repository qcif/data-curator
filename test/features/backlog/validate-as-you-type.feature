@backlog @draft

Feature: Validate as you type
  As a Data Packager
  I want the data as it is entered to be checked against the column properties
  So that I am immediately warned of any data entry errors

  Scenario: Validate as you type
    Given Data Curator is open
    When a value is typed in a cell
    Then check the data complies with the "Type", "Format" and "Constraints" in column properties
    And highlight the cell if the data value does not comply
