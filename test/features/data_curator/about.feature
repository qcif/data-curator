Feature: About
  As a Data Packager or Data Consumer
  I want to know the version of the application
  So that I can inform the Maintainer about issues I experience using a version of the application

  As a Sponsor, Contributor or Maintainer of the application
  I want to see acknowledgement of my contribution
  So that I can confirm that licencing requirements or other obligations have been met

  RULES
  =====

    - The "About" command can be invoked using a menu item
    - The "Close About Panel" is invoked using a button on the About panel

  Scenario: Show the About panel
    Given Data Curator is open
    When "About" is invoked
    Then the Contributor names
    And Major Contributor logos
    And attribution statements
    And links to external websites
    And the Application logo
    And the Application name
    And the Application version, are shown

  Scenario: Close the About panel
    Given Data Curator is open
    And the About panel is displayed
    When "Close About Panel" is invoked
    Then the About panel closes
