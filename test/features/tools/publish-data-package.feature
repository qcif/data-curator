Feature: Publish Data Package
  As a Data Packager
  I want to publish a data package to an open data portal
  So that I don't have to upload it manually through the open data portal's user interface

  The "Publish Data Package" command can be invoked using a menu item when Data Package has been exported successfully.

  Rules:

  - The ability to publish to an open data portal is usually secured through an API key
  - The API must not be stored and must be kept secret.
  - The preferred Open Data Portal and URL may be stored in Preferences
  - CKAN is a popular open data portal and will be the initial target. Datahub.io, Data.World are other targets.
  - There is a [CKAN extension](https://github.com/ckan/ckanext-datapackager) that supports uploading data packages through the API
  - The users prior step to this task is likely to have been `export data package`. Remember the location and filename of the export.

  Scenario: Publish Data Package
    Given I have opened Data Curator
    And I have exported a data package
    When I invoke the "Publish Data Package" command
    Then prompt for the filename and location of the datapackage.zip file, portal type, url and API key
    And use the selected file to send the data package to the open data portal via an API
