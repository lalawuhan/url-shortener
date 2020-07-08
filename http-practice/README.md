# url-shortener

basic url shortener

- Practising nodejs, http methods and general routing

/links

The api endpoint is at ("http://localhost:3000/links")

## Available endpoints

- Return homepage : `GET /api`

### Access a link

- Return all the links in the database : `GET /links`

- Redirects to matching ids homepage : `GET /links/:id`

**Example**
`GET http://localhost:3000/links/`

`curl http://localhost:3000/links/ -H "Accept: application/json"`

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
`GET http://localhost:3000/links/2`
**Response**:

- Will return a 301 that redirects the user to the url that is associated with the id.

### Create a link

- Create a new redirect link
  `POST /links`

```
curl --location --request POST 'http://localhost:3000/links/' \
--header 'Content-Type: application/json' \
--data-raw '"postman.com"'
```

- The API accepts a POST request with header `Content-Type: application/json` and a url in string format `"http://example.com"`
- The chosen url should be a valid URL like https://www.twitter.com

**Response**:
1st stage - Redirect to website linked to that id

Future response could be:

```
{
    "shorterUrl": "g.co/12",
    "url": "https://www.google.com/search?q=flowr&sxsrf=ALeKk01LpwGUoS0hrT5mLE2pGiHHL2EPXg:1593010941417&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiL7KSa3JrqAhWxuXEKHa_TAOUQ_AUoAXoECBUQAw&biw=1032&bih=1361#imgrc=n3TKvd2Q3p1XxM"
}
```

### Update a link

- Update specific link url
  `PUT /links/:id`

```
curl --location --request PUT 'http://localhost:3000/links/2' \
--header 'Content-Type: application/json' \
--data-raw ' {"url":"mail.com"}'
```

Postman : {"url":"mail.com"}

**Response**:

- Updates the url associated with the id
- HTTP response code 200 to indicate successful update

### Delete a link

- Delete specific link url : `DELETE /links/:id`

```
curl -X DELETE '{"url":"/links/id"}'
```

**Response**:

- Deletes the url associated with the id
- HTTP response code 200 to indicate that the request was successful

## HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- 200 OK The request was successful. JSON response will be in the body.
- 400 Bad Request There was a problem with the request (Input might not be a valid url, etc.)
- 404 Not found An attempt was made to access a link that does not exist in the API
- 500 Server Error An error on the server occurred
