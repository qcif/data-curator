Feature: Show Help Tags
  As a User
  I want to access context-sensitive help
  So that I can learn how to use a control without needing to shift my focus away from the application interface

  Help Tags can be invoked by hovering the cursor over a control or clicking a label.
  Help Tags can be dismissed by clicking on them.

  Controls with associatied help tags are typically:
    - Toolbar buttons
    - Field labels

  Help Tags contain simple HTML

  Rules:
    - Delay showing the help tag until the cursor has hovered over the target for a “help-tag-delay” period
    - Hide the help tag when the cursor moves off the target
    - The “help-tag-delay” period will be set to 1 second

  Scenario: Show Help Tag
    Given I have opened Data Curator
    When I invoke a Help Tag
    Then display the Help Tag after the “help-tag-delay” period

  Scenario: Hide Help Tag
    Given I have opened Data Curator
    And a Help Tag is displayed
    When I click the help tag
    Then hide the Help Tag
