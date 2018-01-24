# Details about the QUESTION TYPE Endpoints

## Create
Type: POST

Protected: Yes

Endpoint: /api/question-type/create

### Variable
```json
{
  "question_type_slog": string,
  "question_type_text": string
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

Question Type Inserted
```json
{
  "success": boolean,
  "message": string,
  "question_type_id": number
}
```

## List of Question Type
Type: GET

Protected: Yes

Endpoint: /api/question-type/lists

Params: sort (optional) [ 0 = ASC | 1 = DESC | Default ASC ]

### Response
Failed to fetch DB / No question range in DB
```json
{
  "success": boolean,
  "message": string
}
```

There are question types in DB
```json
{
  "success": boolean,
  "question_types": [
    {
      "question_type_id": number,
      "account_id": number,
      "question_type_slog": string,
      "question_type_text": string,
      "question_type_date": string | date,
      "account_name": string,
      "account_username": string
    }
  ]
}
```

## Details for a Question Type
Type: GET

Protected: No

Endpoint: /api/question-type/:question_type_id

### Response
Failed to check question type / Error in fetching
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
  "details": {
    "account_id": number,
    "question_type_slog": string,
    "question_type_text": string,
    "question_type_date": string | date,
    "account_name": string,
    "account_username": string
  }
}
```

## Update a Question Type
Type: PUT

Protected: Yes

Endpoint: /api/question-type/:question_type_id

### Variable
```json
{
  "question_type_slog": string,
  "question_type_text": string
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

Endpoint: /api/question-type/:question_type_id

Note: It won't delete if the question type is attached to the questions. Delete the questions first before deleting the question type.

### Response
```json
{
    "success": boolean,
    "message": string
}
```