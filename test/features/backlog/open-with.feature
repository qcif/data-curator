Feature: Open with
  As a Data Consumer
  I want to open a Data Package published on CKAN directly into Data Curator
  So that I don't need to cut the datapackage.json url from CKAN, open Data Curator, select Open Data Package,  paste the URL to open the Data Package

  This is more a change to CKAN than a change to Data Curator

  See
  - [Open With command on data.gov](https://www.data.gov/meta/open-apps)
  -  [Code](https://github.com/GSA/ckanext-datagovtheme/blob/master/ckanext/datagovtheme/templates/package/snippets/resource_item.html)

  Scenario: Open with
    Given I have found a data package on CKAN
    When I select "Open with..."
    Then prompt to use Data Curator as one of the applications that can open a datapackage.zip file
    And "Open Data Curator"
    And "Open Data Package" using the selected datapackage.zip file
