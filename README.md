[![version][version-badge]][CHANGELOG]

# Data Curator
Data Curator is a simple desktop CSV editor to help describe, validate and share usable open data.

## Why do we need Data Curator?

Open data producers are increasingly focusing on improving open data publishing so that data can be used to create insight and drive positive change.

Open data is more likely to be used if data consumers can:

  - understand why and how the data was collected
  - understand the structure of the data
  - look up the meaning of codes used in the data
  - understand the quality of the data
  - access the data in an open machine-readable format
  - know how the data is licensed and how it can be reused

## Planned features

Using Data Curator open data producers can:

- create new tabular data from scratch or from a template
- open data from a CSV or Microsoft Excel file
- open multiple related data tables from a [Data Package](http://frictionlessdata.io/data-packages/)
- automatically correct [common problems](https://github.com/frictionlessdata/data-quality-spec/blob/master/README.md) found in CSV and Excel files
- edit data

Using data from any of these sources, you can:

- automatically create a [schema](http://specs.frictionlessdata.io/table-schema/) that describes the data fields
- refine the schema to include extra [data validation rules](http://specs.frictionlessdata.io/table-schema/#constraints)
- describe the [provenance](https://discuss.okfn.org/t/readme-md-practice-for-data-packages/5555)  of your data
- save data as a valid CSV file in various [CSV dialects](http://specs.frictionlessdata.io/csv-dialect/)

The schema enables you to:

- validate the whole table at once
- in the future:
  - validate a column at a time
  - validate as you type

Once the data is described and validated, you can share the data and its description by exporting a [Data Package](http://frictionlessdata.io/data-packages/) to:

-  [publish](http://okfnlabs.org/blog/2016/07/25/publish-data-packages-to-datahub-ckan.html) on your [open data portal](https://ckan.org)
- use as a template for others to make similar data

Open data consumers can use published Data Packages to:

- view the data structure and provenance information to help determine if the data is fit for their purpose
- download the data together with its metadata in a single zip file
- use [a suite of tools](http://frictionlessdata.io/tools/) to work with the data



## Contributions

We welcome all sorts of contributions - financial, ideas, issues, documentation and code. [Can you help?](https://github.com/ODIQueensland/data-curator/blob/master/.github/CONTRIBUTING.md)

We acknowledge the great work of others. We are:

- inspired by the [ODI](https://theodi.org) [Comma Chameleon](https://comma-chameleon.io/) experiment.
- using the [Open Knowledge International](https://okfn.org) [Frictionless Data specification](http://frictionlessdata.io) and [code libraries](http://frictionlessdata.io/tools/#javascript
)
- adopting [W3C Data on the Web Best Practices](https://www.w3.org/TR/dwbp/#bp-summary)

## Download and Install Data Curator

- Choose a platform from the [Releases page](https://github.com/ODIQueensland/data-curator/releases/latest).
- Drag the application to your applications folder.

#### On macOS
If you encounter a warning message informing you the application cannot be opened due to emanating from an unknown developer try:
- Right click the app
- then option+click on Open.

This occurs due to macOS quarantining applications where it cannot determine the certificate used to sign the application.  

---

## Development

### Requirements

`node`  
`npm`  
`electron`  
`standard`

You can use [npm](https://www.npmjs.com) to install all relevant packages and development dependencies using the following set of commands:

`insert commands here`

### Development: Running the full application locally

To open the app run:

`npm start`

`Insert other instructions as required.`

### Application Architecture

Data Curator is built using [Electron.js](electron.atom.io), a framework that allows developers to build desktop applications using web technology.

There are two parts of the application, the main process and the renderer process. The main process deals with things like carrying out file operations, validating CSVs, and rendering views. The renderer acts very much like client side javascript in a web browser, dealing with things like presentation, and user interactions.

#### IPC messaging

Electron passes and listens for messages between main and renderer using the IPC module, one for the [main process](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md) and one for the [renderer process](https://github.com/electron/electron/blob/master/docs/api/ipc-renderer.md).

## Coding Standards

We have adopted [Standard JS](https://standardjs.com) as our JavaScript coding standard.

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Tests

A tool to automate testing has not yet been adopted.

`Instructions on how to run tests will go here.`

## Deployment

### Building a new package

`Instructions on how to build a package will go here.`

Changes are recorded in the [Change Log](https://github.com/ODIQueensland/data-curator/blob/master/CHANGELOG.md). We use [semantic versioning](http://semver.org) to label [our releases](https://github.com/ODIQueensland/data-curator/releases).

[CHANGELOG]: ./CHANGELOG.md
[version-badge]: https://img.shields.io/badge/version-0.0.1-blue.svg
