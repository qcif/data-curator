Feature: Close all tabs
  In order to quickly finish work
  As a Data Packager
  I want to safely close all open data tabs at once 
  But Not lose my changes using the CSV dialect set in the associated Table Properties 
  Or, if that is null, Not lose my changes using the CSV dialect specified in Preferences. 
  By default the CSV dialect will be a comma separated file with defaults settings as documented in http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: Close all tabs
     Given I open the Data Curator
     And I open 1 data tab
     And I save the data in the tab
     When I select Close all Tabs from the menu
     Then all tabs close
  
  Scenario: Close all tabs
    Given I open the Data Curator
    And I open more than 1 data tab
    And I save all the data in the tab
    When I select Close all Tabs from the menu
    Then all tabs close
    
  Scenario: Close all tabs
    Given I open the Data Curator
    And I open 1 data tab
    And I do not save the data in the tab
    When I select Close all Tabs from the menu
    Then a prompt, save each unsaved data table in its current CSV Dialect, is displayed
  
  Scenario: Close all tabs
    Given I open the Data Curator
    And I open more than 1 data tab
    And I do not save the data in the tab
    When I select Close all Tabs from the menu
    Then a prompt, save each unsaved data table in its current CSV Dialect, is displayed
