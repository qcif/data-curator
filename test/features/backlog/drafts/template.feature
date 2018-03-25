@draft

Feature: Template
  As an explicit user role
  I want to use a feature
  So that some benefit

  RULES
  =====

  User roles for the application are:
  - User - anyone who uses the application
  - Data Packager - someone who uses the application to create, edit, describe, validate and share usable open data
  - Data Consumer - someone who uses the application to read published data packages
  - Sponsor - a person or organisation that has funded development or maintenance of the application
  - Contributor - a person who has contributed or is considering contributing to the application
  - Maintainer - a person who application development support for the application

  General Rules
  -------------
  - the feature name should be some terse yet descriptive text of what is desired
  - Technique - write "upwards": Then, When, Given
  - Don't put 'or' in the Given/When/Then statements - these statements should be pulled out into two different scenarios.
  - Don't put conditions in  When/Then statements. An if statement can be changed into two different scenarios and the if condition put up into the Given statement.
  - Use "quotes" arounded named things in the Application, e.g. a "Menu item name"
  - Use "double quotes" not 'single quotes'

  Rules for Given
  ---------------

  - Write in [perfect present tense](http://www.ef-australia.com.au/english-resources/english-grammar/present-perfect/)
  - Write in [third person, not first person](https://automationpanda.com/2017/01/18/should-gherkin-steps-use-first-person-or-third-person/); Using the pronoun "I" is an [anti-pattern](https://cucumber.io/blog/2016/08/31/cucumber-anti-patterns-part-two#scenarios-that-use-i-as-in-the-personal-pronoun)
  - Omit the obvious. E.g. Given app is open

  Rules for When
  --------------

  - Don't drive the User Interface in the When statement. State what happened, not how it happened.
  - Single When per scenario

  Rules for Then
  --------------

  - Use "should" in Then statement

  NOTES
  =====

  - add notes

  QUESTIONS
  =========

  - any questions

  LATER
  =====

  - Describe any deferred features

  Scenario: Some determinable business situation
#   the scenario name is important as it is returned when automated tests fail.
    Given Data Curator is open
    And some other precondition
    When some action by the actor is invoked    And yet another action
    Then some testable outcome is achieved
    And something else we can check happens too
