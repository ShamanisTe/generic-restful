# Generic RESTful with JSON file
NodeJS server to expose an RESTful API from JSON file

## Why Generic RESTful

When I work on a side project or a prove of concept, I often an create server in order to get data.
I decided to create a generic RESTful server with JSON to accelerated my development time and let me concentrate on the real application.

## How use it

It "simple" :), this server work on classic verb for REST : GET, POST, PUT, DELETE.

#### first step - init project
in root folder you need to have `./data/` folder to store your projects. If not exist, create it.

In `./data/`, create folder to represent your project.

example: `./data/sampleProject/`

#### second step - init resources

Create JSON file to represent your resource

exemple : `./data/sampleProject/articles.json`, `./data/sampleProject/categories.json`

Each item in JSON file needs a specific property
`_id` to reference and identify your object. _use for POST, PUT, DELETE, GET (one)_
```json
[
  {
    "_id": "unique_value"
  }
]
```

if you need to reference your object in another resource, use `$ref_resourcefilename_id`

example : articles are in category with a relation type n-1, so for `categories.json` :
```json
[
  {
    "_id": "1",
    "name": "Girly"
  }
]
```
and for `articles.json`
```json
{
  "_id": "42",
  "name": "sweet",
  "category": "$ref_categories_1"
}
```
during the GET, the application parse each object's property in order to find `$ref_`, parse the string to find resources file and the object's id to replace `$ref_categories_1` with the real object from `categories.json`

#### third step - call API
localhost:8080/**project_name**/**resource**/**_id**
```javascript
GET http://localhost:8080/sampleProject/articles
GET http://localhost:8080/sampleProject/articles/1
PUT http://localhost:8080/sampleProject/articles
{
    "category": "$ref_categories_3",
    "name": "Top red - new val",
    "_id": "1"
}
POST http://localhost:8080/sampleProject/articles
{
    "category": "$ref_categories_3",
    "name": "Top green"
}
DELETE http://localhost:8080/sampleProject/articles/7
```
## todos
* [ ] More comments
* [ ] Errors management
* [ ] increase my english skill :)

## Feedback
don't hesitate to pull request or create issues !

## Licence
MIT
