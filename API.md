# API

On any error, the API will return a 500 code. 200 code if success.

## Unprotected routes

### Create an user

`POST /api/v1/user`

#### **body**

```json
{
    "username": "your_username",
    "email": "jane.doe@example.com",
    "password": "the most secure password in the world"
}
```

#### **response body**

```json
{ 
    "id": 12
}
```
    
### Get a new JWT token

`POST /api/v1/token`

#### **body**


```json
{
    "username": "your_username",
    "password": "the most secure password in the world"
}
```

#### **response body**

*Note: the jwt token contains an `id` field containing the id of the logged user.*

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTI0NTY5MjQ0LCJleHAiOjE1MjQ1NzI4NDR9.b28TSFSPR5we-yt6gcnX85vmKMHZL-P-52uRsMp8lJ4"
}
```

## Protected routes

Those routes requires an header `Authorization: Bearer jwt_token*. Otherwise, the API will return a 401 code.

### Get information about the user

`GET /api/v1/user`

#### **response body**

```json
{
    "id": 12,
    "username": "your_username",
    "email": "jane.doe@example.com"
}
```

### Delete user

`DELETE /api/v1/user`
