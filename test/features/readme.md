Acceptance tests for [Data Curator](https://github.com/ODIQueensland/data-curator/blob/master/README.md) are:

- written using the [Gherkin language](https://cucumber.io/docs/reference#gherkin) ([learn more](https://media.pragprog.com/titles/hwcuc/gherkin.pdf)) and stored [on GitHub](https://github.com/ODIQueensland/data-curator/tree/master/test/features)
- [shared](https://app.cucumber.pro/projects/data-curator/documents/branch/master) using [Cucumber Pro](https://cucumber.io/pro) beta
- arranged in folders like the application menu structure

We use @tags to help manage features:

- the `@backlog` tag is used to indicate that the feature is not in our [release plans](https://github.com/ODIQueensland/data-curator/milestones?direction=asc&sort=due_date&state=open)
- the `@draft` tab is used for draft features
- the `@impl` tab indicated that feature tests have been automated
