# SafNCFdb backend

This backend serves only the SafNCFdb API and Django admin.

Default development port: `8103`

```bash
copy .env.example .env
python manage.py migrate
python manage.py runserver 8103
```
