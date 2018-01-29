# Details about the QUESTION RANGE Endpoints

## Create
Type: POST

Protected: Yes

Endpoint: /api/question-range/create

### Variable
```json
{
  "question_range_slog": string,
  "question_range_from": string,
  "question_range_to": string
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

Question Range Inserted
```json
{
  "success": boolean,
  "message": string,
  "question_range_id": number
}
```

## List of Question Range
Type: GET

Protected: Yes

Endpoint: /api/question-range/lists

Params: sort (optional) [ 0 = ASC | 1 = DESC | Default ASC ]

### Response
Failed to fetch DB / No question range in DB
```json
{
  "success": boolean,
  "message": string
}
```

There are question ranges in DB
```json
{
  "success": boolean,
  "question_ranges": [
    {
      "question_range_id": number,
      "account_id": number,
      "question_range_slog": string,
      "question_range_from": string,
      "question_range_to": string,
      "question_range_date": string | date,
      "account_name": string,
      "account_username": string
    }
  ]
}
```

## Details for a Question Range
Type: GET

Protected: No

Endpoint: /api/question-range/:question_range_id

### Response
Failed to check question range / Error in fetching
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
    "question_range_slog": string,
    "question_range_from": string,
    "question_range_to": string,
    "question_range_date": string | date,
    "account_name": string,
    "account_username": string
  }
}
```

## Update a Question Range
Type: PUT

Protected: Yes

Endpoint: /api/question-range/:question_range_id

### Variable
```json
{
  "question_range_slog": string,
  "question_range_from": string,
  "question_range_to": string
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

Endpoint: /api/question-range/:question_range_id

Note: It won't delete if the question range is attached to the questions. Delete the questions first before deleting the question range.

### Response
```json
{
    "success": boolean,
    "message": string
}
```