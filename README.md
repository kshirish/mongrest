# Mongrest 
_**Mongrest**_ provides an HTTP interface for your mongodb.

## How to use
* ```npm install -g mrest```
* ```mrest --port=<port-number> --url=<database-url>```

## Supported RESTful urls

### CRUD
* GET /users - Retrieves a list of users
* GET /users/12 - Retrieves a user with #12
* POST /users/add - Creates a new user
* PUT /users/12 - Updates user #12
* DELETE /users/12 - Deletes user #12

### Filter
* GET /tickets?state=open - Retrieves tickets with state open

### Sort
* GET /users?sort=-priority - Retrieves a list of users in descending order of priority

### Limit fields
* /users?fields=-id,username,first_name

### Limit results
* GET /users?limit=10 - Retrives only top 10 results

### Combined
* GET /users?limit=10&fields=-id,fullname,username&sort=-username

### Misc
* GET /stats - stats for the current database
* GET /list - lists collections in the current database
* POST /test/new - create a new collection 'test'
* DELETE /test - delete 'test' collection

### Query to mongo
* POST /users/filter
  ```name=john&age>21&fields=name,age&sort=name,-age&offset=10&limit=10```
