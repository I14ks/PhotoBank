PhotoBank Backend API Documentation
====================================

.. PhotoBank Backend documentation master file.

Добро пожаловать в документацию backend API для проекта PhotoBank!

.. toctree::
   :maxdepth: 2
   :caption: Содержание:

   api_reference
   endpoints

О проекте
---------

PhotoBank - это платформа для публикации и обмена фотографиями. Backend реализован на FastAPI и предоставляет REST API для:

- Регистрации и авторизации пользователей (JWT)
- CRUD операций для изображений
- Управления избранными фотографиями
- Поиска и фильтрации изображений

Быстрый старт
-------------

.. code-block:: bash

   # Установка зависимостей
   pip install -r requirements.txt

   # Запуск сервера разработки
   python main.py

   # Или через uvicorn
   uvicorn main:app --reload

API Documentation
-----------------

.. automodule:: main
   :members:
   :undoc-members:
   :show-inheritance:

Индексы и таблицы
-----------------

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
