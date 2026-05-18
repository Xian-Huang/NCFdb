# SunNCFdb backend

This backend serves only the SunNCFdb API and Django admin.

Default development port: `8105`

```bash
copy .env.example .env
python manage.py migrate
python manage.py runserver 8105
```
