@backlog

# Data Quality Report

Sometimes data is published with known quality issues. The data publisher may intend to correct the data in the future or perhaps never correct the data as it is fit for their purpose.

This data quality report will help you decide if the data is fit for your purpose.

## Data

This report was generated on {date-time} using the {datapackage-name} Data Package which includes {number-of-tables} table(s):

- [{table-name-1}](#{table-name-1})
- [{table-name-2}](#{table-name-2})

## Results

The results are available to read below.  

The results can be reproduced in different formats using these steps:

1. Go to {tool-url}
2. Provide the data-package filename/url
3. Select the output format:
  - markdown (.md)
  - comma separated value (.csv) ([sample](csv-results-sample-url "view sample csv results"))
  - javascript object notation (.json) ([sample](https://github.com/frictionlessdata/goodtables-py#report "view sample json results"))
4. download the results

## {table-name-1} table

The table has:

- {number-of-rows} rows
- {number-of-columns} columns
- {headerRow} header rows
- Assume no [source issues](https://github.com/frictionlessdata/goodtables-py#validation-against-source-checks) from Data Curator
- Could have [structural issues](https://github.com/frictionlessdata/goodtables-py#validation-against-structure-checks) depending on when quality report is allowed to be produced

The columns in the table are {described} by a schema.

The graphic below shows an overview of missing values and data type mismatches.

{insert [csv-fingerprint](http://setosa.io/blog/2014/08/03/csv-fingerprints/)}

The table includes the following columns:

- [{column-name-1}](#{column-name-1}) 
- [{column-name-2}](#{column-name-2})
- [{column-name-3}](#{column-name-3})

### {column-name-1} column

#### Column properties

{title}

{description}

{type}

{format}

{constraint}

{enum}

{primaryKey}

{foreignKey}

{missingValues}

#### Quality measures

- [completeness](http://dke.uqcloud.net/DataQualityPatterns/?page_id=167&cha_title=Completeness%20of%20optional%20attributes): {absolute-value} or {percent-value}
- [implied-precision](http://dke.uqcloud.net/DataQualityPatterns/?page_id=163&cha_title=Precision): {value}
- etc.


### {column-name-2} column

### {column-name-3} column

## {table-name-1} table

### {column-name-1} column

### {column-name-2} column
