# Details about the ACCOUNT TYPE Endpoints

## Create
Type: POST

Protected: Yes

Endpoint: /api/account/create

### Variable
```json
{
  "type_slog": string,
  "type_description": string
}
``` 

### Response
Failed to Insert
```json
{
  "success": boolean,
  "message": string
}
```

Account Type Inserted
```json
{
  "success": boolean,
  "message": string,
  "type_id": number
}
```

## List of Account Type
Type: GET

Protected: Yes

Endpoint: /api/account/lists

Params: sort=number [0 = inactive | 1 = active] (Optional)

Defaults to all Account Types if no params added.

### Response
Failed to fetch Data in DB / No Account Types in DB.
```json
{
  "success": boolean,
  "message": string
}
```

There are Account Types in DB
```json
{
  "success": boolean,
  "account_types": [
    {
      "type_id": number,
      "type_slog": string,
      "type_description": string,
      "type_status": number,
      "type_date": string | date
    }
  ]
}
```

## Details for Account Type
Type: GET

Protected: Yes

Endpoint: /api/account/:type_id

### Response
Failed to check Account Type / Error in finding Account Type
```json
{
  "success": boolean,
  "message": string
}
```
The Account Type Details are fetched.
```json
{
  "success": boolean,
  "type_details": {
    "type_slog": string,
    "type_description": string,
    "type_status": number,
    "type_date": string | date
  }
}
```

## Update an Account Type
Type: PUT

Protected: Yes

Endpoint: /api/account/:type_id

### Variable
```json
{
  "type_slog": string,
  "type_description": string,
  "type_status": number
}
```

### Response
```json
{
  "success": boolean,
  "message": string
}
```

## Delete an Account Type
Type: DELETE

Protected: Yes

Endpoint: /api/account/:type_id

Note: It won't delete if there are still accounts who is attached to this account type. They need to delete that accounts who are attached to this before being able to delete this account type.

### Response
```json
{
    "success": boolean,
    "message": string
}
```

