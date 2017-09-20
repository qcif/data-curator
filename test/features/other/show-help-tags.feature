Feature: Show Help Tags
  As a User
  I want to access context-sensitive help
  So that I can learn how to use a control without needing to shift my focus away from the application interface

  Help Tags will be displayed when a User hovers their cursor over a control or clicks a label.
  Help Tags can be dismissed by clicking on them.

  Controls with associatied help tags are typically:
    - Toolbar buttons
    - Field labels

  Help Tag content may contain simple HTML:
   - simply formatted text e.g. `<b>Don’t</b><br> press this button <hr>`
   - a text or icon hyperlink to an external URL e.g.  `<a href=”url”>learn more <i class="fa fa-question-circle"></i></a>`

  Rules:
    - Delay showing the help tag until the cursor has hovered over the target for a “help-tag-delay” period
    - Hide the help tag when the cursor moves off the target
    - The “help-tag-delay” period will be set to 1 second

  Scenario: Show Help Tag
    Given I have opened Data Curator
    When I move the cursor over a Control with a Help Tag associatied
    Then display the Help Tag after the “help-tag-delay” period

  Scenario: Hide Help Tag
    Given I have opened Data Curator
    And a Help Tag is displayed for a Control
    When I move the cursor off the Control with a help tag associatied with it
    Then hide the Help Tag
