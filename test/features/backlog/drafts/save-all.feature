@draft @backlog

Feature: Save all
  As a Data Packager
  I want to save all unsaved changes in every data tab
  So that I can quickly save my progress

  Rules
  =====

  - If available, use the CSV dialect settings in associated Table Properties.
  - If these are unavailable, then use the CSV dialect specified in Preferences.
  - By default the CSV dialect will be a comma separated file with defaults settings as documented in the [specification](http://frictionlessdata.io/specs/csv-dialect/#specification)
  - The CSV dialect selected may change the file extension e.g. tab separated values files use .tsv

  Scenario: Use the menu to save all data changes and all data has been saved once
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have saved all data tabs at least once
    When I select "Save All" from the menu
    Then save data changes in every tab using the CSV dialect settings

  Scenario: Use a keyboard shortcut to save all data changes and all data has been saved once
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have saved all data tabs at least once
    When I use the "Save All" keyboard shortcut
    Then save data changes in every tab using the CSV dialect settings

  Scenario: Use the menu to save all data changes but some data never saved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have not saved every data tab at least once
    When I select "Save All" from the menu
    Then for new data, a prompt is displayed requesting the file name and location
    And using the response, save changes using the CSV Dialect preferences
    And for previously saved data, save changes using the CSV dialect settings

  Scenario: Use a keyboard shortcut to save all data changes but some data never saved
    Given I have opened Data Curator
    And I have opened 1 or more data tabs
    And I have not saved every data tab at least once
    When I select the "Save All" keyboard shortcut
    Then for new data, a prompt is displayed requesting the file name and location
    And using the response, save changes using the CSV Dialect preferences
    And for previously saved data, save changes using the CSV dialect settings
