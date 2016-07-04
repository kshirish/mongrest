# Mongrest

* create models using a simple and easy to use web interface
* outputs query results from mongoDB database based on restful urls

## Supported RESTful urls

### Single resource
* GET /tickets - Retrieves a list of tickets
* GET /tickets/12 - Retrieves a ticket with #12
* POST /tickets - Creates a new ticket
* PUT /tickets/12 - Updates ticket #12
* DELETE /tickets/12 - Deletes ticket #12

### Deal with relations
* GET /tickets/12/messages - Retrieves list of messages for ticket #12
* GET /tickets/12/messages/5 - Retrieves message #5 for ticket #12
* POST /tickets/12/messages - Creates a new message in ticket #12
* PUT /tickets/12/messages/5 - Updates message #5 for ticket #12
* DELETE /tickets/12/messages/5 - Deletes message #5 for ticket #12

### Filter
* GET /tickets?state=open - Retrieves tickets with state open

### Sort
* GET /tickets?sort=-priority - Retrieves a list of tickets in descending order of priority

### Limit fields
* GET /tickets?fields=id,subject,customer_name,updated_at

### Limit results
* GET /tickets?limit=10 - Retrives only top 10 results

### Together
* GET /tickets?fields=id,subject,customer_name,updated_at&state=open&sort=-updated_at


