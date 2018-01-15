# Details about the USER API

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
