Feature: Set Provenance Information
  As a Data Packager
  I want to describe the provenance information for the data
  So that Data Consumers can make an informed choice about using the data

  The "Set Provenance Information" command can be invoked using a menu item or the toolbar

  Provenance information will be
  - written using [Commonmark](http://commonmark.org)
  - saved as it is entered
  - saved as a readme.md in the datapackage.zip

  Ideally a toolbar will be provided to support [markdown features](http://commonmark.org/help/)
  - headings
  - lists
  - bold, italics
  - links, images

  [Sample Provenance Information]( https://relishapp.com/odi-australia/data-curator/docs/tools/sample-provenance-information)

  Scenario: Provenance information
    Given I have opened Data Curator
    And I have opened a data tab
    When I invoke the "Provenance Information" command
    Then display a panel that allows me to enter provenance information as markdown for the current tab
    And sample content will be displayed
    And values entered will be saved as they are typed
