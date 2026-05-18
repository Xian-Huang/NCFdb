# Project layout

Each crop database now keeps its frontend and backend in the same project folder:

| Project | Frontend port | Backend port | Backend app | Default database |
| --- | ---: | ---: | --- | --- |
| `sunnfcdb` | 3000 | 8105 | `sunnfcdb` | `sunnfcdb` |
| `sesamedb` | 3001 | 8104 | `sesame` | `sesamedb` |
| `flaxdb` | 3002 | 8101 | `flaxdb` | `flaxdb` |
| `safflowerdb` | 3003 | 8103 | `safflower` | `safflowerdb` |
| `perilladb` | 3004 | 8102 | `perilla` | `perilladb` |

Each `*/backend` folder is an independent Django project with its own `.env.example`,
`manage.py`, URL configuration, media directory and database setting. The legacy
top-level `web` folder is left in place so existing deployments are not removed
implicitly.

Typical backend setup:

```bash
cd safflowerdb/backend
copy .env.example .env
python manage.py migrate
python manage.py runserver 8103
```

The matching frontend proxies `/api/*` to that backend, so frontend API code can
keep using `/api/news/`, `/api/users/login/`, and similar project-local paths.
