Feature: Close all tabs
  In order to quickly finish work
  As a Data Packager
  I want to safely close all open data tabs at once

  Scenario: Close all tabs

     Given Data Curator is open
       And one or more data tabs are open

      When Close all Tabs is selected from the menu

      Then check that the data in each tab has been saved
       And if it has, close all the tabs
       And if it hasn't, display a prompt to save each unsaved data table in its current CSV Dialect
