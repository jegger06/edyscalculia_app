# Details about the QUESTION Endpoints

## Create
Type: POST

Protected: Yes

Endpoint: /api/question/create

Note: If the user is adding a question for pre-test. Please set the question_range_id to 0.

### Variable
```json
{
  "lesson_id": number,
  "question_range_id": number,
  "question_type_id": number,
  "difficulty_id": number,
  "question_content": string,
  "answer_choices": string,
  "answer_key": string
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

Question Inserted
```json
{
  "success": boolean,
  "message": string,
  "question_id": number
}
```

## List of Questions
Type: GET

Protected: No

Endpoint: /api/question/lists/:lesson_id

Params: 

difficulty [difficulty_id default is 1 (pre-test) ]

range [question_range_id]

status [question_status either 0 or 1 default is all]

Note: The success will also return to true if there are no questions for the filter specified.

### Response
There are no questions for the lesson specified.
```json
{
  "success": boolean,
  "message": string
}
```

There are questions for the lesson.
```json
{
  "success": boolean,
  "questions": [
    {
      "question_id": number,
      "question_range_id": number,
      "question_type_id": number,
      "account_id": number,
      "difficulty_id": number,
      "question_content": string,
      "question_status": number,
      "question_date": string,
      "account_name": string,
      "answer_id": number,
      "answer_choices": string,
      "answer_key": string
    }
  ]
}
```

## Details for a Question
Type: GET

Protected: No

Endpoint: /api/question/:question_id

### Response
Failed to Get details or the question does not exist.
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
  "details":  {
    "question_range_id": number,
    "question_type_id": number,
    "account_id": number,
    "difficulty_id": number,
    "question_content": string,
    "question_status": number,
    "question_date": string | date,
    "account_name": string,
    "answer_id": number,
    "answer_choices": string,
    "answer_key": string
  }
}
```

## Update a Question
Type: PUT

Protected: Yes

Endpoint: /api/question/:question_id

### Variable
```json
{
  "question_range_id": number,
  "question_type_id": number,
  "difficulty_id": number,
  "question_content": string,
  "question_status": number,
  "answer_choices": string,
  "answer_key": string
}
```

### Response
```json
{
  "success": boolean,
  "message": string
}
```

## Delete a Question
Type: DELETE

Protected: Yes

Endpoint: /api/question/:question_id

### Response
```json
{
  "success": boolean,
  "message": string
}
```