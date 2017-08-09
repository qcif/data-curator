Feature: Set provenance information
  As a Data Packager
  I want to describe the provenance information for the data
  So that Data Consumers can make an informed choice about using the data

  Provenance information will be
  - written using Commonmark http://commonmark.org
  - saved as it is entered
  - saved as a readme.md in the datapackage.zip

  Ideally a toolbar will be provided to support markdown features - http://commonmark.org/help/
  - headings
  - lists
  - bold, italics
  - links, images

  Sample text - https://github.com/ODIQueensland/data-curator/blob/master/test/features/sample-provenance-information.md

  Background:
    Given I have opened Data Curator
    And I have opened a data tab

  Scenario: Use the menu to access provenance information
    When I select "Provenance Information" from the menu
    Then display a panel that allows me to enter provenance information as markdown for the current tab
    And sample content will be displayed
    And values entered will be saved as they are typed

  Scenario: Use the toolbar access provenance information
    When I select "Provenance Information" from the toolbar
    Then display a panel that allows me to enter provenance information as markdown for the current tab
    And sample content will be displayed
    And values entered will be saved as they are typed
