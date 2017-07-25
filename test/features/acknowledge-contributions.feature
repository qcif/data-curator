Feature: Acknowledge Contributors
  In order to acknowledge contributors to Data Curator, which is both a legal requirement and a polite thing to do
  As the Creator of Data Curator, a current or potential Sponsor or Contributor
  I want to show who has contributed to the application by displaying names, logos, attribution statements and/or links to websites.

  Scenario: Show Contributors
    Given Data Curator is open
    When the About menu item is selected
    Then the Contributors names, logos, attribution statements and links to external websites are shown

  Scenario: I click the mouse to hide Contributors
    Given I open the Data Curator
    And I am at the About panel
    When I click the mouse outside the About panel
    Then the About panel closes

  Scenario: I click on the close button to hide Contributors
    Given I open the Data Curator
    And I am at the About panel
    When I click the Close button on the About panel
    Then the About panel closes
