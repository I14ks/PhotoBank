---
sidebar_position: 2
---

# Python Docstrings

## Стиль документирования

В проекте используется стиль документирования **Google Style** с адаптацией под внутренние требования.

## Требования к стилю кода

| Требование | Описание |
|------------|----------|
| **PEP 8** | Базовый стандарт оформления |
| **Длина строки** | 79 символов |
| **Переменные** | Однобуквенные имена |
| **Комментарии** | Только docstrings |

## Пример кода

Ниже приведён пример кода в стиле проекта:

```python
from fastapi import HTTPException, status
from typing import List, Optional
import hashlib
import time


SALT = "photobank-salt-2026"
SECRET = "your-secret-key-change-in-production"
ALGO = "HS256"
EXPIRE = 30


users_db = {}
images_db = []
fav_db = {}


def h(p: str) -> str:
    """Хеширует пароль с солью используя SHA-256."""
    return hashlib.sha256((p + SALT).encode()).hexdigest()


def v(p: str, h: str) -> bool:
    """Проверяет соответствие пароля хешу."""
    return h(p) == h


def gen_token(d: dict, exp: Optional[int] = None) -> str:
    """
    Генерирует JWT токен для пользователя.

    Args:
        d: Данные для кодирования (обычно username)
        exp: Время истечения в минутах (по умолчанию 30)

    Returns:
        JWT токен в виде строки
    """
    import jwt
    from datetime import datetime, timedelta

    c = d.copy()
    e = datetime.utcnow() + timedelta(minutes=exp or EXPIRE)
    c.update({"exp": e})
    return jwt.encode(c, SECRET, algorithm=ALGO)


def find_user(u: str) -> Optional[dict]:
    """
    Ищет пользователя в базе по имени.

    Args:
        u: Имя пользователя

    Returns:
        Данные пользователя или None если не найден
    """
    return users_db.get(u)


def create_user(u: str, p: str) -> dict:
    """
    Создаёт нового пользователя в системе.

    Args:
        u: Имя пользователя (минимум 3 символа)
        p: Пароль (минимум 6 символов)

    Returns:
        Данные созданного пользователя

    Raises:
        HTTPException: Если пользователь существует или
            данные не валидны
    """
    if len(u) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username too short"
        )

    if len(p) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password too short"
        )

    if u in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User exists"
        )

    users_db[u] = {"username": u, "password": h(p)}
    return {"username": u}


def get_images(q: Optional[str] = None) -> List[dict]:
    """
    Получает список изображений с опциональным поиском.

    Args:
        q: Поисковый запрос (опционально)

    Returns:
        Список изображений
    """
    if q is None:
        return images_db.copy()

    r = []
    for i in images_db:
        t = i["title"].lower()
        d = i["description"].lower()
        g = any(q.lower() in tag.lower() for tag in i["tags"])

        if q.lower() in t or q.lower() in d or g:
            r.append(i.copy())

    return r


def add_image(u: str, url: str, t: str, d: str, tags: List[str]) -> dict:
    """
    Добавляет новое изображение в базу.

    Args:
        u: ID пользователя автора
        url: URL изображения
        t: Заголовок
        d: Описание
        tags: Список тегов

    Returns:
        Данные созданного изображения
    """
    img = {
        "id": str(int(time.time() * 1000)),
        "url": url,
        "title": t or "Untitled",
        "description": d or "",
        "author": u,
        "author_id": u,
        "tags": tags or [],
        "publishDate": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

    images_db.insert(0, img)
    return img


def toggle_like(uid: str, iid: str, like: bool) -> bool:
    """
    Добавляет или удаляет изображение из избранного.

    Args:
        uid: ID пользователя
        iid: ID изображения
        like: True для добавления, False для удаления

    Returns:
        Текущее состояние (liked или нет)
    """
    if uid not in fav_db:
        fav_db[uid] = []

    if like:
        if iid not in fav_db[uid]:
            fav_db[uid].append(iid)
    else:
        if iid in fav_db[uid]:
            fav_db[uid].remove(iid)

    return like


def get_favorites(uid: str) -> List[dict]:
    """
    Получает список избранных изображений пользователя.

    Args:
        uid: ID пользователя

    Returns:
        Список избранных изображений
    """
    fids = fav_db.get(uid, [])
    return [i.copy() for i in images_db if i["id"] in fids]


def del_image(iid: str, uid: str) -> bool:
    """
    Удаляет изображение из базы.

    Args:
        iid: ID изображения
        uid: ID пользователя (для проверки прав)

    Returns:
        True если удалено

    Raises:
        HTTPException: Если нет прав или не найдено
    """
    for i, img in enumerate(images_db):
        if img["id"] == iid:
            if img["author_id"] != uid:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No permission"
                )
            images_db.pop(i)
            return True

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Not found"
    )
```

## Как это выглядит в Docusaurus

После генерации документации вышеуказанный код преобразуется в следующий Markdown:

```markdown
# API Reference

## Functions

### `h(p: str) -> str`

Хеширует пароль с солью используя SHA-256.

**Parameters:**
- `p` (str): Пароль

**Returns:**
- `str`: Хешированный пароль

---

### `gen_token(d: dict, exp: Optional[int] = None) -> str`

Генерирует JWT токен для пользователя.

**Parameters:**
- `d` (dict): Данные для кодирования
- `exp` (Optional[int]): Время истечения в минутах

**Returns:**
- `str`: JWT токен

---

### `create_user(u: str, p: str) -> dict`

Создаёт нового пользователя в системе.

**Parameters:**
- `u` (str): Имя пользователя
- `p` (str): Пароль

**Returns:**
- `dict`: Данные пользователя

**Raises:**
- `HTTPException`: Если пользователь существует

---

### `get_images(q: Optional[str] = None) -> List[dict]`

Получает список изображений с опциональным поиском.

**Parameters:**
- `q` (Optional[str]): Поисковый запрос

**Returns:**
- `List[dict]`: Список изображений
```

## Интеграция с Docusaurus

Для автоматической генерации используйте плагин:

```bash
pip install sphinx sphinx-rtd-theme
```

Создайте `conf.py`:

```python
project = 'Фотобанк'
extensions = ['sphinx.ext.autodoc']
templates_path = ['_templates']
exclude_patterns = ['_build']
```

Запустите генерацию:

```bash
sphinx-apidoc -o docs/source backend/
sphinx-build -b html docs/source docs/build
```
