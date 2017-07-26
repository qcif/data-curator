Feature: Show help
  In order to get help on how to use Data Curator
  As a user of Data Curator
  I want to display help information

  Scenario: Show help
    Given I have opened Data Curator
    When a user selects Help, then Data Curator Help from the menu or if the user is using Windows (or Linux?) and presses f1
    When Help, Data Curator Help, is selected from the menu, or
    #    When using macOS, ... shortcut is pressed, or
    When using Windows, the F1 function key is pressed, or
    When using Linux, ... shortcut is pressed
    Then Open the Help Web site in a separate browser window
