@backlog

Feature: Check for update
  As a Data Curator User  
  I want to update to the lastest version of the application  
  So that I gain access to the latest bug fixes and new features  

  RULES
  =====

  - Check for update is run when you "Open Data Curator"
  - Check for update requires a connection to the Internet
  - [Software releases](https://github.com/qcif/data-curator/releases/latest) will be available on GitHub
    - Software releases must be signed with a code certificate appropriate for the <operating system>
    - Different releases are available for different <operating system> and <platform>
  - Allow the user to defer the update

  QUESTIONS
  =========

  - Many organisations are adopting application whitelisting to reduce the threat of cyber intrusions. [Application whitelisting](https://asd.gov.au/publications/protect/application_whitelisting.htm) is identified as the most effective strategy to mitigate cyber security incidents by the Australian Signals Directorate. Application whitelisting is likely to inhibit rapid deployment and inhibit the user base from using the latest application version. How should deployment be optimised to allow rapid updates?

  Scenario: No update available
    Given Data Curator is installed
    And the latest release for the <operating system> and <platform> is installed
    When "Open Data Curator" is invoked
    Then a check for a newer software release for the <operating system> and <platform> should  determine that none is available
    And the application should open using the currently installed version

  Scenario: Update available and user installs update
    Given Data Curator is installed
    And a newer release for the <operating system> and <platform> is available
    When Data Curator is opened
    Then a check for a newer release for the <operating system> and <platform> should determine that one is available
    And the release notes should be shown
    And a prompt to install/defer should be shown
    And the new release should be downloaded and installed 
    And the application should be restarted

  Scenario: Update available and user defers update
    Given Data Curator is installed
    And a newer release for the <operating system> and <platform> is available
    When Data Curator is opened
    Then a check for a newer software release for the <operating system> and <platform> should  determine that one is available
    And the release notes should be shown
    And a prompt to install/defer should be shown
    And the application should open using the currently installed version
