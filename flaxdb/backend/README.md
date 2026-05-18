# FlaxNCFdb backend

This backend serves only the FlaxNCFdb API and Django admin.

Default development port: `8101`

```bash
copy .env.example .env
python manage.py migrate
python manage.py runserver 8101
```
