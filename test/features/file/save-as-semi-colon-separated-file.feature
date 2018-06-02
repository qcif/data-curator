Feature: Save As Semicolon separated value file
  As an Data Packager  
  I want to save the data changes in the active data tab as a comma separated value file  
  In order to save the data to a different filename, location or CSV dialect  

  RULES
  =====

    - The file extension of the saved file must be .csv
    - The "Save As Semicolon separated" command can be invoked by a menu item
  
  LATER
  =====
  
  - Write the size of the file to the `bytes` table property 


  Scenario: Save As Semicolon separated value file
    Given Data Curator is open
    And one data tab is open
    When "Save As Semicolon separated" is invoked
    Then a prompt, requesting the filename and location should be displayed
    And the data should be saved at the filename.csv and location using the correct CSV Dialect
    And the 'delimiter' should be set to ';' in the Table CSV Dialect
    And the file size in bytes should be written to the `bytes` table property
