---
sidebar_position: 1
---

# Backend архитектура

## FastAPI приложение

Backend реализован на **FastAPI** — современном асинхронном веб-фреймворке Python.

### Основные модули

| Модуль | Описание |
|--------|----------|
| `auth` | Аутентификация и регистрация |
| `images` | CRUD операции с изображениями |
| `favorites` | Управление избранным |

### Структура main.py

```
┌─────────────────────────────────────┐
│  Imports & Configuration            │
├─────────────────────────────────────┤
│  Database (In-Memory)               │
├─────────────────────────────────────┤
│  Pydantic Models                    │
├─────────────────────────────────────┤
│  Helper Functions                   │
│  - hash_password()                  │
│  - verify_password()                │
│  - create_access_token()            │
│  - get_current_user()               │
├─────────────────────────────────────┤
│  API Endpoints                      │
│  - /register, /login, /me           │
│  - /images, /upload, /like          │
│  - /favorites                       │
└─────────────────────────────────────┘
```

### Безопасность

- **JWT токены** — срок действия 30 минут
- **Хеширование паролей** — SHA-256 с солью
- **CORS** — разрешены все origins (для разработки)

### Пример архитектуры модуля

```python
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.get("/items")
def read_items():
    return [{"name": "Item 1", "price": 9.99}]
```
