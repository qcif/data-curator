@backlog

Feature: Publish Data Package
  As a Data Packager  
  I want to publish a data package to an open data portal  
  So that I don't have to upload it manually through the open data portal's user interface  

  RULES
  =====

  - The ability to publish to an open data portal is usually secured through an API key
  - The API key must not be stored and must be kept secret
  - The preferred Open Data Portal and URL may be stored in Preferences
  - CKAN is a popular open data portal and will be the initial target. Datahub.io is another target.
  - There is a [CKAN extension](https://github.com/ckan/ckanext-datapackager) that supports uploading data packages through the API
  - The "Publish Data Package" command can be invoked using a menu item 

  Scenario: Publish Data Package
    Given Data Curator is open
    And a datapackage.zip file is ready to publish
    When I invoke "Publish Data Package" 
    Then a prompt for the filename and location of the datapackage.zip file, portal type, url and API key should be displayed
    And any preference settings should be defaulted into the input values
    And the selected file should be to published to the open data portal via an API
