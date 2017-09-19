@backlog

Feature: Header Row
  As a Data Packager
  I want specify if my table has a header row
  So that it is not included in "Sort Column" commands and is Frozen at the top of the table when scrolling

  Notes:
  - see https://handsontable.com/examples.html?headers&sorting
  - for version 1.0 Header row could be defaulted to on

  Header Row can be toggled on/off by a checkbox menu item
  The default setting is Header Row on (checked)

  In future releases:
  - Header row value may be set by the CSV Dialect for the Table
  - Header row default value may be set in Preferences

  Scenario: Header Row
    Given I have opened Data Curator
    And I have 1 data tab open
    When I set "Header Row" on
    Then freeze the first Row
    And use each first row value to invoke "Sort Column"
