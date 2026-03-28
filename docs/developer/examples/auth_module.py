"""
Фотобанк API — модуль аутентификации.

Этот модуль предоставляет функции для регистрации, входа
и управления сессиями пользователей.

Пример использования:
    >>> user = create_user("testuser", "password123")
    >>> token = gen_token({"sub": user["username"]})
    >>> verify_password("password123", user["password"])
    True
"""

from fastapi import HTTPException, status
from typing import Optional
import hashlib
import jwt
from datetime import datetime, timedelta


SALT = "photobank-salt-2026"
SECRET = "your-secret-key-change-in-production"
ALGO = "HS256"
EXPIRE = 30

users_db = {}


def h(p: str) -> str:
    """
    Хеширует пароль с солью используя SHA-256.

    Args:
        p: Исходный пароль пользователя

    Returns:
        Хешированный пароль в виде hex-строки

    Example:
        >>> h("mypassword")
        'a1b2c3d4...'
    """
    return hashlib.sha256((p + SALT).encode()).hexdigest()


def v(p: str, hx: str) -> bool:
    """
    Проверяет соответствие пароля хешу.

    Args:
        p: Исходный пароль для проверки
        hx: Хеш для сравнения

    Returns:
        True если пароль совпадает с хешем

    Example:
        >>> v("mypassword", h("mypassword"))
        True
    """
    return h(p) == hx


def gen_token(d: dict, exp: Optional[int] = None) -> str:
    """
    Генерирует JWT токен для пользователя.

    Args:
        d: Словарь данных для кодирования (обычно {"sub": username})
        exp: Время истечения токена в минутах (по умолчанию 30)

    Returns:
        JWT токен в виде строки

    Raises:
        jwt.EncodeError: Если произошла ошибка кодирования

    Example:
        >>> gen_token({"sub": "testuser"})
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    """
    c = d.copy()
    e = datetime.utcnow() + timedelta(minutes=exp or EXPIRE)
    c.update({"exp": e})
    return jwt.encode(c, SECRET, algorithm=ALGO)


def decode_token(t: str) -> Optional[dict]:
    """
    Декодирует JWT токен и возвращает данные.

    Args:
        t: JWT токен для декодирования

    Returns:
        Словарь с данными токена или None если токен невалиден

    Example:
        >>> decode_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        {'sub': 'testuser', 'exp': 1234567890}
    """
    try:
        return jwt.decode(t, SECRET, algorithms=[ALGO])
    except jwt.PyJWTError:
        return None


def find_user(u: str) -> Optional[dict]:
    """
    Ищет пользователя в базе по имени.

    Args:
        u: Имя пользователя для поиска

    Returns:
        Словарь с данными пользователя или None

    Example:
        >>> find_user("testuser")
        {'username': 'testuser', 'password': '...'}
    """
    return users_db.get(u)


def create_user(u: str, p: str) -> dict:
    """
    Создаёт нового пользователя в системе.

    Args:
        u: Имя пользователя (минимум 3 символа)
        p: Пароль (минимум 6 символов)

    Returns:
        Словарь с данными созданного пользователя

    Raises:
        HTTPException: Если никнейм слишком короткий
        HTTPException: Если пароль слишком короткий
        HTTPException: Если пользователь уже существует

    Example:
        >>> create_user("newuser", "securepass123")
        {'username': 'newuser'}
    """
    if len(u) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be at least 3 characters"
        )

    if len(p) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )

    if u in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    users_db[u] = {"username": u, "password": h(p)}
    return {"username": u}


def authenticate_user(u: str, p: str) -> Optional[str]:
    """
    Аутентифицирует пользователя по имени и паролю.

    Args:
        u: Имя пользователя
        p: Пароль для проверки

    Returns:
        JWT токен при успешной аутентификации или None

    Example:
        >>> authenticate_user("testuser", "password123")
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    """
    user = find_user(u)

    if user is None:
        return None

    if not v(p, user["password"]):
        return None

    return gen_token({"sub": u})
