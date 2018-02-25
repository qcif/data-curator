Feature: Set Preferences using Configuration File
  As a Open Data leader in my organisation
  I want to deploy Data Curator with some preset preference settings
  So that my organisation is consistent in how it packages open data

  The configuration file may have a default value for each preference setting.
  The configuration file will be json.
  Sample json will be provided
  Customer to edit and place in required location for Data Curator to read on launch

  Customer determines if json import is correct by launching Data Curator

  If a default value in the configuration file is invalid or missing, it is ignored

  Preferences to be retained across application updated

Scenario: Set Preferences using Configuration File
  Given I have defined a Configuration file
  When I open Data Curator
  Then read the Configuration file
  And default the preference settings from the values in the configuration file
