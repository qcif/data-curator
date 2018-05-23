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

  USER INTERFACE
  ==============

  ![About panel user interface](https://raw.githubusercontent.com/ODIQueensland/data-curator/develop/static/img/ui/about.png)

  Scenario: Show the About panel
    Given Data Curator is open
    When "About" is invoked
    Then the Major Contributor names, attribution statements, and logos with link to external websites should be shown
    And the Application logo, name, and version should be shown

  Scenario: Close the About panel
    Given Data Curator is open
    And "About" is invoked
    When "Close About Panel" is invoked
    Then the About panel should close
