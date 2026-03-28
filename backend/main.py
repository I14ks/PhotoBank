from fastapi import FastAPI, Query, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import hashlib
import time
import jwt
from datetime import datetime, timedelta

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
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

class Image(BaseModel):
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
    url: str
    title: str
    description: str
    tags: List[str]

class ImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class LikeAction(BaseModel):
    image_id: str
    is_liked: bool

# Security
security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    salt = "photobank-salt-2026"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
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
    user = users_db.get(user_data.username)
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": user_data.username})
    return Token(access_token=access_token, token_type="bearer", username=user_data.username)

@app.get("/me", response_model=UserResponse)
async def get_me(current_user: str = Depends(get_current_user)):
    return UserResponse(username=current_user)

# Эндпоинты изображений
@app.get("/images", response_model=List[Image])
async def get_images(search: Optional[str] = Query(None), current_user: Optional[str] = Depends(get_current_user_optional)):
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
    if username != current_user:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's favorites")
    return await get_favorites(current_user)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
