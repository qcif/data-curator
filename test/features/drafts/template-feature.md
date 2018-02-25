@template @draft

Feature: Template
# the feature name should be some terse yet descriptive text of what is desired
  As an # explicit user role #see below
  I want to # use a feature
  So that # some benefit

# User roles for the application are:
#
#   User - anyone who uses the application
#   Data Packager - someone who uses the application to create, edit, describe, validate and share usable open data
#   Data Consumer - someone who uses the application to read published data packages
#   Sponsor - a person or organisation that has funded development or maintenance of the application
#   Contributor - a person who has contributed or is considering contributing to the application
#   Maintainer - a person who application development support for the application
#

  Describe any rules to be applied in the Scenario


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

# General rules
#
# Technique - write "upwards": Then, When, Given
#
# Don't put 'or' in the Given/When/Then statements - these statements should be pulled out into two different scenarios.
#
# Don't put conditions in  When/Then statements. An if statement can be changed into two different scenarios and the if condition put up into the Given statement.
#
# Use "quotes" arounded named things in the Application, e.g. a "Menu item name"
#
# Use "double quotes" not 'single quotes'
#




# Given rules
#
# Write in perfect present tense - http://www.ef-australia.com.au/english-resources/english-grammar/present-perfect/
#
# write in third person, not first person - https://automationpanda.com/2017/01/18/should-gherkin-steps-use-first-person-or-third-person/
#
# Omit the obvious. E.g. Given app is open
#
# When rules
#
# Don't drive the User Interface in the When statement. State what happened, not how it happened.
#
# Single When per scenario
#
# Then rules
#
# Use "should" in Then statement
#
