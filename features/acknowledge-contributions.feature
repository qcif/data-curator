Scenario: As a current or potential Sponsor or Contributor, Tom wants to see who has contributed to Data Curator.
  It is important to acknowledge contributors. Sometimes this is a legal requirement of using contributions. Contributors names, logos, licences and attribution statements will be displays in one place to fulfil our legal obligations and give credit to the work of others

Given Data Curator is open
When the About menu item is pressed
Then the Contributors are shown
And Tom is able to follow a link so he can make a contribution

Scenario: Tom has seen the Contributors
Given Tom has the Data Curator About panel open
When he clicks outside the panel
Or clicks the Close button
Then the About panel closes
