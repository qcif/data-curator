Feature: Set Provenance Information
  As a Data Packager  
  I want to describe the provenance information for the data  
  So that Data Consumers can make an informed choice about using the data  

  RULES
  =====

  - The "Set Provenance Information" command can be invoked using a menu item or the toolbar
  - Provenance information will be
    - written using [Commonmark](http://commonmark.org)
    - saved as it is entered
    - saved as a `README.md` in the `datapackage.zip`

  LATER
  =====

  - a toolbar will be provided to support [markdown features](http://commonmark.org/help/)
    - headings
    - lists
    - bold, italics
    - links, images
  - Import [Sample Provenance Information](https://github.com/ODIQueensland/data-curator/blob/master/test/features/tools/sample-provenance-information.md)

  Scenario: Provenance information
    Given Data Curator is open
    When "Provenance Information" is invoked
    Then a panel that allows provenance information to be entered as markdown should be displayed
    And sample content should be displayed
    And values entered should be saved as they are typed
