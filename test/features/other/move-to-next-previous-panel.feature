Feature: Move to Next / Previous Properties Panel
  As a Data Packager
  I want to move sequentially through each column, table and data package panel
  So that I can progressively set properties for each component to be packaged

  If there is only one data table, then the advance sequence would be:
  - column 1
  - column 2
  - ...
  - column n (the last column in the table)
  - table
  - provenance information
  - data package

  If there is more than one data table, then the Move to Next sequence would be:
  - column 1 in table 1
  - column 2 in table 1
  - ...
  - column n (the last column in the table 1)
  - table 1
  - column 1 in table 2
  - column 2 in table 2
  - ...
  - column n (the last column in the table 2)
  - ... repeat for remaining columns and tables until on column n in table n (the last column in the last table)
  - provenance information
  - data package

  The Move to Previous sequence is the opposite of above

  Hide button rules:
  - In column 1 in table 1 the previous button should be hidden
  - In the data package panel the next button should be hidden

  Scenario: Use the next button to move to the next logical Properties Panel
    When I select "Next" in a Properties panel
    Then display the next logical panel in the Move to Next sequence

  Scenario: Use the next button to move to the next logical Properties Panel
    When I select "Next" in a Properties panel
    Then display the next logical panel in the Move to Next sequence
