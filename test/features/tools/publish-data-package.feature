@backlog @enterprise-add-in

Feature: Publish Data Package
  As a Data Packager
  I want to publish a data package to an open data portal
  So that I don't have to upload it manually through the open data portal's user interface

  The "Publish Data Package" function can be invoked using a menu item

  Rules:

  - The ability to publish to an open data portal is usually secured.

  - Credentials (user id and password, api key, etc) will be needed to publish. These must be secured if stored locally.

  - Open Data Portal API URL will be stored in Preferences

  - CKAN is a popular open data portal and will be the initial target. Datahub.io is another target.

  - There is a [CKAN extension](https://github.com/ckan/ckanext-datapackager) that supports uploading data packages through the API - 

  - The users prior step to this task is likely to have been `export data package`. Remember the location and filename of the export.

  Scenario: Publish Data Package
    Given I have opened Data Curator
    And I have exported a data package
    When I invoke the "Publish Data Package" function
    Then show the filename and location used in the last export data package command
    And offer to change the filename and location
    And use the selected file to send the data package to the open data portal via an API
