---
sidebar_position: 3
---

# API Reference

## Обзор

API Фотобанка построено на **REST** принципах и использует **JSON** для обмена данными.

### Базовый URL

```
http://localhost:8000
```

### Аутентификация

Большинство эндпоинтов требуют JWT токен в заголовке:

```
Authorization: Bearer <your_token>
```

## Endpoints

### Аутентификация

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/register` | Регистрация пользователя |
| POST | `/login` | Вход в систему |
| GET | `/me` | Получение данных текущего пользователя |

### Изображения

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/images` | Получить все изображения |
| POST | `/upload` | Загрузить новое изображение |
| GET | `/images/{id}` | Получить изображение по ID |
| PUT | `/images/{id}` | Обновить изображение |
| DELETE | `/images/{id}` | Удалить изображение |
| GET | `/user/{username}/images` | Фото пользователя |

### Избранное

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/favorites` | Получить избранные фото |
| POST | `/like` | Добавить/удалить из избранного |

## Примеры запросов

### Регистрация

```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "password123"}'
```

### Вход

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "password123"}'
```

### Загрузка изображения

```bash
curl -X POST http://localhost:8000/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "url": "https://example.com/image.jpg",
    "title": "My Photo",
    "description": "Description",
    "tags": ["nature", "landscape"]
  }'
```
