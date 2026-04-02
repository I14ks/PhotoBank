import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * @file main.tsx
 * @brief Точка входа приложения Photobank
 * @details Инициализирует React-приложение и рендерит корневой компонент App
 * 
 * @module main
 */

/**
 * @brief Корневой элемент DOM для рендеринга приложения
 * @details Получает элемент с id="root" из index.html
 */

/**
 * @brief Инициализация React-приложения
 * @details Создаёт root для ReactDOM и рендерит компонент App в StrictMode
 * 
 * @example
 * // В index.html должен быть элемент:
 * // <div id="root"></div>
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
