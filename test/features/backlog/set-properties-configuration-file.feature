Feature: Set Properties using Configuration File
  As a Developer of Data Curator
  I want to easily adjust the properties captured by Data Curator
  So that I can easily maintain the application as the Frictionless Data standard evolves

  Data Package properties
  - 

  Table properties
  -

  Column properties
  -

Scenario: Set Properties using Configuration File
  Given I have defined a Properties Configuration file
  When I open Data Curator
  Then read the Configuration file
  And default properties collected using the values in the file
