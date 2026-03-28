---
sidebar_position: 10
---

# Генерация документации из кода

## Принцип работы

Документация в проекте Фотобанк генерируется автоматически из **комментариев в коде** по аналогии с **Doxygen** (для C++) и **Sphinx** (для Python).

## Как это работает

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Исходный код   │────►│  Парсер          │────►│  Docusaurus      │
│  (Python/TS)    │     │  (docstrings)    │     │  (Markdown)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Инструменты

### Для Python

| Инструмент | Описание |
|------------|----------|
| **Sphinx** | Генератор документации из docstrings |
| **pydoc** | Встроенная утилита Python |
| **pdoc** | Автоматическая генерация HTML |

### Для TypeScript/React

| Инструмент | Описание |
|------------|----------|
| **TypeDoc** | Генерация из JSDoc комментариев |
| **Docusaurus** | Интеграция через плагины |

## Процесс генерации

### Шаг 1: Документирование кода

Добавьте docstring к функции или классу:

```python
def calculate_area(r):
    """
    Вычисляет площадь круга по радиусу.

    Args:
        r: Радиус круга

    Returns:
        Площадь круга
    """
    return 3.14159 * r * r
```

### Шаг 2: Запуск генератора

```bash
# Для Python (Sphinx)
sphinx-apidoc -o docs/source backend/

# Для TypeScript (TypeDoc)
npx typedoc src/ --out docs/api
```

### Шаг 3: Интеграция с Docusaurus

Docusaurus автоматически подхватывает Markdown файлы из папки `docs/`:

```bash
npm run start  # Запуск dev-сервера
```

## Пример полного цикла

Рассмотрим полный пример генерации документации для Python функции.

### Исходный код (main.py)

```python
def hash_password(password: str) -> str:
    """
    Хеширует пароль с использованием SHA-256 и соли.

    :param password: Исходный пароль пользователя
    :type password: str
    :return: Хешированный пароль (hex строка)
    :rtype: str
    """
    salt = "photobank-salt-2026"
    return hashlib.sha256(
        (password + salt).encode()
    ).hexdigest()
```

### Сгенерированная документация (Markdown)

```markdown
## hash_password

```python
def hash_password(password: str) -> str
```

Хеширует пароль с использованием SHA-256 и соли.

**Параметры:**
- `password` (str): Исходный пароль пользователя

**Возвращает:**
- str: Хешированный пароль (hex строка)
```

## Автоматизация

Для автоматической генерации добавьте скрипт в `package.json`:

```json
{
  "scripts": {
    "docs:generate": "sphinx-build -b html docs/source docs/build",
    "docs:dev": "npm run docs:generate && docusaurus start"
  }
}
```

## Лучшие практики

1. **Документируйте все публичные API** — функции, классы, методы
2. **Используйте единый стиль** — выберите reStructuredText или Google style
3. **Обновляйте документацию при изменении кода** — автоматизируйте процесс
4. **Добавляйте примеры использования** — это помогает разработчикам
