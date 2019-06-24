Feature: Find data
  As a User
  I want to find data within the current column or across the current table
  So that I can determine if the data exists and correct it if necessary

  RULES
  =====

  - Users can choose a search constraint to find data across the table or within the current column
  - The default search constraint is find in column
  - When "Find next" is invoked but no values are found on reaching the end of the column/table, start the search from the top of the table
  - When "Find previous" is invoked but no values are found on reaching the top of the column/table, start the search from the bottom of the table
  - "Find" can be invoked using a toolbar, menu item, toolbar, or keyboard shortcut
  - "Find next" and "Find previous" can be invoked using a using a menu item, button or keyboard shortcut
  - "Find next" and "Find previous" can only be invoked after a search value has been entered
  - The warning that the replace command cannot be undone should say, "Warning, the replace command cannot be undone. Save your work before making changes"

  LATER
  =====

  - The column that cursor is in should be displayed in the search panel
  - The table that is active should be displayed in the search panel
  - The search order is down columns and then across rows
  - Find in Table

  USER INTERFACE
  ==============

  ![Data Curator Find and Replace user interface](https://github.com/ODIQueensland/data-curator/raw/develop/static/img/ui/find-and-replace.png)


  @impl
  Scenario Outline: Basic Find
    Given Data Curator is open
    When "<name>" is invoked using the "<type>": "<sequence>"
    Then the "Find and Replace" panel should be displayed
    And a prompt for a "find" value should be displayed
    And a prompt for a "replace" value should be displayed
    And the "Find and Replace" panel's first input should have focus
    And the column that the cursor is in should be displayed
    # And a warning that the replace command cannot be undone should be displayed
    Examples:
    | name  | type                        | sequence    |
    | Find  | toolbar menu button         | Find        |
    | Find  | application menu selection  | Find->Find  |

  @impl
  Scenario Outline: Find submenu item is available from invoking Find
    Given Data Curator is open
    When "<name1>" is invoked using the "<type>": "<sequence1>"
    Then "<name2>" is invoked using the "application menu selection": "<sequence2>"
    Examples:
    | name1  | type                        | sequence1  | name2            | sequence2              |
    | Find   | toolbar menu button         | Find       | Find Next        | Find->Find Next        |
    | Find   | application menu selection  | Find->Find | Find Next        | Find->Find Next        |
    | Find   | toolbar menu button         | Find       | Find Previous    | Find->Find Previous    |
    | Find   | application menu selection  | Find->Find | Find Previous    | Find->Find Previous    |
    | Find   | toolbar menu button         | Find       | Replace Next     | Find->Replace Next     |
    | Find   | application menu selection  | Find->Find | Replace Next     | Find->Replace Next     |
    | Find   | toolbar menu button         | Find       | Replace Previous | Find->Replace Previous |
    | Find   | application menu selection  | Find->Find | Replace Previous | Find->Replace Previous |
    | Find   | toolbar menu button         | Find       | Replace All      | Find->Replace All      |
    | Find   | application menu selection  | Find->Find | Replace All      | Find->Replace All      |

  @impl
  Scenario Outline: Find next
    Given Data Curator is open
    And the active table has data: "<data>"
    And the user clicks in row 1, column 1
    And "Find" is invoked
    When "<search value>" has been entered in the input field: "<find>"
    And "Find Next" is invoked using the "application menu selection": "Find->Find Next"
    Then all the cells with values that are a case insensitive match for "<search value>" should be highlighted
    And a count of all the values that match the "find" value should be displayed
    And the "find" display count should read "<display count>"
    Examples:
    | search value  | display count | data                                                                                                                                              |
    | test          | 2 of 3        | [["h1","h2","h3"],["test","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               |
    | test          | 2 of 3        | [["h1","h2","h3"],["TeSt","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               |
    | \test\        | 2 of 3        | [["h1","h2","h3"],["\\\test\\\","",""],["","",""],["\\\test\\\","\\\test\\\",""],["\\\test\\\","",""],["","","\\\test\\\"],["","",""],["","",""]] |
    | test123       | 2 of 3        | [["h1","h2","h3"],["test123","",""],["","",""],["test123","test123",""],["test123","",""],["","","test123"],["","",""],["","",""]]                |
    | 'test'        | 2 of 3        | [["h1","h2","h3"],["'test'","",""],["","",""],["'test'","'test'",""],["'test'","",""],["","","'test'"],["","",""],["","",""]]                     |
    | "test"        | 2 of 3        | [["h1","h2","h3"],["\"test\"","",""],["","",""],["\"test\"","\"test\"",""],["\"test\"","",""],["","","\"test\""],["","",""],["","",""]]           |
    | two words     | 2 of 3        | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      |
    | two           | 2 of 3        | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      |

  @impl
  Scenario Outline: Find previous
    Given Data Curator is open
    And the active table has data: "<data>"
    And the user clicks in row 1, column 1
    And "Find" is invoked
    When "<search value>" has been entered in the input field: "<find>"
    And "Find Previous" is invoked using the "application menu selection": "Find->Find Previous"
    Then all the cells with values that are a case insensitive match for "<search value>" should be highlighted
    And a count of all the values that match the "find" value should be displayed
    And the "find" display count should read "<display count>"
    Examples:
      | search value  | display count | data                                                                                                                                              |
      | test          | 3 of 3        | [["h1","h2","h3"],["test","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               |
      | test          | 3 of 3        | [["h1","h2","h3"],["TeSt","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               |
      | \test\        | 3 of 3        | [["h1","h2","h3"],["\\\test\\\","",""],["","",""],["\\\test\\\","\\\test\\\",""],["\\\test\\\","",""],["","","\\\test\\\"],["","",""],["","",""]] |
      | test123       | 3 of 3        | [["h1","h2","h3"],["test123","",""],["","",""],["test123","test123",""],["test123","",""],["","","test123"],["","",""],["","",""]]                |
      | 'test'        | 3 of 3        | [["h1","h2","h3"],["'test'","",""],["","",""],["'test'","'test'",""],["'test'","",""],["","","'test'"],["","",""],["","",""]]                     |
      | "test"        | 3 of 3        | [["h1","h2","h3"],["\"test\"","",""],["","",""],["\"test\"","\"test\"",""],["\"test\"","",""],["","","\"test\""],["","",""],["","",""]]           |
      | two words     | 3 of 3        | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      |
      | two           | 3 of 3        | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      |
