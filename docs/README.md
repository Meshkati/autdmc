# Rest API Docs

This document is rest api docs.

## Signup
`/apiv2/signup/`

### Request
```json
{
    "team_name": "TeamName",
    "team_lead": {
        "first_name": "FNAME",
        "last_name": "LNAME",
        "email": "em",
        "cellphone": "c"
    },
    "team_members": [
        {
            "first_name": "FNAME",
            "last_name": "LNAME",
            "email": "em",
            "cellphone": "c"
        },
        {
            "first_name": "FNAME",
            "last_name": "LNAME",
            "email": "em",
            "cellphone": "c"
        },
        {
            "first_name": "FNAME",
            "last_name": "LNAME",
            "email": "em",
            "cellphone": "c"
        }
    ]
}
```
### Response

## Login
`/apiv2/login/`
