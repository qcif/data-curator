Feature: Acknowledge Contributors
  In order to acknowledge contributors to Data Curator, which is both a legal requirement and a polite thing to do
  As the Creator of Data Curator, a current or potential Sponsor or Contributor
  I want to show who has contributed to the application by displaying names, logos, attribution statements and/or links to websites.

  Scenario: Show Contributors

     Given Data Curator is open

      When the About menu item is selected

      Then the Contributors names, logos, attribution statements and links to external websites are shown


  Scenario: Hide Contributors

     Given Data Curator is open
       And displaying the About panel

      When the mouse is clicked outside the About panel, or
      When the Close button on the About panel is pressed

      Then the About panel closes
