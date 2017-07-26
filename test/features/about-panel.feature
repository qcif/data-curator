Feature: About Panel
  In order to acknowledge contributors to Data Curator, which is both a legal requirement and a polite thing to do
  As the Creator of Data Curator, a current or potential Contributor
  I want to show who has contributed to the application, attribution statements and/or links to websites.

  In order to assist with debugging and support
  As a Maintainer of Data Curator
  I want to know the version of the application being used

  Scenario: I use the menu to show Contributors
    Given I have opened Data Curator
    When the About menu item is selected
    Then the Contributor names
    And Major Contributor logos
    And attribution statements
    And links to external websites
    And the Application logo
    And the Application name
    And the Application version, are shown

  Scenario: I click the mouse to hide Contributors
    Given I have opened Data Curator
    And I have displayed the About panel
    When I click the mouse outside the About panel
    Then the About panel closes

  Scenario: I click on the close button to hide Contributors
    Given I have opened Data Curator
    And I have displayed the About panel
    When I click the Close button on the About panel
    Then the About panel closes
