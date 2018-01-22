# Details about the USER Endpoints

## Register
Type: POST

Protected: No

Endpoint: /api/user/register
### Variable
```json
    {
        "account_username": "",
        "account_name": "",
        "account_bday": "",
        "account_password": ""
    }
```
### Response
```json
{
    "success": boolean,
    "message": string
}
```

## Login
Type: POST

Protected: No

Endpoint: /api/user/login
### Variable
```json
    {
        "account_username": "",
        "account_password": ""
    }
```
### Response

Failed to login:

```json
{
    "success": boolean,
    "message": string
}
```

Succeed to login:

```json
{
    "success": boolean,
    "token": string,
    "user": {
        "account_id": number,
        "type_id": number,
        "account_name": string,
        "account_bday": string | date,
        "account_username": string,
        "account_password": string,
        "account_date": string | date,
        "type_slog": string,
        "type_description": string,
        "type_active": number,
        "type_date": string | date 
    }
}
```

## List of users
Type: GET

Protected: Yes

Endpoint: /api/user/lists?type=1&date=1 [type (1 = ASC | 2 = DESC)] [date (1 = DESC | 2 = ASC)]

Note: Type defaults to ASC. Date defaults to DESC. No need to set params if you want the default.

### Response
Failed to fetch user accounts.
```json
{
    "success": boolean,
    "message": string
}
```
There are user account fetch in DB
```json
{
    "success": boolean,
    "accounts": [
        {
            "account_id": number,
            "account_name": string,
            "account_bday": string,
            "account_username": string,
            "account_date": string | date,
            "type_id": number,
            "type_description": string
        }
    ]
}
```

## User Details
Type: GET

Protected: Yes

Endpoint: /api/user/:account_id

### Response

Failed to fetch details
```json
{
    "success": boolean,
    "message": string
}
```

Details are available
```json
{
    "success": boolean,
    "details": {
        "account_id": number,
        "account_name": string,
        "account_bday": string | date,
        "account_username": string,
        "account_date": string | date,
        "type_id": number,
        "type_description": string
    }
}
```

## Update a User Account
Type: PUT

Protected: Yes

Endpoint: /api/user/:account_id

Note: The `account_password` is optional to be passed. Pass only if the user/admin changed the password.

### Variable
```json
{
	"type_id": number,
	"account_name": string,
    "account_bday": date,
	"account_password": string
}
```

### Response 
```json
{
    "success": boolean,
    "message": string
}
```

## Delete a User Account
Type: DELETE

Protected: Yes

Endpoint: /api/user/:account_id

Note: The user account won't be deleted if there are still chapters, lessons, questions attached to it.

### Response
```json
{
    "success": boolean,
    "message": string
}
```

