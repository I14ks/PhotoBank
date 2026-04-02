API Reference
=============

Модуль main
-----------

.. automodule:: main
   :members:
   :undoc-members:
   :show-inheritance:
   :member-order: bysource

Модели данных
~~~~~~~~~~~~~

.. autoclass:: main.UserCreate
   :members:
   :special-members: __init__

.. autoclass:: main.UserLogin
   :members:
   :special-members: __init__

.. autoclass:: main.UserResponse
   :members:
   :special-members: __init__

.. autoclass:: main.Token
   :members:
   :special-members: __init__

.. autoclass:: main.Image
   :members:
   :special-members: __init__

.. autoclass:: main.ImageCreate
   :members:
   :special-members: __init__

.. autoclass:: main.ImageUpdate
   :members:
   :special-members: __init__

.. autoclass:: main.LikeAction
   :members:
   :special-members: __init__

Функции утилит
~~~~~~~~~~~~~~

.. autofunction:: main.hash_password

.. autofunction:: main.verify_password

.. autofunction:: main.create_access_token

.. autofunction:: main.get_current_user

.. autofunction:: main.get_current_user_optional

Endpoint'ы авторизации
~~~~~~~~~~~~~~~~~~~~~~

.. autofunction:: main.register

.. autofunction:: main.login

.. autofunction:: main.get_me

Endpoint'ы изображений
~~~~~~~~~~~~~~~~~~~~~~

.. autofunction:: main.get_images

.. autofunction:: main.upload_image

.. autofunction:: main.delete_image

.. autofunction:: main.update_image

.. autofunction:: main.get_user_images

Endpoint'ы избранного
~~~~~~~~~~~~~~~~~~~~~

.. autofunction:: main.like_image

.. autofunction:: main.get_favorites

.. autofunction:: main.get_user_favorites
