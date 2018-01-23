A short description of the dataset. The first sentence and the first paragraph should be written to provide short standalone descriptions. These descriptions may be used by data platforms and other software to provide a summary of the data.

## Data

### Why was the data created?

- Reference any law or policy that requires you to collect the data.

### When was the data collected?

- on what day or over what duration was the data collected?
- consider [adding a temporal extent](http://frictionlessdata.io/specs/data-package/#descriptor) to the tabular data resource
- how often will the data be updated?

### Where was the data collected?

- Provide a well known name for the area the data was collected in
- Provide a minimum bounding rectangle to describe the spatial extent if you have not implemented this using contraints
- If location data is included in the data, what is the coordinate reference system

### How was the data collected?

- what events lead up to its collection?
- Which instruments were used to collect it?
- What does “null” mean?  Unknown, missing or not applicable? If not described in the schema

### Publication processes
Provide information that may assist the reader in determining if the data is fit for their purpose. E.g.

- what error corrections were performed
- what data transformations were performed? E.g.
  - data excluded because it's sensitive
  - data aggregation, de-identification or anonymisation to protect privacy
  - derived data - what formula was used?

### Limitations
- provide any known caveats or limitations in the data  
- link to a data quality statement

## Support
- who can people contact to ask questions and provide feedback about the data
- are their any social networks that encourage and support the use of the data? E.g. Meet-ups, Twitter, Discussion forums.

## Known usage
Describe where the data is used in reports, analysis or visualisations.

## License and Attribution
License information should be included for each data table and the data package can be added using the table properties and data package properties commands. If this is insufficient to explain the licensing, then provide additional details here.

Provide any preferred attribution statement or copyright notice

## Preparation
Your data may be prepared by a community of volunteers. If relevant, provide instructions on how to run any preparation and processing scripts to generate the data.
