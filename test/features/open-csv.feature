Feature: Open data in a comma separated value file
The first step in packaging data is to open it using Data Curator. Then it can be described, validated, and shared. The data is stored is a separated value file. The most common form of spearated value files is a comma separated value (CSV) file. There are variations that use Tab or Semicolon to seperate values. Custom formats are sometimes used. Each of these formats can be described using a CSV Dialect that describes the separator used and other options. Read more at http://specs.frictionlessdata.io/csv-dialect/#introduction

Scenario: As a Data Packager, Amanda wants to open the separated value file she has to describe, validate and share. The file is saved as a .CSV assumed to be using the default CSV dialect.

Given Data Curator is open

When Amanda selects Open, then Comma Separated from the menu, or presses Command/Control + O

Then show a open file dialog
And only allow files ending in .CSV (or .TXT? e.g. GFTS format) to be selected
And open the selected file
And display it in a table in Data Curator
