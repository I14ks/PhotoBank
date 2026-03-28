---
sidebar_position: 3
---

# React JSDoc

## Документирование React компонентов

Для TypeScript/React компонентов используется **JSDoc** синтаксис.

## Пример компонента

```typescript
/**
 * PhotoCard — компонент отображения отдельного фото.
 *
 * @param photo - Данные фотографии
 * @param onLike - Обработчик лайка
 * @param onDelete - Обработчик удаления
 * @returns JSX элемент карточки фото
 *
 * @example
 * ```tsx
 * <PhotoCard
 *   photo={photoData}
 *   onLike={(id) => handleLike(id)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 * ```
 */
interface PhotoCardProps {
  /** Данные фотографии */
  photo: Photo;
  /** Обработчик лайка */
  onLike: (id: string) => void;
  /** Обработчик удаления */
  onDelete: (id: string) => void;
}

export function PhotoCard({
  photo,
  onLike,
  onDelete
}: PhotoCardProps): JSX.Element {
  return (
    <div className="photo-card">
      <img src={photo.url} alt={photo.title} />
      <h3>{photo.title}</h3>
      <p>{photo.description}</p>
      <button onClick={() => onLike(photo.id)}>
        {photo.isLiked ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

## Генерация документации

Для генерации используйте **TypeDoc**:

```bash
npx typedoc src/ --out docs/api --plugin typedoc-plugin-markdown
```

## Сгенерированный Markdown

```markdown
# PhotoCard

**PhotoCard** — компонент отображения отдельного фото.

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| photo | `Photo` | Данные фотографии |
| onLike | `(id: string) => void` | Обработчик лайка |
| onDelete | `(id: string) => void` | Обработчик удаления |

## Returns

`JSX.Element` — JSX элемент карточки фото

## Example

```tsx
<PhotoCard
  photo={photoData}
  onLike={(id) => handleLike(id)}
  onDelete={(id) => handleDelete(id)}
/>
```
```
