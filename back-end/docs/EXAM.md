# Exam and Score Route

## Exam for User
Type:  GET

Protected: Either Yes or No

Endpoint: /api/question/exam?lesson_id=:number&difficulty=:number

Note: If you are only getting the pre-test for a lesson, it is optional to pass the Authorization header. If you are getting an exam that is not a pre-test you should pass an Authorization header. Might be a good idea to always pass the Authorization header.

### Response
If you are getting an exam aside from pre-test and you did not pass the Authorization header.
```json
{
  "success": boolean,
  "message": string
}
```
The questions you requested.
```json
{
  "success": boolean,
  "questions": [
    {
        "question_id": number,
        "lesson_id": number,
        "question_range_id": number,
        "question_type_id": number,
        "difficulty_id": number,
        "question_content": string,
        "question_status": number,
        "answer_id": number,
        "answer_choices": array of string | number,
        "answer_key": string | number
    }
  ]
}
```

## Topscore per difficulty (Admin)
Type: GET

Protected: Yes

Endpoint: /api/score/top?difficulty=:number

Note: It will only return the top 3 user in score per difficulty.

### Response
```json
{
  "success": boolean,
  "topscore": [
    {
      "score_id": number,
      "lesson_id": number,
      "difficulty_id": number,
      "account_id": number,
      "score_count": number,
      "score_date": string | date,
      "difficulty_text": string,
      "account_name": string,
      "lesson_title": string
    }
  ]
}
```

## Check if user already took the test in pre-test for a specific lesson
Type: GET

Protected: Yes

Endpoint: /api/score/pre-test/:lesson_id

### Response
If the user has not taken the pre-test for the lesson
```json
{
  "success": boolean,
  "message": string
}
```
If user already took the pre-test for the lesson
```json
{
  "success": boolean,
  "detail": {
    "score_id": number,
    "lesson_id": number,
    "difficulty_id": number,
    "account_id": number,
    "score_count": number,
    "score_date": string | date
  }
}
```

## Saving of score
Type: POST

Protected: Yes

Endpoint: /api/score/create

### Variable
```json
{
  "lesson_id": number,
  "difficulty_id": number,
  "score": number
}
```

### Response
```json
{
    "success": boolean,
    "message": string,
    "scoreId": number
}
```

## Score History per difficulty
Type: GET

Protected: Yes

Endpoint: /api/score/lists/:difficulty_id

Note: The result is sorted by score and date in DESCENDING.

### Response
If no score for the difficulty
```json
{
  "success": boolean,
  "message": string
}
```
There are score record.
```json
{
  "success": boolean,
  "scoreSheet": [
    {
      "score_id": number,
      "lesson_id": number,
      "difficulty_id": number,
      "account_id": number,
      "score_count": number,
      "score_date": string | number,
      "lesson_title": string,
      "chapter_id": number,
      "chapter_text": string
    }
  ]
}
```

