Feature: Replace data
  As a Data Packager
  I want to replace one or more values with another
  So that I can correct data errors quickly

  RULES
  =====

  - "Replace Next" can be invoked from a menu item, a keyboard shortcut, or button
  - "Replace Previous" can be invoked from a menu item, a keyboard shortcut, or button
  - "Replace All" can be invoked from a button

  USER INTERFACE
  ==============

  The user should be warned that the replace function cannot be undone

  ![Data Curator Find and Replace User Interface](https://github.com/ODIQueensland/data-curator/raw/develop/static/img/ui/find-and-replace.png)

  LATER
  =====

  - The replacement order is down columns and then across rows

  @impl
  Scenario Outline: Replace case-sensitive Next in column
    Given Data Curator is open
    And the active table has data: "<data>"
    And the user clicks in row 1, column 1
    When "Find" is invoked
    And "<search value>" has been entered in the input field: "<find>"
    And "<replace value>" has been entered in the input field for "<replace>"
    And the "case sensitive" input checkbox field is selected
    When "Replace Next" is invoked using the "application menu selection": "Find->Replace Next"
    Then the remaining case-sensitive cells with values that match "<search value>" should be 1 less than highlighted
    And the active table has data: "<replace data>"
    And a count of the remaining values that match the "replace" value should be displayed
    And the "replace" display count should read "<display count>"
    Examples:
      | search value | replace value | display count | data                                                                                                                                              | replace data                                                                                                                                         |
      | test         | replace       | 2 remaining.  | [["h1","h2","h3"],["test","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               | [["h1","h2","h3"],["replace","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               |
      | test         | replace       | 1 remaining.  | [["h1","h2","h3"],["TeSt","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               | [["h1","h2","h3"],["test","",""],["","",""],["replace","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               |
      | \test\       | \replace\     | 0 remaining.  | [["h1","h2","h3"],["\\\Test\\\","",""],["","",""],["\\\tesT\\\","\\\test\\\",""],["\\\test\\\","",""],["","","\\\test\\\"],["","",""],["","",""]] | [["h1","h2","h3"],["\\\Test\\\","",""],["","",""],["\\\tesT\\\","\\\test\\\",""],["\\\replace\\\","",""],["","","\\\test\\\"],["","",""],["","",""]] |
      | test123      | replace456    | 2 remaining.  | [["h1","h2","h3"],["test123","",""],["","",""],["test123","test123",""],["test123","",""],["","","test123"],["","",""],["","",""]]                | [["h1","h2","h3"],["replace456","",""],["","",""],["test123","test123",""],["test123","",""],["","","test123"],["","",""],["","",""]]                |
      | 'test'       | 'replace'     | 2 remaining.  | [["h1","h2","h3"],["'test'","",""],["","",""],["'test'","'test'",""],["'test'","",""],["","","'test'"],["","",""],["","",""]]                     | [["h1","h2","h3"],["'replace'","",""],["","",""],["'test'","'test'",""],["'test'","",""],["","","'test'"],["","",""],["","",""]]                     |
      | "test"       | "replace"     | 2 remaining.  | [["h1","h2","h3"],["\"test\"","",""],["","",""],["\"test\"","\"test\"",""],["\"test\"","",""],["","","\"test\""],["","",""],["","",""]]           | [["h1","h2","h3"],["\"replace\"","",""],["","",""],["\"test\"","\"test\"",""],["\"test\"","",""],["","","\"test\""],["","",""],["","",""]]           |
      | two words    | replace text  | 2 remaining.  | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      | [["h1","h2","h3"],["replace text","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      |
      | two          | replacement   | 2 remaining.  | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      | [["h1","h2","h3"],["replacement","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]       |

  @dev
  @impl
  Scenario Outline: Replace case-insensitive Next in column
    Given Data Curator is open
    And the active table has data: "<data>"
    And the user clicks in row 1, column 1
    When "Find" is invoked
    And "<search value>" has been entered in the input field: "<find>"
    And "<replace value>" has been entered in the input field for "<replace>"
    And the "case sensitive" input checkbox field is not selected
    When "Replace Next" is invoked using the "application menu selection": "Find->Replace Next"
    Then the remaining case-insensitive cells with values that match "<search value>" should be 1 less than highlighted
    And the active table has data: "<replace data>"
    And a count of the remaining values that match the "replace" value should be displayed
    And the "replace" display count should read "<display count>"
    Examples:
      | search value | replace value | display count | data                                                                                                                                              | replace data                                                                                                                                         |
#      | test         | replace       | 2 remaining.  | [["h1","h2","h3"],["test","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               | [["h1","h2","h3"],["replace","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               |
#      | test         | replace       | 2 remaining.  | [["h1","h2","h3"],["TeSt","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               | [["h1","h2","h3"],["TeSt","",""],["","",""],["replace","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               |
#      | \test\       | \replace\     | 2 remaining.  | [["h1","h2","h3"],["\\\Test\\\","",""],["","",""],["\\\tesT\\\","\\\test\\\",""],["\\\test\\\","",""],["","","\\\test\\\"],["","",""],["","",""]] | [["h1","h2","h3"],["\\\replace\\\","",""],["","",""],["\\\tesT\\\","\\\test\\\",""],["\\\test\\\","",""],["","","\\\test\\\"],["","",""],["","",""]] |
#      | test123      | replace456    | 2 remaining.  | [["h1","h2","h3"],["test123","",""],["","",""],["test123","test123",""],["test123","",""],["","","test123"],["","",""],["","",""]]                | [["h1","h2","h3"],["replace456","",""],["","",""],["test123","test123",""],["test123","",""],["","","test123"],["","",""],["","",""]]                |
#      | 'test'       | 'replace'     | 2 remaining.  | [["h1","h2","h3"],["'test'","",""],["","",""],["'test'","'test'",""],["'test'","",""],["","","'test'"],["","",""],["","",""]]                     | [["h1","h2","h3"],["'replace'","",""],["","",""],["'test'","'test'",""],["'test'","",""],["","","'test'"],["","",""],["","",""]]                     |
#      | "test"       | "replace"     | 2 remaining.  | [["h1","h2","h3"],["\"test\"","",""],["","",""],["\"test\"","\"test\"",""],["\"test\"","",""],["","","\"test\""],["","",""],["","",""]]           | [["h1","h2","h3"],["\"replace\"","",""],["","",""],["\"test\"","\"test\"",""],["\"test\"","",""],["","","\"test\""],["","",""],["","",""]]           |
      | two words    | replace text  | 2 remaining.  | [["h1","h2","h3"],["two words","",""],["","",""],["twO1 Words","TWO WORDS",""],["two words","",""],["","","two words"],["","",""],["","",""]]     | [["h1","h2","h3"],["replace text","",""],["","",""],["twO1 Words","TWO WORDS",""],["two words","",""],["","","two words"],["","",""],["","",""]]     |
      | two          | replacement   | 2 remaining.  | [["h1","h2","h3"],["Two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      | [["h1","h2","h3"],["replacement","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]       |

#  @dev
  @impl
  Scenario Outline: Replace case-insensitive Previous in column
    Given Data Curator is open
    And the active table has data: "<data>"
    And the user clicks in row 1, column 1
    When "Find" is invoked
    And "<search value>" has been entered in the input field: "<find>"
    And "<replace value>" has been entered in the input field for "<replace>"
    And the "case sensitive" input checkbox field is not selected
    When "Replace Previous" is invoked using the "application menu selection": "Find->Replace Previous"
    Then the remaining case-insensitive cells with values that match "<search value>" should be 1 less than highlighted
    And the active table has data: "<replace data>"
    And a count of the remaining values that match the "replace" value should be displayed
    And the "replace" display count should read "<display count>"
    Examples:
      | search value | replace value | display count | data                                                                                                                                              | replace data                                                                                                                                           |
      | test         | replace       | 2 remaining.  | [["h1","h2","h3"],["test","",""],["","",""],["test","test",""],["test","",""],["","","test"],["","",""],["","",""]]                               | [["h1","h2","h3"],["test","",""],["","",""],["test","test",""],["test","",""],["","","replace"],["","",""],["","",""]]                                 |
      | test         | replace       | 2 remaining.  | [["h1","h2","h3"],["test","",""],["","",""],["test","test",""],["test","",""],["","","TeSt"],["","",""],["","",""]]                               | [["h1","h2","h3"],["test","",""],["","",""],["test","test",""],["test","",""],["","","replace"],["","",""],["","",""]]                                 |
      | \test\       | \replace\     | 2 remaining.  | [["h1","h2","h3"],["\\\test\\\","",""],["","",""],["\\\test\\\","\\\test\\\",""],["\\\test\\\","",""],["","","\\\test\\\"],["","",""],["","",""]] | [["h1","h2","h3"],["\\\test\\\","",""],["","",""],["\\\test\\\","\\\test\\\",""],["\\\test\\\","",""],["","","\\\replace\\\"],["","",""],["","",""]]   |
      | test123      | replace456    | 2 remaining.  | [["h1","h2","h3"],["test123","",""],["","",""],["test123","test123",""],["test123","",""],["","","test123"],["","",""],["","",""]]                | [["h1","h2","h3"],["test123","",""],["","",""],["test123","test123",""],["test123","",""],["","","replace456"],["","",""],["","",""]]                  |
      | 'test'       | 'replace'     | 2 remaining.  | [["h1","h2","h3"],["'test'","",""],["","",""],["'test'","'test'",""],["'test'","",""],["","","'test'"],["","",""],["","",""]]                     | [["h1","h2","h3"],["'test'","",""],["","",""],["'test'","'test'",""],["'test'","",""],["","","'replace'"],["","",""],["","",""]]                       |
      | "test"       | "replace"     | 2 remaining.  | [["h1","h2","h3"],["\"test\"","",""],["","",""],["\"test\"","\"test\"",""],["\"test\"","",""],["","","\"test\""],["","",""],["","",""]]           | [["h1","h2","h3"],["\"test\"","",""],["","",""],["\"test\"","\"test\"",""],["\"test\"","",""],["","","\"replace\""],["","",""],["","",""]]             |
      | two words    | replace text  | 2 remaining.  | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","replace text"],["","",""],["","",""]]        |
      | two          | replacement   | 2 remaining.  | [["h1","h2","h3"],["two words","",""],["","",""],["two words","two words",""],["two words","",""],["","","two words"],["","",""],["","",""]]      | [["h1","h2","h3"],["replacement","",""],["","",""],["two words","two words",""],["two words","",""],["","","replacement words"],["","",""],["","",""]] |

  Scenario: Replace All in column
    Given Data Curator is open
    And a search and replacement value has been provided
    And the "in column" constraint is set
    When "Replace All" is invoked
    Then all the values in the current column that match the search value should be replaced with the replacement value

  Scenario: Replace Next in table
    Given Data Curator is open
    And a search and replacement value has been provided
    And the "in table" constraint is set
    When "Replace Next" is invoked
    Then the first value in the table that matches the search value after the current cursor position should be replaced with the replacement value
    And the cursor should be moved to that cell

  Scenario: Replace Previous in table
    Given Data Curator is open
    And a search and replacement value has been provided
    And the "in table" constraint is set
    When "Replace Next" is invoked
    Then the first value in the table that matches the search value before the current cursor position should be replaced with the replacement value
    And the cursor should be moved to that cell

  Scenario: Replace All in table
    Given Data Curator is open
    And a search and replacement value has been provided
    And a replacement value has been provided
    And the "in table" constraint is set
    When "Replace All" is invoked
    Then all the values in the table that match the search value should be replaced with the replacement value
