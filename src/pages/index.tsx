import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';

/**
 * @file index.tsx
 * @brief Главная страница документации Docusaurus
 * @details Предоставляет навигацию к документации разработчика и пользователя
 * 
 * @module pages/index
 */

/**
 * @brief Компонент заголовка главной страницы
 * @details Отображает hero-секцию с названием проекта и кнопками навигации
 * 
 * @returns {JSX.Element} Hero-секция с заголовком и кнопками
 * 
 * @example
 * // Используется в компоненте Home
 * <HomepageHeader />
 */
function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary')}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="buttons">
          <Link
            className="button button--secondary button--lg"
            to="/docs/developer/intro">
            Документация разработчика
          </Link>
          <Link
            className="button button--secondary button--lg margin-left--md"
            to="/docs/user/wiki/getting-started">
            Документация пользователя
          </Link>
        </div>
      </div>
    </header>
  );
}

/**
 * @brief Главный компонент страницы Home
 * @details Основная страница документации с навигацией для разработчиков и пользователей
 * 
 * @returns {JSX.Element} Страница с hero-секцией и двумя разделами навигации
 * 
 * @example
 * // Экспортируется как default компонент страницы
 * export default function Home()
 */
export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Добро пожаловать`}
      description="Документация проекта Фотобанк">
      <HomepageHeader />
      <main>
        <div className="container margin-vert--xl">
          <div className="row">
            <div className="col col--6 padding--md">
              <h2>👨‍💻 Разработчикам</h2>
              <p>
                Архитектура, API, генерация документации из кода и руководство
                по развёртыванию.
              </p>
              <Link
                className="button button--outline button--primary"
                to="/docs/developer/intro">
                Начать
              </Link>
            </div>
            <div className="col col--6 padding--md">
              <h2>👤 Пользователям</h2>
              <p>
                Руководства по использованию, Wiki и ответы на частые вопросы.
              </p>
              <Link
                className="button button--outline button--primary"
                to="/docs/user/wiki/getting-started">
                Начать
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
