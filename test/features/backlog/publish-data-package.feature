@backlog

Feature: Publish Data Package
  As a Data Packager
  I want to publish a data package to an open data portal
  So that I don't have to upload it manually through the open data portal's user interface

  The ability to publish to an open data portal is usually secured
  Credentials (user id and password, api key, etc) will be needed to publish
  Credentials and the Open Data Portal URL will be stored in Preferences or hidden in a configuration file

  CKAN is the most popular open data portal and will be the initial target.
  There is a CKAN extension that supports uploading data packages through the API - https://github.com/ckan/ckanext-datapackager

  The users prior set to this task is likely to have been export data package. Remember the filename and location.

  Scenario: Publish Data Package to CKAN
    Given I have opened Data Curator
    Add I have exported a data package
    When I select "Publish Data Package" from the menu
    Then show the filename and location used in the last export data package command
    And offer to change the filename and location
    And use the selected file to send the data package to the open data portal via the CKAN API
