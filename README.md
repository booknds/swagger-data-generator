# swagger-data-generator
A command line interface (CLI) to generate mock test data from a Swagger Doc

## Usage
Generate a json file filled with mock data of your API from your Swagger/OpenAPI Doc. 
 - Supports both YAML and JSON Swagger/OpenAPI file formats.
 - Scans the defined definitions and creates the test data based it.
 - creates data for every definition property, not just the required fields.

```shell
# install via npm
$: npm install swagger-data-generator -g

# specified output file will br created if it does not already exist.
$: sdg <path-to-input-file> <path-to-output-file>

```

## Coming Soon
 - an API so you can import it and use it in your project.
 - CLI options
    - specify and create multiple random copies of the data
    - each definition getting its own output file 
    - option to chose between generating all data or only required data.


## Contribute
 - Found a problem? Submit an issue!
 - Want to contribute? Submit a PR, with a description of what you are trying to add. I would ask to focus on any of the points in **Coming Soon**

