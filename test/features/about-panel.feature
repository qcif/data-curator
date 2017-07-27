Feature: About panel
  In order to acknowledge contributors to Data Curator, which is both a legal requirement and a polite thing to do
  As the Creator of Data Curator, a current or potential Contributor
  I want to show who has contributed to the application, attribution statements and/or links to websites.

  In order to assist with debugging and support
  As a Maintainer of Data Curator
  I want to know the version of the application being used

  Scenario: Use the menu to show Contributor and Application information
    Given I have opened Data Curator
    When I select the About menu item 
    Then the Contributor names
    And Major Contributor logos
    And attribution statements
    And links to external websites
    And the Application logo
    And the Application name
    And the Application version, are shown

  Scenario: Click outside the About panel to hide the panel
    Given I have opened Data Curator
    And I have displayed the About panel
    When I click the mouse outside the About panel
    Then the About panel closes

  Scenario: Click on the About panel close button to the panel
    Given I have opened Data Curator
    And I have displayed the About panel
    When I click the Close button on the About panel
    Then the About panel closes
