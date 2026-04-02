# PhotoBank Backend API Documentation

## Обзор

Backend для фотобанка реализован на **FastAPI** (Python) и предоставляет REST API для работы с фотографиями.

## Запуск сервера

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Сервер запустится на `http://localhost:8000`

## Документация API

После запуска сервера документация доступна по адресам:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Модель данных

### Image
```json
{
  "id": "string",
  "url": "string",
  "title": "string",
  "description": "string",
  "author": "string",
  "author_id": "string",
  "tags": ["string"],
  "publishDate": "string (ISO 8601)",
  "isLiked": "boolean"
}
```

## Endpoint'ы

### Авторизация и регистрация

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/register` | Регистрация нового пользователя | ❌ |
| POST | `/login` | Вход и получение JWT токена | ❌ |
| GET | `/me` | Данные текущего пользователя | ✅ |

### Изображения

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/images` | Список всех изображений | ❌ |
| GET | `/images?search=query` | Поиск изображений | ❌ |
| POST | `/upload` | Загрузка нового изображения | ✅ |
| DELETE | `/images/{id}` | Удаление изображения | ✅ |
| PUT | `/images/{id}` | Обновление изображения | ✅ |
| GET | `/user/{username}/images` | Фото пользователя | ❌ |

### Избранное

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/like` | Добавить/удалить из избранного | ✅ |
| GET | `/favorites` | Список избранных фото | ✅ |
| GET | `/user/{username}/favorites` | Избранное пользователя | ✅ |

## Примеры запросов

### Регистрация
```bash
curl -X POST "http://localhost:8000/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "secret123"}'
```

### Вход
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "secret123"}'
```

### Загрузка фото
```bash
curl -X POST "http://localhost:8000/upload" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "url": "https://example.com/photo.jpg",
    "title": "Моё фото",
    "description": "Описание",
    "tags": ["природа", "закат"]
  }'
```

### Поиск изображений
```bash
curl "http://localhost:8000/images?search=горы"
```

## Функции backend'а

### Хеш паролей
```python
def hash_password(password: str) -> str:
    """Хеширование пароля с использованием SHA-256"""
    salt = "photobank-salt-2026"
    return hashlib.sha256((password + salt).encode()).hexdigest()
```

### Создание JWT токена
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создание JWT токена доступа"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

### Получение текущего пользователя
```python
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Получение текущего авторизованного пользователя"""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = credentials.credentials
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get("sub")
    return username
```

## База данных

Данные хранятся в памяти (in-memory):
- `users_db` - пользователи
- `images_db` - изображения
- `favorites_db` - избранные фото

**Примечание:** При перезапуске сервера все данные будут потеряны.

## Безопасность

- Пароли хешируются с солью
- JWT токены с временем жизни 30 минут
- CORS разрешён для всех origin (в production ограничить)

## Структура проекта

```
backend/
├── main.py           # Основной файл API
├── requirements.txt  # Зависимости Python
└── docs/             # Документация
    ├── conf.py
    ├── index.rst
    ├── api_reference.rst
    └── endpoints.rst
```
