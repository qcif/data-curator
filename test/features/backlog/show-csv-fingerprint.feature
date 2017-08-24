@backlog @ready

Feature: Show CSV Fingerprint
  As a Data Packager
  I want to get an overview of my data
  So that I can see at a high-level what problems I have to solve

  Consider providing a graphic overview of missing data and type mismatches

  See http://setosa.io/blog/2014/08/03/csv-fingerprints/

  Scenario: Show CSV Fingerprint
    Given I have opened Data Curator
    And I have 1 or more data tabs open
    When I select "Show overview" in the menu
    Then display a csv-fingerprint graphic

  Scenario: Hide validation results graphic
    Given I have opened Data Curator
    And I have shown the csv fingerprint
    When I select "Close " on the csv fingerprint panel
    Then hide the csv-fingerprint graphic
    
