# Details about the CHAPTER Endpoints

## Create
Type: POST

Protected: Yes

Endpoint: /api/chapter/create
### Variable
```json
    {
        "chapter_slog": "",
        "chapter_text": "",
    }
```
### Response
```json
{
    "success": boolean,
    "message": string
}
```

## Lists
Type: GET

Protected: No

Endpoint: /api/chapter/lists
### Response

No Chapters on DB found / Error in query.

```json
{
    "success": boolean,
    "message": string
}
```
There are chapters on DB

```json
{
    "success": boolean,
    "chapters": [
        {
            "chapter_id": number,
            "account_id": number,
            "chapter_slog": string,
            "chapter_text": string,
            "chapter_status": number,
            "chapter_date": string | date
        }
    ]
}
```

## Details
Type: GET

Protected: No

Endpoint: /api/chapter/:id
### Response

Error in query / Chapter does not exist in DB.
```json
{
    "success": boolean,
    "message": string
}
```
The details are fetched in DB.
```json
{
    "success": boolean,
    "details": {
        "chapter_id": number,
        "account_id": number,
        "chapter_slog": string,
        "chapter_text": string,
        "chapter_status": number,
        "chapter_date": string | date
    }
}
```

## Update
Type: PUT

Protected: Yes

Endpoint: /api/chapter/:id

## Variable
```json
{
    "chapter_slog": string,
    "chapter_text": string,
    "chapter_status": number
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

Endpoint: /api/chapter/:id

### Response

```json
{
    "success": boolean,
    "message": string
}
```