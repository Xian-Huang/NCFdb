# SesameDB backend

This backend serves only the SesameDB API and Django admin.

Default development port: `8104`

```bash
copy .env.example .env
python manage.py migrate
python manage.py runserver 8104
```
