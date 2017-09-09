@backlog

Feature: Read Only Mode
  As a Data Packager or Data Consumer
  I want to view data package components in a read-only mode
  So that I do not make unintended changes

  Scenario: Read Only Mode
    Given I have opened Data Curator
    And I have opened a file
    When I invoke the "Read Only Mode" command
    Then disable all data entry fields
    And disable all tools that can change any value
