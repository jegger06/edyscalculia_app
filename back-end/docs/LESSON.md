# Details about the LESSON Endpoints

## Create
Type: POST

Protected: Yes

Endpoint: /api/lesson/create

### Variable
```json
{
  "chapter_id": number,
  "lesson_title": string,
  "lesson_slog": string,
  "lesson_content": string | text
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

Lesson Inserted
```json
{
  "success": boolean,
  "message": string,
  "lesson_id": number
}
```

## List of Lesson
Type: GET

Protected: No

Endpoint: /api/lesson/lists | /api/lesson/lists/:chapter_id

Params: sort=number [0 = inactive | 1 = active] (Optional)

Defaults to all lessons if no params added.

### Response

Chapter does not exist or No lessons found
```json
{
  "success": boolean,
  "message": string
}
```

There are lessons in DB
```json
{
  "success": boolean,
  "lessons": [
    {
      "lesson_id": number,
      "account_id": number,
      "chapter_id": number,
      "lesson_title": string,
      "lesson_slog": string,
      "lesson_content": string | text,
      "lesson_status": number,
      "lesson_date": string | date,
      "chapter_text": string,
      "chapter_status": number,
      "account_name": string,
      "account_username": string
    }
  ]
}
```

## Details for a Lesson
Type: GET

Protected: No

Endpoint: /api/lesson/:lesson_id

### Reponse

Error in Query / Lesson does not exist.
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
    "lesson_id": number,
    "account_id": number,
    "chapter_id": number,
    "lesson_title": string,
    "lesson_slog": string,
    "lesson_content": string | text,
    "lesson_status": number,
    "lesson_date": string | date,
    "chapter_text": string,
    "chapter_status": number,
    "account_name": string,
    "account_username": string
  }
}
```

## Update a lesson
Type: PUT

Protected: Yes

Endpoint: /api/lesson/:lesson_id

### Variable
```json
{
  "lesson_title": string,
	"lesson_slog": string,
	"lesson_content": string,
	"lesson_status": number
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

Endpoint: /api/lesson/:lesson_id

Note: It will delete all associated questions and answers for this lesson so you must confirm the admin.

### Response

```json
{
    "success": boolean,
    "message": string
}
```


