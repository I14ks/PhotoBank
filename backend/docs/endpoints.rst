API Endpoints
=============

Обзор endpoint'ов
-----------------

Base URL: ``http://localhost:8000``

Авторизация и регистрация
-------------------------

POST /register
~~~~~~~~~~~~~~
Регистрация нового пользователя.

**Request Body:**
.. code-block:: json

   {
     "username": "string",
     "password": "string"
   }

**Response:** ``200 OK``
.. code-block:: json

   {
     "username": "string"
   }

**Errors:**
- ``400 Bad Request`` - Имя занято или пароль слишком короткий

---

POST /login
~~~~~~~~~~~
Авторизация пользователя и получение JWT токена.

**Request Body:**
.. code-block:: json

   {
     "username": "string",
     "password": "string"
   }

**Response:** ``200 OK``
.. code-block:: json

   {
     "access_token": "eyJ...",
     "token_type": "bearer",
     "username": "string"
   }

**Errors:**
- ``401 Unauthorized`` - Неверные учётные данные

---

GET /me
~~~~~~~
Получение данных текущего пользователя.

**Headers:**
- ``Authorization: Bearer <token>``

**Response:** ``200 OK``
.. code-block:: json

   {
     "username": "string"
   }

---

Изображения
-----------

GET /images
~~~~~~~~~~~
Получение списка всех изображений с опциональным поиском.

**Query Parameters:**
- ``search`` (optional) - Поисковый запрос

**Response:** ``200 OK``
.. code-block:: json

   [
     {
       "id": "string",
       "url": "string",
       "title": "string",
       "description": "string",
       "author": "string",
       "author_id": "string",
       "tags": ["string"],
       "publishDate": "string",
       "isLiked": false
     }
   ]

---

POST /upload
~~~~~~~~~~~~
Загрузка нового изображения.

**Headers:**
- ``Authorization: Bearer <token>``

**Request Body:**
.. code-block:: json

   {
     "url": "string",
     "title": "string",
     "description": "string",
     "tags": ["string"]
   }

**Response:** ``200 OK``
.. code-block:: json

   {
     "id": "string",
     "url": "string",
     "title": "string",
     "description": "string",
     "author": "string",
     "author_id": "string",
     "tags": ["string"],
     "publishDate": "string",
     "isLiked": false
   }

**Errors:**
- ``401 Unauthorized`` - Не авторизован

---

DELETE /images/{image_id}
~~~~~~~~~~~~~~~~~~~~~~~~~
Удаление изображения (только владелец).

**Headers:**
- ``Authorization: Bearer <token>``

**Response:** ``200 OK``
.. code-block:: json

   {
     "message": "Image deleted"
   }

**Errors:**
- ``403 Forbidden`` - Не владелец
- ``404 Not Found`` - Изображение не найдено

---

PUT /images/{image_id}
~~~~~~~~~~~~~~~~~~~~~~
Обновление изображения (только владелец).

**Headers:**
- ``Authorization: Bearer <token>``

**Request Body:**
.. code-block:: json

   {
     "title": "string",
     "description": "string",
     "tags": ["string"]
   }

**Response:** ``200 OK``

**Errors:**
- ``403 Forbidden`` - Не владелец
- ``404 Not Found`` - Изображение не найдено

---

GET /user/{username}/images
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Получение изображений конкретного пользователя.

**Response:** ``200 OK`` - Список изображений пользователя

---

Избранное
---------

POST /like
~~~~~~~~~~
Добавление/удаление изображения в избранное.

**Headers:**
- ``Authorization: Bearer <token>``

**Request Body:**
.. code-block:: json

   {
     "image_id": "string",
     "is_liked": true
   }

**Response:** ``200 OK``
.. code-block:: json

   {
     "success": true,
     "is_liked": true
   }

---

GET /favorites
~~~~~~~~~~~~~~
Получение списка избранных изображений.

**Headers:**
- ``Authorization: Bearer <token>``

**Response:** ``200 OK`` - Список избранных изображений

---

GET /user/{username}/favorites
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Получение избранных фотографий пользователя.

**Headers:**
- ``Authorization: Bearer <token>``

**Response:** ``200 OK`` - Список избранных изображений

**Errors:**
- ``403 Forbidden`` - Попытка просмотра чужих избранных
