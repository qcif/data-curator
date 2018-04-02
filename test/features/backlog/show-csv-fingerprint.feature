@backlog @draft

Feature: Show validation results as a graphic
  As a Data Packager
  I want to get an overview of my data
  So that I can see at a high-level what problems I have to solve after validating the data

  Consider providing a graphic overview of missing data and type mismatches

  See http://setosa.io/blog/2014/08/03/csv-fingerprints/

  Scenario: Show validation results as a graphic
    Given Data Curator is open
    And I have validated the table
    When I select "Show overview" on the error message panel
    Then display a csv-fingerprint graphic in the panel

  Scenario: Hide validation results graphic
    Given Data Curator is open
    And I have shown the overview on the error message panel
    When I select "Close overview" on the error message panel
    Then hide the csv-fingerprint graphic in the panel
