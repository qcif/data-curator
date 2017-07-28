@template

Feature: Template - Some terse yet descriptive text of what is desired
  As an explicit user role  #see below
  I want to feature
  So that benefit

  Describe any rules to be applied in the Scenario

# User roles for the Application are:
#
#   Data Packager - someone who uses the application to create, edit, describe, validate and share usable open data
#   Data Consumer - someone who uses the application to read published data packages
#   Sponsor - a person or organisation that has funded development or maintenance of the application
#   Contributor - a person who has contributed or is considering contributing to the application
#   Maintainer - a person who application development support for the application
#


# In General
#
# Don't put 'or' in the Given/When/Then statements - these statements should be pulled out into two different scenarios.
#
# Don't put conditions in  When/Then statements. An if statement can be changed into two different scenarios and the if condition put up into the Given statement.
#
# Use "quotes" arounded named things in the Application, e.g. a "Menu item name"
# Don't use quotes for...
# Use "double quotes" not 'single quotes'
#
# Given
#
# - Write the statement in perfect present tense - http://www.ef-australia.com.au/english-resources/english-grammar/present-perfect/
#
# When
#
# Then
#
#
#

  Scenario: Some determinable business situation
#   the scenario name is important as it is returned when automated tests fail.
    Given I have opened Data Curator [initial context]
    And I have done some other precondition
    When some action by the actor (i.e. a event happens)
    When I select "Previous Tab" from the menu
    When I use the Previous Tab keyboard shortcut
    And yet another action
    Then some testable outcome is achieved (i.e check the outcome)
    And something else we can check happens too



# Write in perfect present tense - http://www.ef-australia.com.au/english-resources/english-grammar/present-perfect/

# Don't put 'or' in the Given/When/Then statements - these statements should be pulled out into two different scenarios.

# Don't put conditions in  When/Then statements. An if statement can be changed into two different scenarios and the if condition put up into the Given statement.
