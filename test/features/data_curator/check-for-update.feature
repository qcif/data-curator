@backlog

Feature: Check for update
  As a Data Packager or Data Consumer
  I want to update to the lastest version of the application
  So that I gain access to the lastest bug fixes and new features

## Rules

  - Check for update is run when you "Open Data Curator"
  - Check for update requires a connection to the Internet
  - [Software releases](https://github.com/ODIQueensland/data-curator/releases/latest) will be available on GitHub
    - Software releases must be signed with a code certificate appropriate for the <operating system>
    - Different releases are available for different <operating system> and <platform>
  - Allow the user to defer the update

## Unresolved

  - Many organisations are adopting application whitelisting to reduce the threat of cyber intrusions.  [Application whitelisting](https://asd.gov.au/publications/protect/application_whitelisting.htm) is identified as the most effective strategy to mitigate cyber security incidents by the Australian Signals Directorate. Application whitelisting is likely to inhibit rapid deployment and supporting the user base to use the latest application version

  Scenario: No Update available
    Given Data Curator is installed
    And the latest release for my <operating system> and <platform> is installed
    When Data Curator is opened
    Then check if a newer release is available for my <operating system> and <platform>
    And Open Data Curator using the currently installed version

  Scenario: Update available, User installs update
    Given Data Curator is installed
    And a newer release for my <operating system> and <platform> is available
    When Data Curator is opened
    Then check if newer release is available for my <operating system> and <platform>
    And display the release notes and prompt for action
    And user selects 'Install Update'
    And download and install the application update
    And restart the application

  Scenario: Update available, User defers update
    Given Data Curator is installed
    And a newer release for my <operating system> and <platform> is available
    When Data Curator is opened
    Then check if newer release is available for my <operating system> and <platform>
    And display the release notes and prompt for action
    And user selects 'Remind Me Later'
    And Open Data Curator using the currently installed version 
