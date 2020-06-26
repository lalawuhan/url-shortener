# url-shortener

<!-- TODO  change camelcasing to camel_casing,
delete does not need body
fix the way words are placed, layout
http specifications are just for me
add parameters, maybe add a n optional parametete to use

 -->

basic url shortener

/links

The api endpoint is at ("http://localhost:8080/links")

## HTTP requests

All API requests are made by sending a request using one of the following methods, depending on the action being taken:

## Available endpoints

- GET /
  `returns homepage`

### Access a link

- GET /links
  `returns all the available links in the database`
- GET /links/:id
  `redirects to matching ids homepage`

**Example** GET request:
`GET http://localhost:8080/links/`
**Response**:

```
[
    {
        "url": "example.com",
        "id": 1
    },
    {
        "url": "example.com",
        "id": 2
    },
    {
        "url": "example.com",
        "id": 3
    },
    {
        "url": "example.com",
        "id": 4
    }
]
```

**Example** GET request with id:
`GET http://localhost:8080/links/2`
**Response**:

- Will return a 301 that redirects the user to the url that is associated with the id.

### Create a link

- POST /links
  `create a new redirect link`

**Example** POST request:

```
curl -X POST -H "Content-Type:application/json" -d '{"url":"chosen_url"}'
```

- The API accepts a POST request with header `Content-Type: application/json` and a body JSON in format `{ "url": "http://example.com" }`
- The chosen url should be a valid URL like https://www.twitter.com

**Response**:
1st stage - Redirect to website linked to that id

Future response could be:

```
{
    "shorterUrl": "ctE1zkz",
    "url": "https://www.google.com/search?q=flowr&sxsrf=ALeKk01LpwGUoS0hrT5mLE2pGiHHL2EPXg:1593010941417&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiL7KSa3JrqAhWxuXEKHa_TAOUQ_AUoAXoECBUQAw&biw=1032&bih=1361#imgrc=n3TKvd2Q3p1XxM"
}
```

### Update a link

- PUT /links/:id
  `update specific link url`

**Example** PUT request:

```
curl -X PUT  -H "Content-Type:application/json" -d '{"url":"http://localhost:8080/links/id"}'
```

**Response**:

- Updates the url associated with the id
- HTTP response code 200 to indicate successful update

### Delete a link

- DELETE /links/:id
  `delete specific link url`
  **Example** DELETE request:

```
curl -X DELETE '{"url":"/links/id"}'
```

**Response**:

- Deletes the url associated with the id
- HTTP response code 200 to indicate that the request was successful
<!-- TODO: add a code snippet here of a json file -->

## HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- 200 OK The request was successful. JSON response will be in the body.
- 400 Bad Request There was a problem with the request (Input might not be a valid url, etc.)
- 404 Not found An attempt was made to access a link that does not exist in the API
- 500 Server Error An error on the server occurred
