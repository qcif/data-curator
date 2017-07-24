Feature: Show help
In order to get help on how to use Data Curator
As a user of Data Curator
I want to display help information

Scenario: Show help

Given Data Curator is open

When a user selects Help, then Data Curator Help from the menu or if the user is using Windows (or Linux?) and presses f1

Then Open the Help Web site in a separate browser window
