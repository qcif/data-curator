@template

Feature: Template - Some terse yet descriptive text of what is desired
  In order to realise a named business value
  As an explicit system actor
  I want to gain some beneficial outcome which furthers the goal

  Scenario: Some determinable business situation
#   the scenario name is important as it is returned when automated tests fail.
    Given I have opened Data Curator
    And some other precondition
    When some action by the actor (i.e. a event happens)
    When I select "Previous Tab" from the menu  
    When I use the Previous Tab keyboard shortcut
    And yet another action
    Then some testable outcome is achieved (i.e check the outcome)
    And something else we can check happens too



# Write in perfect present tense - http://www.ef-australia.com.au/english-resources/english-grammar/present-perfect/

# Don't put 'or' in the Given/When/Then statements - these statements should be pulled out into two different scenarios.

# Don't put conditions in  When/Then statements. An if statement can be changed into two different scenarios and the if condition put up into the Given statement.
