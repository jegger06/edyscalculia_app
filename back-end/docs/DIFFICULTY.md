# Details about the DIFFICULTY Endpoints

## Create
Type: POST

Protected: Yes

Endpoint: /api/difficulty/create

### Variable
```json
{
  "difficulty_slog": number,
  "difficulty_text": string
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

Difficulty Inserted
```json
{
  "success": boolean,
  "message": string,
  "difficulty_id": number
}
```

## List of Difficulties
Type: GET

Protected: No

Endpoint: /api/difficulty/lists

### Response
Failed to fetch DB / No difficulties in DB
```json
{
  "success": boolean,
  "message": string
}
```

There are difficulties in DB
```json
{
  "success": boolean,
  "difficulties": [
    {
      "difficulty_id": number,
      "account_id": number,
      "difficulty_slog": string,
      "difficulty_text": string,
      "difficulty_date": string | date,
      "account_name": string,
      "account_username": string
    }
  ]
}
```

## Details for a Difficulty
Type: GET

Protected: No

Endpoint: /api/difficulty/:difficulty_id

### Response
Failed to check difficulty / Error in fetching
```json
{
  "success": boolean,
  "message": string
}
```

Details are fetched in DB
```json
{
  "success": boolean,
  "difficulties": {
    "difficulty_id": number,
    "account_id": number,
    "difficulty_slog": string,
    "difficulty_text": string,
    "difficulty_date": string | date,
    "account_name": string,
    "account_username": string
  }
}
```

## Update a Difficulty
Type: PUT

Protected: Yes

Endpoint: /api/difficulty/:difficulty_id

### Variable
```json
{
  "difficulty_slog": string,
  "difficulty_text": string
}
```

### Response
```json
{
    "success": boolean,
    "message": string
}
```

## Delete
Type: DELETE

Protected: Yes

Endpoint: /api/difficulty/:difficulty_id

Note: It won't delete if the difficulty is attached to the questions. Delete the questions first before deleting the difficulty.

### Response
```json
{
    "success": boolean,
    "message": string
}
```


