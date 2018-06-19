Feature: Validate Table
  As a Data Packager
  I want to validate the data for common errors and against the [schema](https://frictionlessdata.io/specs/table-schema/) I have defined
  So that I can correct errors and share validated data with Data Consumers

  RULES
  =====

  - The "Validate Table" command can be invoked using a menu item, toolbar button or shortcut
  - [Structural data checks](https://github.com/frictionlessdata/goodtables-py#validation-against-structure-checks) include:
    - blank header
    - duplicate header
    - blank row
    - duplicate row
    - ragged rows (extra/missing value compared to header row)
  - Schema validation checks include the:
    - data is the same "type" and "format" as defined in the schema, ignoring "missing values"
    - data conforms with the "constraints"
    - "primary keys" are unique
    - "foreign key" relationships to one or more columns in:
      - the same table
      - another table in the same data package
      - another table in a data package at a url (not in specification [yet](https://gitter.im/frictionlessdata/chat?at=59eaed08f7299e8f53142845))

  QUESTION
  ========

  - How can we support writing validation errors for two tables to provenance information?
  - How is -$1.00 handled by `bareNumber` - error or -1.00?

  USER INTERFACE
  ==============

  ![Validate user interface](https://raw.githubusercontent.com/ODIQueensland/data-curator/develop/static/img/ui/validate.png)

  LATER
  =====

  - different `missingValues` can be validated per column
  - trueValues and falseValues
  - bareNumber
  - decimalChar
  - groupChar

  @impl
  @dev
  Scenario Outline: Validate Table
    Given Data Curator is open
    And 1 data tab is displayed
    And the active table has data: "<data>"
    # And properties may have been entered to define the schema
    When "Validate Table" is invoked
    # Then structural data errors should be reported
    # And schema data errors should be reported
    Then the validation failure message should be displayed with the messages: "<error keys>" for rows: "<rows>" and columns: "<cols>"
    And the validation errors count should be "<count>"
    And the table cell errors should be highlighted for rows: "<rows>" and columns: "<cols>"
    Examples:
    | data                                                  | error keys                | count   | rows  | cols  |
    | [["","",""]]                                          | ["No Columns Properties"] | 1       | []    | []    |
    | [["h1","h2","h3"],["","",""]]                         | ["Blank Row"]             | 1       | [2]   | []    |
    # | [["h1","h2","h3"],["","",""],["a","",""],["","",""]]  | ["Blank Row"]             | 2       | [1,3] | [0,0] |

  Scenario: Pop out validation error messages
    Given Data Curator is open
    And data in a table has been validated
    And errors have been detected and displayed in a panel
    When "Pop out validation error messages" is invoked
    Then the error messages should be displayed in a table in a separate window
    And a count of the number of errors detected should be displayed
    And the error message panel should be closed

  Scenario: Sort validation error messages
    Given data in a table has been validated
    And errors have been detected and displayed error messages in a table in a separate window
    When "sort column" is invoked
    Then the error messages should be sorted by that column

  Scenario: Filter validation error messages
    Given data in a table has been validated
    And errors have been detected and displayed error messages in a table in a separate window
    When "filter column" is invoked
    And provide a filter value(s)
    Then only the error messages that meet the filter criteria should be displayed

  Scenario: Link to error cell
    Given data in a table has been validated
    And errors have been detected and displayed
    When an error message is selected
    Then the cursor should be moved to the associated cell in table

  Scenario: Write residual errors to provenance information
    Given data in a table has been validated
    And errors have been detected and displayed error messages in a table in a separate window
    When "write errors to provenance information" is invoked
    Then a heading "### Known Data Errors" should be appended to the end of the provenance information
    And a paragraph "This data is published with the following data errors. Other errors may be present and could be detected after these errors are resolved." should be appended to the end of the provenance information
    And each error message should be appended as a numbered bullet item to the end of the provenance information

  Scenario: Validate different missing values across columns
    Given Data Curator is open
    And this data has been entered:

      | H1 | H2  | H3  |
      | 1  | 1   | 1   |
      |    | tba | tba |
      |    |     | na  |

    And the following "missingValues" properties have been set for each column:

      | Column | missingValues |
      | H1     | ""            |
      | H2     | "tba"         |
      | H3     | "tba","na"    |

    When "Validate Table" is invoked
    Then the following errors should be reported for each column:

      | Column | errors reported |
      | H1     | none            |
      | H2     | error in row 3  |
      | H3     | none            |

  Scenario: validate integer bareNumber
    Given Data Curator is open
    And this data has been entered:

      | H1 | H2    | H3   | H4 |
      | 1  | $1    | 1%   | $1 |
      | 2  | US $2 | 2    | 2% |
      | 3  | 3     | 3 KG | 3  |

    And the following properties have been set for each column:

      | column | type    | bareNumber |
      | H1     | integer | true       |
      | H2     | integer | true       |
      | H3     | integer | true       |
      | H4     | integer | false      |

    When "Validate Table" is invoked
    Then the following errors should be reported for each column:

      | column | errors reported      |
      | H1     | none                 |
      | H2     | none                 |
      | H3     | none                 |
      | H4     | error in row 1 and 2 |

  Scenario: validate number bareNumber
    Given Data Curator is open
    And this data has been entered:

      | H1    | H2       | H3       | H4    |
      | 1.10  | $1.10    | 1.10%    | $1.10 |
      | 2     | US $2.00 | 2        | 2.0%  |
      | 3.12  | 3.12     | 3.12 KG  | 3.12  |

    And the following properties have been set for each column:

      | column | type    | bareNumber |
      | H1     | number | true       |
      | H2     | number | true       |
      | H3     | number | true       |
      | H4     | number | false      |

    When "Validate Table" is invoked
    Then the following errors should be reported for each column:

      | column | errors reported      |
      | H1     | none                 |
      | H2     | none                 |
      | H3     | none                 |
      | H4     | error in row 1 and 2 |

  Scenario: validate boolean trueValues and falseValues
    Given Data Curator is open
    And this data has been entered:

      | H1    | H2    |
      | TRUE  | YES   |
      | True  | Yes   |
      | true  | yes   |
      | 1     | maybe |
      | FALSE | NO    |
      | False | No    |
      | false | no    |
      | 0     | 0     |

    And the following properties have been set or defaulted for each column:

      | column | type    | trueValues                  | falseValues                    |
      | H1     | boolean | "true", "True", "TRUE", "1" | "false", "False", "FALSE", "0" |
      | H2     | boolean | "YES", "Yes"                | "NO", "No"                     |

    When "Validate Table" is invoked
    Then the following errors should be reported for each column:

      | column | errors reported           |
      | H1     | none                      |
      | H2     | error in row 3,4, 7 and 8 |

Scenario: validate number with groupChar
  Given Data Curator is open
  And this data has been entered:

    | H1        | H2         |
    |       1.0 |        1.0 |
    |       100 |        100 |
    |      1000 |       1000 |
    |     1,000 |      1,000 |
    |   1000000 |    1000000 |
    | 1,000,000 |  1,000,000 |

  And the following properties have been set or defaulted for each column:

    | column | type   | groupChar |
    | H1     | number |           |
    | H2     | number | ","       |

  When "Validate Table" is invoked
  Then the following errors should be reported for each column:

    | column | errors reported      |
    | H1     | error in row 4 and 6 |
    | H2     | none                 |

Scenario: validate number with decimalChar
  Given Data Curator is open
  And this data has been entered:

    | H1    | H2         |
    |   1.0 |        1.0 |
    |  12.3 |       12.3 |
    | 123,4 |      123,4 |

  And the following properties have been set or defaulted for each column:

    | column | type   | decimalChar |
    | H1     | number | "."         |
    | H2     | number | ","         |

  When "Validate Table" is invoked
  Then the following errors should be reported for each column:

    | column | errors reported      |
    | H1     | error in row 3       |
    | H2     | error in row 1 and 2 |


    Scenario: validate foreign keys across data packages
    Given Data Curator is open
    And  this data in Table "One" in Data Package "Alpha" has been entered:

      | Id | Code |
      | 1  |    A |
      | 2  |    B |
      | 3  |    C |
      | 4  |    D |

    And this data in Table "Two" in Data Package "Beta" has been entered:

      | Code | Description |
      |    A | Apple       |
      |    B | Banana      |
      |    C | Carrot      |

    And a foreignKeys relationship across the data packages has been established using the Code fields
    When "Validate Table" is invoked
    Then the following errors should be reported for Table "Alpha":

      | column | errors reported      |
      | Code   | error in row 4       |
