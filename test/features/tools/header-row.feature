@backlog

Feature: Header Row
  As a Data Packager
  I want specify if my table has a header row
  So that it is not included in "Sort Column" commands and is Frozen at the top of the table when scrolling

  Notes:
  - see https://handsontable.com/examples.html?headers&sorting
  - for version 1.0 Header row could be defaulted to on (i.e. menu item checked)

  Header Row can be toggled on/off by a checkbox menu item
  The default setting for Header Row is "on" (checked)

  In future releases:
  - Header row value may be set by the CSV Dialect for the Table
  - Header row default value may be set in Preferences

  Scenario: Header Row On
    Given I have opened Data Curator
    And I have 1 data tab open
    When I set "Header Row" to "on"
    Then freeze the first Row
    And prevent the header row from being edited
    And use each header row value to invoke "Sort Column"
    And check the Header Row menu item

  Scenario: Header Row Off
    Given I have opened Data Curator
    And I have 1 data tab open
    And "Header Row" is on
    When I set "Header Row" to "off"
    Then unfreeze the first Row
    And use generic column labels to invoke "Sort Column"
    And uncheck the Header Row menu item
