"""
@file main.py
@brief Основной файл backend API для PhotoBank
@details FastAPI приложение, предоставляющее REST API для фотобанка:
- Регистрация и авторизация пользователей (JWT)
- CRUD операции для изображений
- Управление избранными фотографиями
- Поиск и фильтрация изображений

@version 1.0.0
@author Команда разработки PhotoBank
@date 2026
"""

from fastapi import FastAPI, Query, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import hashlib
import time
import jwt
from datetime import datetime, timedelta

"""
@brief Основное FastAPI приложение
@details REST API для фотобанка с документацией OpenAPI
"""
app = FastAPI(title="Фотобанк API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT настройки
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# База данных пользователей (в памяти)
users_db = {}

# База данных изображений
images_db = [
    {
        "id": "1",
        "url": "https://picsum.photos/seed/mountain/800/600",
        "title": "Горный пейзаж",
        "description": "Красивый вид на заснеженные вершины гор.",
        "author": "admin",
        "author_id": "admin",
        "tags": ["горы", "природа", "пейзаж", "снег"],
        "publishDate": "2026-03-28T12:00:00Z"
    },
    {
        "id": "2",
        "url": "https://picsum.photos/seed/ocean/800/600",
        "title": "Тихий океан",
        "description": "Закат над бескрайним океаном.",
        "author": "admin",
        "author_id": "admin",
        "tags": ["океан", "закат", "вода", "отпуск"],
        "publishDate": "2026-03-28T12:05:00Z"
    },
    {
        "id": "3",
        "url": "https://picsum.photos/seed/city/800/600",
        "title": "Ночной город",
        "description": "Огни большого города в полночь.",
        "author": "admin",
        "author_id": "admin",
        "tags": ["город", "ночь", "архитектура", "огни"],
        "publishDate": "2026-03-28T12:10:00Z"
    }
]

# Избранные фото (user_id -> [image_ids])
favorites_db = {}

# Pydantic модели

class UserCreate(BaseModel):
    """
    @brief Модель для регистрации нового пользователя
    @details Используется для валидации данных при регистрации
    
    @var username:str Имя пользователя (мин. 3 символа)
    @var password:str Пароль пользователя (мин. 6 символов)
    """
    username: str
    password: str

class UserLogin(BaseModel):
    """
    @brief Модель для входа пользователя
    @details Используется для валидации данных при авторизации
    
    @var username:str Имя пользователя
    @var password:str Пароль пользователя
    """
    username: str
    password: str

class UserResponse(BaseModel):
    """
    @brief Модель ответа с данными пользователя
    @details Возвращается в ответах API
    
    @var username:str Имя пользователя
    """
    username: str

class Token(BaseModel):
    """
    @brief Модель JWT токена
    @details Содержит токен доступа и информацию о пользователе
    
    @var access_token:str JWT токен доступа
    @var token_type:str Тип токена (bearer)
    @var username:str Имя пользователя
    """
    access_token: str
    token_type: str
    username: str

class Image(BaseModel):
    """
    @brief Модель изображения
    @details Представляет фотографию в системе
    
    @var id:str Уникальный идентификатор
    @var url:str URL изображения
    @var title:str Название фотографии
    @var description:str Описание фотографии
    @var author:str Имя автора
    @var author_id:str ID автора
    @var tags:List[str] Список тегов
    @var publishDate:str Дата публикации (ISO 8601)
    @var isLiked:bool Статус "в избранном"
    """
    id: str
    url: str
    title: str
    description: str
    author: str
    author_id: str
    tags: List[str]
    publishDate: str
    isLiked: bool = False

class ImageCreate(BaseModel):
    """
    @brief Модель для создания нового изображения
    @details Используется при загрузке фотографии
    
    @var url:str URL изображения
    @var title:str Название фотографии
    @var description:str Описание фотографии
    @var tags:List[str] Список тегов
    """
    url: str
    title: str
    description: str
    tags: List[str]

class ImageUpdate(BaseModel):
    """
    @brief Модель для обновления изображения
    @details Все поля опциональны для частичного обновления
    
    @var title:str Новое название (опционально)
    @var description:str Новое описание (опционально)
    @var tags:List[str] Новые теги (опционально)
    """
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class LikeAction(BaseModel):
    """
    @brief Модель действия "Избранное"
    @details Используется для добавления/удаления из избранного
    
    @var image_id:str ID изображения
    @var is_liked:bool Статус (True - добавить, False - удалить)
    """
    image_id: str
    is_liked: bool

# Security
security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """
    @brief Хеширование пароля с использованием SHA-256
    @details Использует соль для безопасного хранения паролей
    
    @param password:str Пароль для хеширования
    @return str Хешированный пароль
    
    @example
    hash_password("mypassword")  # возвращает хеш
    """
    salt = "photobank-salt-2026"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    @brief Проверка соответствия пароля хешу
    @details Сравнивает хеш введенного пароля с сохраненным хешем
    
    @param plain_password:str Пароль в открытом виде
    @param hashed_password:str Сохраненный хеш пароля
    @return bool True если пароль совпадает
    
    @example
    verify_password("mypassword", stored_hash)  # True/False
    """
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    @brief Создание JWT токена доступа
    @details Генерирует токен с данными пользователя и временем истечения
    
    @param data:dict Данные для кодирования (обычно {"sub": username})
    @param expires_delta:Optional[timedelta] Время действия токена
    @return str JWT токен
    
    @example
    create_access_token({"sub": "john"}, timedelta(minutes=30))
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    @brief Получение текущего авторизованного пользователя
    @details Извлекает и валидирует JWT токен из заголовка Authorization
    Требует обязательной авторизации
    
    @param credentials:HTTPAuthorizationCredentials Данные авторизации
    @return str Имя пользователя
    @raises HTTPException 401 если не авторизован или токен невалиден
    
    @example
    current_user = await get_current_user(credentials)
    """
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    @brief Получение текущего пользователя (опционально)
    @details Извлекает JWT токен, но не требует обязательной авторизации
    Возвращает None если токен отсутствует или невалиден
    
    @param credentials:HTTPAuthorizationCredentials Данные авторизации
    @return str|None Имя пользователя или None
    
    @example
    user = await get_current_user_optional(credentials)  # может вернуть None
    """
    if credentials is None:
        return None

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except jwt.PyJWTError:
        return None

# Эндпоинты авторизации

@app.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """
    @brief Регистрация нового пользователя
    @details Создаёт нового пользователя в системе с хешированием пароля
    Проверяет уникальность имени и минимальную длину пароля
    
    @param user_data:UserCreate Данные для регистрации
    @return UserResponse Данные созданного пользователя
    @raises HTTPException 400 если имя занято или пароль слишком короткий
    
    @example
    POST /register
    {"username": "john", "password": "secret123"}
    """
    if user_data.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")

    if len(user_data.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")

    if len(user_data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    hashed_pw = hash_password(user_data.password)
    users_db[user_data.username] = {
        "username": user_data.username,
        "password": hashed_pw
    }

    return UserResponse(username=user_data.username)

@app.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """
    @brief Авторизация пользователя
    @details Проверяет учётные данные и выдаёт JWT токен
    
    @param user_data:UserLogin Данные для входа
    @return Token JWT токен доступа
    @raises HTTPException 401 если неверные учётные данные
    
    @example
    POST /login
    {"username": "john", "password": "secret123"}
    # Response: {"access_token": "eyJ...", "token_type": "bearer", "username": "john"}
    """
    user = users_db.get(user_data.username)
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": user_data.username})
    return Token(access_token=access_token, token_type="bearer", username=user_data.username)

@app.get("/me", response_model=UserResponse)
async def get_me(current_user: str = Depends(get_current_user)):
    """
    @brief Получение данных текущего пользователя
    @details Возвращает информацию об авторизованном пользователе
    Требует авторизации
    
    @param current_user:str Имя пользователя (из токена)
    @return UserResponse Данные пользователя
    @requires Authorization header с JWT токеном
    
    @example
    GET /me
    Authorization: Bearer eyJ...
    """
    return UserResponse(username=current_user)

# Эндпоинты изображений

@app.get("/images", response_model=List[Image])
async def get_images(search: Optional[str] = Query(None), current_user: Optional[str] = Depends(get_current_user_optional)):
    """
    @brief Получение списка изображений
    @details Возвращает все изображения или фильтрует по поисковому запросу
    Для авторизованных пользователей показывает статус "в избранном"
    
    @param search:Optional[str] Поисковый запрос (опционально)
    @param current_user:Optional[str] Имя текущего пользователя (опционально)
    @return List[Image] Список изображений
    @query search Строка для поиска по названию, описанию и тегам
    
    @example
    GET /images
    GET /images?search=горы
    """
    result = []
    for img in images_db:
        img_copy = img.copy()
        if current_user:
            user_favorites = favorites_db.get(current_user, [])
            img_copy["isLiked"] = img["id"] in user_favorites
        else:
            img_copy["isLiked"] = False
        result.append(img_copy)

    if search:
        query = search.lower()
        filtered = [
            img for img in result
            if query in img["title"].lower() or
               query in img["description"].lower() or
               any(query in tag.lower() for tag in img["tags"])
        ]
        return filtered
    return result

@app.post("/upload", response_model=Image)
async def upload_image(
    image_data: ImageCreate,
    current_user: str = Depends(get_current_user)
):
    """
    @brief Загрузка нового изображения
    @details Создаёт новую фотографию в базе данных
    Требует обязательной авторизации
    
    @param image_data:ImageCreate Данные изображения
    @param current_user:str Имя пользователя (из токена)
    @return Image Созданное изображение
    @requires Authorization header с JWT токеном
    @raises HTTPException 401 если не авторизован
    
    @example
    POST /upload
    Authorization: Bearer eyJ...
    {"url": "https://...", "title": "Фото", "tags": ["tag1"]}
    """
    new_image = {
        "id": str(int(time.time() * 1000)),
        "url": image_data.url,
        "title": image_data.title or "Без названия",
        "description": image_data.description or "",
        "author": current_user,
        "author_id": current_user,
        "tags": image_data.tags or [],
        "publishDate": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    images_db.insert(0, new_image)
    return Image(**new_image, isLiked=False)

@app.delete("/images/{image_id}")
async def delete_image(image_id: str, current_user: str = Depends(get_current_user)):
    """
    @brief Удаление изображения
    @details Удаляет фотографию из базы данных
    Только владелец может удалить своё изображение
    
    @param image_id:str ID изображения
    @param current_user:str Имя пользователя (из токена)
    @return dict Сообщение об успешном удалении
    @requires Authorization header с JWT токеном
    @raises HTTPException 403 если не владелец
    @raises HTTPException 404 если изображение не найдено
    
    @example
    DELETE /images/123
    Authorization: Bearer eyJ...
    """
    for i, img in enumerate(images_db):
        if img["id"] == image_id:
            if img["author_id"] != current_user:
                raise HTTPException(status_code=403, detail="Not authorized to delete this image")
            images_db.pop(i)
            return {"message": "Image deleted"}
    raise HTTPException(status_code=404, detail="Image not found")

@app.put("/images/{image_id}", response_model=Image)
async def update_image(
    image_id: str,
    image_data: ImageUpdate,
    current_user: str = Depends(get_current_user)
):
    """
    @brief Обновление изображения
    @details Обновляет название, описание или теги изображения
    Только владелец может редактировать своё изображение
    
    @param image_id:str ID изображения
    @param image_data:ImageUpdate Данные для обновления
    @param current_user:str Имя пользователя (из токена)
    @return Image Обновлённое изображение
    @requires Authorization header с JWT токеном
    @raises HTTPException 403 если не владелец
    @raises HTTPException 404 если изображение не найдено
    
    @example
    PUT /images/123
    Authorization: Bearer eyJ...
    {"title": "Новое название", "tags": ["new"]}
    """
    for img in images_db:
        if img["id"] == image_id:
            if img["author_id"] != current_user:
                raise HTTPException(status_code=403, detail="Not authorized to edit this image")

            if image_data.title is not None:
                img["title"] = image_data.title
            if image_data.description is not None:
                img["description"] = image_data.description
            if image_data.tags is not None:
                img["tags"] = image_data.tags

            img_copy = img.copy()
            user_favorites = favorites_db.get(current_user, [])
            img_copy["isLiked"] = img["id"] in user_favorites
            return Image(**img_copy)

    raise HTTPException(status_code=404, detail="Image not found")

@app.get("/user/{username}/images", response_model=List[Image])
async def get_user_images(username: str, current_user: Optional[str] = Depends(get_current_user_optional)):
    """
    @brief Получение изображений конкретного пользователя
    @details Возвращает все фотографии указанного пользователя
    
    @param username:str Имя пользователя
    @param current_user:Optional[str] Текущий пользователь (опционально)
    @return List[Image] Список изображений пользователя
    @query username Имя пользователя чьи фото нужно получить
    
    @example
    GET /user/admin/images
    """
    result = []
    for img in images_db:
        if img["author_id"] == username:
            img_copy = img.copy()
            if current_user:
                user_favorites = favorites_db.get(current_user, [])
                img_copy["isLiked"] = img["id"] in user_favorites
            else:
                img_copy["isLiked"] = False
            result.append(img_copy)
    return result

# Эндпоинты избранного

@app.post("/like")
async def like_image(
    action: LikeAction,
    current_user: str = Depends(get_current_user)
):
    """
    @brief Добавление/удаление изображения в избранное
    @details Управляет списком избранных фотографий пользователя
    
    @param action:LikeAction Действие (ID фото и статус)
    @param current_user:str Имя пользователя (из токена)
    @return dict Сообщение об успешном выполнении
    @requires Authorization header с JWT токеном
    @raises HTTPException 401 если не авторизован
    
    @example
    POST /like
    Authorization: Bearer eyJ...
    {"image_id": "123", "is_liked": true}
    """
    if current_user not in favorites_db:
        favorites_db[current_user] = []

    if action.is_liked:
        if action.image_id not in favorites_db[current_user]:
            favorites_db[current_user].append(action.image_id)
    else:
        if action.image_id in favorites_db[current_user]:
            favorites_db[current_user].remove(action.image_id)

    return {"success": True, "is_liked": action.is_liked}

@app.get("/favorites", response_model=List[Image])
async def get_favorites(current_user: str = Depends(get_current_user)):
    """
    @brief Получение списка избранных изображений
    @details Возвращает все фотографии, добавленные в избранное пользователем
    
    @param current_user:str Имя пользователя (из токена)
    @return List[Image] Список избранных изображений
    @requires Authorization header с JWT токеном
    
    @example
    GET /favorites
    Authorization: Bearer eyJ...
    """
    user_favorites = favorites_db.get(current_user, [])
    result = []
    for img in images_db:
        if img["id"] in user_favorites:
            img_copy = img.copy()
            img_copy["isLiked"] = True
            result.append(img_copy)
    return result

@app.get("/user/{username}/favorites", response_model=List[Image])
async def get_user_favorites(username: str, current_user: str = Depends(get_current_user)):
    """
    @brief Получение избранных фотографий пользователя
    @details Пользователь может просматривать только свои избранные фото
    
    @param username:str Имя пользователя
    @param current_user:str Имя текущего пользователя (из токена)
    @return List[Image] Список избранных изображений
    @requires Authorization header с JWT токеном
    @raises HTTPException 403 если попытка просмотра чужих избранных
    
    @example
    GET /user/john/favorites
    Authorization: Bearer eyJ...
    """
    if username != current_user:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's favorites")
    return await get_favorites(current_user)


if __name__ == "__main__":
    import uvicorn
    """
    @brief Запуск сервера разработки
    @details Запускает uvicorn сервер на порту 8000
    @warning Не используйте в production без надлежащей конфигурации
    """
    uvicorn.run(app, host="0.0.0.0", port=8000)
