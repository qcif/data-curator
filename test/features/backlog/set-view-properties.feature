@backlog @draft

Feature: Set View Properties
  As a Data Packager
  I want to describe a default view (e.g. chart or map) for the data and preview the result
  So that the chart or map can be displayed when the data package is presented on a open data portal

  References:
  - View Specification http://frictionlessdata.io/specs/views/
  - Examples of published views:
    - https://datahub.io/examples/simple-graph-spec
    - https://datahub.io/examples/vega-views-tutorial-lines
  - Vega:
    - https://vega.github.io/vega-lite/
    - Electon Vega editor https://github.com/kristw/vega-desktop
    - Vega Schema - https://github.com/vega/schema

  Background:
    Given Data Curator is open
    And I have opened a data tab

  Scenario: Use the menu to set View Properties
    When I invoke the "View Properties" command
    Then display a panel that allows me to enter view properties
    And accept and validate view property values
    And save the values as they are entered
    And generate a preview of the chart/map as the properties change
