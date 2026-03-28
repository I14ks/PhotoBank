from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(title="Фотобанк API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Image(BaseModel):
    id: str
    url: str
    title: str
    description: str
    author: str
    tags: List[str]
    publishDate: str

# Mock database
images = [
    {
        "id": "1",
        "url": "https://picsum.photos/seed/mountain/800/600",
        "title": "Горный пейзаж",
        "description": "Красивый вид на заснеженные вершины гор.",
        "author": "Иван Иванов",
        "tags": ["горы", "природа", "пейзаж", "снег"],
        "publishDate": "2026-03-28T12:00:00Z"
    },
    {
        "id": "2",
        "url": "https://picsum.photos/seed/ocean/800/600",
        "title": "Тихий океан",
        "description": "Закат над бескрайним океаном.",
        "author": "Мария Петрова",
        "tags": ["океан", "закат", "вода", "отпуск"],
        "publishDate": "2026-03-28T12:05:00Z"
    },
    {
        "id": "3",
        "url": "https://picsum.photos/seed/city/800/600",
        "title": "Ночной город",
        "description": "Огни большого города в полночь.",
        "author": "Алексей Сидоров",
        "tags": ["город", "ночь", "архитектура", "огни"],
        "publishDate": "2026-03-28T12:10:00Z"
    }
]

@app.get("/images", response_model=List[Image])
async def get_images(search: Optional[str] = Query(None)):
    if search:
        query = search.lower()
        filtered = [
            img for img in images 
            if query in img["title"].lower() or 
               query in img["description"].lower() or 
               any(query in tag.lower() for tag in img["tags"])
        ]
        return filtered
    return images

@app.post("/upload", response_model=Image)
async def upload_image(image_data: dict):
    new_image = {
        "id": str(int(time.time() * 1000)),
        "url": image_data.get("url") or f"https://picsum.photos/seed/{time.time()}/800/600",
        "title": image_data.get("title") or "Без названия",
        "description": image_data.get("description") or "",
        "author": image_data.get("author") or "Аноним",
        "tags": image_data.get("tags") or [],
        "publishDate": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    images.insert(0, new_image)
    return new_image

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
