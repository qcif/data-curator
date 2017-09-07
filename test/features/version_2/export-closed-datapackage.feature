@backlog @enterprise-add-in

Feature: Export Closed Data Package
  As a Data Packager
  I want to export the data and associated metadata in a data package using a non-open licence
  So that I can share usuable data under more restrictive terms that protect stakeholder interests 

  Functions the same as Export Data Package but allows a non-open licence to be applied

  Background:
    Given I have opened Data Curator
    And I have completed all the required column, table and data package properties
    And I have not selected an Open Data Licence

    Scenario: Use the menu to Export Data Package
    When I select "Export Data Package" from the menu
    Then prompt for location and name to save the file
    And assemble the data, properties and provenance information into a data package file
    And save it to the location
    And warn if an existing file will be overwritten

    Scenario: Use the toolbar to Export Data Package
    When I select "Export Data Package" from the toolbar
    Then prompt for location and name to save the file
    And assemble the data, properties and provenance information into a data package file
    And save it to the location
    And warn if an existing file will be overwritten
