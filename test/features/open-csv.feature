Feature: Open data stored in a comma separated value file
  In order to start packaging existing data
  As the Data Package
  I want to open a comma separated value file. Then it can be described, validated, and shared. The data is stored is a separated value file.

  The most common form of separated value files is a comma separated value (CSV) file. There are variations that use Tab or Semicolon to seperate values. Custom formats are sometimes used. Each of these formats can be described using a CSV Dialect that describes the `delimiter` used and other options. Read more at http://specs.frictionlessdata.io/csv-dialect/#specification

  Scenario: Open valid comma separate value file
   The file is saved as a .CSV assumed to be using the default CSV dialect.

     Given Data Curator is open

      When Open, then Comma Separated, is selected from the menu, or
      When Save is selected from the menu, or
      When using macOS, the Command + O shortcut is pressed, or
      When using Windows, ... , or
      When using Linux, ...

      Then show a open file dialog
       And open the selected file
       But only if it is a '.csv' or '.txt' file
       And display it in a table in Data Curator
