@backlog @enterprise-add-in

Feature: Print
  As a Data Packager
  I want print out key portions of the data package
  So that I can present them to the Data Custodian and seek approval to release the open data

  Notes:
  - see https://electron.atom.io/docs/api/web-contents/#webcontentsprintoptions for implementation option
  - demonstrated in https://github.com/electron/electron-api-demos

  'Print' can be invoked by a menu item or a keyboard shortcut

  Scenario: Use the menu to close all tabs, all work saved
    Given I have opened Data Curator
    And I have saved a Data Package
    When I invoke 'Print'
    Then print a one page sample of the Data
    And a human-readable view of the Table Schema (all the Column Properties)
    And a human-readable view of the Table Properties
    And a rendered version of the View
    And a rendered version of the Provenance Information markdown
    And a human-readable view of the Data Quality Information
    And a human-readable view of the Data Package Properties
