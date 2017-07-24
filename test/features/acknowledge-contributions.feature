Feature: Acknowledge Contributors
  In order to acknowledge contributors to Data Curator, which is both a legal requirement and a polite thing to do
  As the Creator of Data Curator
  I want to show who has contributed to the application by displaying names, logos, attribution statements and/or links to websites.

  Scenario: As a current or potential Sponsor or Contributor, Tom wants to see who has contributed to Data Curator.

      Given Data Curator is open

       When the About menu item is pressed

       Then the Contributors names, logos and/or attribution statements are shown
        And Tom is able to follow links an external websites


  Scenario: Tom has seen the Contributors

      Given Tom has the Data Curator About panel open

       When Tom clicks outside the panel or clicks the Close button

       Then the About panel closes
