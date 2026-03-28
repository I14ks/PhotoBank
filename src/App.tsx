import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  Search,
  Upload,
  Image as ImageIcon,
  Heart,
  Download,
  User,
  X,
  Plus,
  Filter,
  Camera,
  Layers,
  Loader2,
  LogOut,
  LogIn,
  Sun,
  Moon,
  Globe,
  Bookmark,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDropzone } from 'react-dropzone';

// ==================== Translations ====================
type Lang = 'ru' | 'en';

const translations = {
  ru: {
    appTitle: 'ФОТОБАНК',
    searchPlaceholder: 'Поиск вдохновения...',
    upload: 'Загрузить',
    login: 'Войти',
    logout: 'Выйти',
    heroTitle: 'МИР В ОБЪЕКТИВЕ',
    heroSubtitle: 'Откройте для себя тысячи высококачественных изображений от лучших авторов со всего мира.',
    recentPublications: 'Недавние публикации',
    filters: 'Фильтры',
    nothingFound: 'Ничего не найдено по вашему запросу',
    about: 'О нас',
    license: 'Лицензия',
    help: 'Помощь',
    copyright: '© 2026 РТУ МИРЭА. Практическая работа №5-8.',
    uploadPhoto: 'Загрузить фото',
    dragDrop: 'Перетащите фото сюда',
    orClick: 'или нажмите для выбора файла',
    title: 'Название',
    titlePlaceholder: 'Назовите ваш шедевр',
    description: 'Описание',
    descriptionPlaceholder: 'Расскажите историю этого фото...',
    tags: 'Теги',
    addTag: 'Добавить тег...',
    cancel: 'Отмена',
    publish: 'Опубликовать',
    uploading: 'Загрузка...',
    loginTitle: 'Вход',
    registerTitle: 'Регистрация',
    username: 'Никнейм',
    usernamePlaceholder: 'Придумайте никнейм',
    password: 'Пароль',
    passwordPlaceholder: '••••••••',
    noAccount: 'Нет аккаунта?',
    hasAccount: 'Уже есть аккаунт?',
    register: 'Зарегистрироваться',
    from: 'от',
    published: 'Опубликовано',
    download: 'Скачать',
    favorites: 'Избранное',
    addToFavorites: 'В избранное',
    nature: 'Природа',
    architecture: 'Архитектура',
    people: 'Люди',
    technology: 'Технологии',
    art: 'Искусство',
    delete: 'Удалить',
    myPhotos: 'Мои фото',
    allPhotos: 'Все фото',
    myFavorites: 'Мои избранные',
    emptyFavorites: 'У вас пока нет избранных фото',
    browsePhotos: 'Смотреть все фото',
    home: 'Главная',
    editPhoto: 'Редактировать фото',
    saveChanges: 'Сохранить изменения',
    saving: 'Сохранение...'
  },
  en: {
    appTitle: 'PHOTOBANK',
    searchPlaceholder: 'Search for inspiration...',
    upload: 'Upload',
    login: 'Sign In',
    logout: 'Sign Out',
    heroTitle: 'WORLD IN LENS',
    heroSubtitle: 'Discover thousands of high-quality images from the best authors around the world.',
    recentPublications: 'Recent Publications',
    filters: 'Filters',
    nothingFound: 'Nothing found for your request',
    about: 'About',
    license: 'License',
    help: 'Help',
    copyright: '© 2026 RTU MIREA. Practical work №5-8.',
    uploadPhoto: 'Upload Photo',
    dragDrop: 'Drag and drop photo here',
    orClick: 'or click to select file',
    title: 'Title',
    titlePlaceholder: 'Name your masterpiece',
    description: 'Description',
    descriptionPlaceholder: 'Tell the story of this photo...',
    tags: 'Tags',
    addTag: 'Add tag...',
    cancel: 'Cancel',
    publish: 'Publish',
    uploading: 'Uploading...',
    loginTitle: 'Sign In',
    registerTitle: 'Register',
    username: 'Username',
    usernamePlaceholder: 'Come up with a username',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    register: 'Register',
    from: 'from',
    published: 'Published',
    download: 'Download',
    favorites: 'Favorites',
    addToFavorites: 'Add to favorites',
    nature: 'Nature',
    architecture: 'Architecture',
    people: 'People',
    technology: 'Technology',
    art: 'Art',
    delete: 'Delete',
    myPhotos: 'My Photos',
    allPhotos: 'All Photos',
    myFavorites: 'My Favorites',
    emptyFavorites: 'You have no favorite photos yet',
    browsePhotos: 'Browse all photos',
    home: 'Home',
    editPhoto: 'Edit Photo',
    saveChanges: 'Save Changes',
    saving: 'Saving...'
  }
};

// ==================== Context ====================
interface AppContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  t: (key: keyof typeof translations.ru) => string;
}

const AppContext = createContext<AppContextType | null>(null);

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppContextProvider');
  return context;
}

// ==================== Utility ====================
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== Interfaces ====================
interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  author: string;
  author_id: string;
  tags: string[];
  publishDate: string;
  isLiked: boolean;
}

interface User {
  username: string;
}

type Page = 'home' | 'favorites';

// ==================== Main App ====================
export default function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'ru');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [token, setToken] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const t = useCallback((key: keyof typeof translations.ru) => {
    return translations[lang][key] || key;
  }, [lang]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchPhotos = useCallback(async (query = '') => {
    setIsLoading(true);
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/images${query ? `?search=${encodeURIComponent(query)}` : ''}`, { headers });
      const data = await res.json();
      setPhotos(data);
      const liked = new Set(data.filter((p: Photo) => p.isLiked).map((p: Photo) => p.id));
      setLikedPhotos(liked);
    } catch (err) {
      console.error('Failed to fetch photos', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchFavorites = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPhotos(data);
      const liked = new Set(data.map((p: Photo) => p.id));
      setLikedPhotos(liked);
    } catch (err) {
      console.error('Failed to fetch favorites', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserPhotos = async (username: string) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/${username}/images`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPhotos(data);
      const liked = new Set(data.filter((p: Photo) => p.isLiked).map((p: Photo) => p.id));
      setLikedPhotos(liked);
    } catch (err) {
      console.error('Failed to fetch user photos', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 'favorites') {
      fetchFavorites();
    } else if (filterMode === 'mine' && currentUser) {
      fetchUserPhotos(currentUser.username);
    } else {
      fetchPhotos(searchQuery);
    }
  }, [currentPage, filterMode, currentUser, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterMode('all');
    setCurrentPage('home');
    fetchPhotos(searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setFilterMode('all');
    setCurrentPage('home');
    setLikedPhotos(new Set());
  };

  const handleAuthSuccess = (user: User, newToken: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    fetchPhotos();
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/images/${photoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        if (selectedPhoto?.id === photoId) {
          setSelectedPhoto(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete photo', err);
    }
  };

  const handleUpdatePhoto = async (photoId: string, updates: { title?: string; description?: string; tags?: string[] }) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/images/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setPhotos(prev => prev.map(p => p.id === photoId ? updated : p));
        if (selectedPhoto?.id === photoId) {
          setSelectedPhoto(updated);
        }
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to update photo', err);
    }
  };

  const handleLikeToggle = async (photoId: string, currentIsLiked: boolean) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    const newIsLiked = !currentIsLiked;

    // Оптимистичное обновление
    setPhotos(prev => prev.map(p =>
      p.id === photoId ? { ...p, isLiked: newIsLiked } : p
    ));

    if (newIsLiked) {
      setLikedPhotos(prev => new Set(prev).add(photoId));
    } else {
      setLikedPhotos(prev => {
        const next = new Set(prev);
        next.delete(photoId);
        return next;
      });
    }

    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          image_id: photoId,
          is_liked: newIsLiked
        })
      });
    } catch (err) {
      console.error('Failed to like photo', err);
      // Откат при ошибке
      setPhotos(prev => prev.map(p =>
        p.id === photoId ? { ...p, isLiked: currentIsLiked } : p
      ));
    }
  };

  const contextValue: AppContextType = {
    lang,
    setLang,
    theme,
    setTheme,
    t
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={cn(
        "min-h-screen font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300",
        theme === 'dark' ? "bg-[#0A0A0A] text-white" : "bg-gray-50 text-gray-900"
      )}>
        {/* Header */}
        <header className={cn(
          "sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300",
          theme === 'dark' ? "bg-[#0A0A0A]/80 border-white/10" : "bg-white/80 border-gray-200"
        )}>
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 cursor-pointer" onClick={() => setCurrentPage('home')}>
                <Camera className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => setCurrentPage('home')}>{t('appTitle')}</h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className={cn(
                    "w-full rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-600/50 transition-all",
                    theme === 'dark' ? "bg-white/5 border border-white/10 placeholder:text-gray-400" : "bg-gray-100 border border-gray-200 placeholder:text-gray-500"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2", theme === 'dark' ? "text-white/30" : "text-gray-400")} size={18} />
              </form>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowLangMenu(!showLangMenu); setShowThemeMenu(false); }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    theme === 'dark' ? "border border-white/10 hover:bg-white/5" : "border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <Globe size={20} />
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "absolute right-0 mt-2 py-2 rounded-xl shadow-xl min-w-[100px] z-50",
                        theme === 'dark' ? "bg-[#1a1a1a] border border-white/10" : "bg-white border border-gray-200"
                      )}
                    >
                      <button
                        onClick={() => { setLang('ru'); setShowLangMenu(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors",
                          lang === 'ru' ? "bg-orange-600 text-white" : theme === 'dark' ? "hover:bg-white/5" : "hover:bg-gray-100"
                        )}
                      >
                        🇷🇺 RU
                      </button>
                      <button
                        onClick={() => { setLang('en'); setShowLangMenu(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors",
                          lang === 'en' ? "bg-orange-600 text-white" : theme === 'dark' ? "hover:bg-white/5" : "hover:bg-gray-100"
                        )}
                      >
                        🇺🇸 EN
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowThemeMenu(!showThemeMenu); setShowLangMenu(false); }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    theme === 'dark' ? "border border-white/10 hover:bg-white/5" : "border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <AnimatePresence>
                  {showThemeMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "absolute right-0 mt-2 py-2 rounded-xl shadow-xl min-w-[120px] z-50",
                        theme === 'dark' ? "bg-[#1a1a1a] border border-white/10" : "bg-white border border-gray-200"
                      )}
                    >
                      <button
                        onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors",
                          theme === 'dark' ? "bg-orange-600 text-white" : "hover:bg-gray-100"
                        )}
                      >
                        <Moon size={16} /> Dark
                      </button>
                      <button
                        onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors",
                          theme === 'light' ? "bg-orange-600 text-white" : "hover:bg-gray-100"
                        )}
                      >
                        <Sun size={16} /> Light
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Favorites Link */}
              <button
                onClick={() => setCurrentPage('favorites')}
                className={cn(
                  "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  currentPage === 'favorites' ? "bg-orange-600 text-white" : theme === 'dark' ? "border border-white/10 hover:bg-white/5" : "border border-gray-200 hover:bg-gray-100"
                )}
                title={t('favorites')}
              >
                <Bookmark size={20} />
                {likedPhotos.size > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {likedPhotos.size}
                  </span>
                )}
              </button>

              {currentUser ? (
                <>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                  >
                    <Upload size={18} />
                    <span className="hidden sm:inline">{t('upload')}</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold">
                        {currentUser.username[0].toUpperCase()}
                      </div>
                      <span className="font-semibold">{currentUser.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        theme === 'dark' ? "border border-white/10 hover:bg-red-500/20 hover:border-red-500" : "border border-gray-200 hover:bg-red-50 hover:border-red-500"
                      )}
                      title={t('logout')}
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">{t('login')}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        {currentPage === 'home' ? (
          <>
            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://picsum.photos/seed/photobank/1920/1080?blur=10"
                  alt="Background"
                  className="w-full h-full object-cover opacity-30"
                  referrerPolicy="no-referrer"
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-b",
                  theme === 'dark' ? "from-transparent to-[#0A0A0A]" : "from-transparent to-gray-50"
                )} />
              </div>

              <div className="relative z-10 text-center max-w-3xl px-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
                >
                  {lang === 'ru' ? 'МИР В ' : 'WORLD IN '}
                  <span className="text-orange-600">{lang === 'ru' ? 'ОБЪЕКТИВЕ' : 'LENS'}</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={cn("text-lg mb-8", theme === 'dark' ? "text-white/60" : "text-gray-600")}
                >
                  {t('heroSubtitle')}
                </motion.p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { key: 'nature', ru: 'Природа', en: 'Nature' },
                    { key: 'architecture', ru: 'Архитектура', en: 'Architecture' },
                    { key: 'people', ru: 'Люди', en: 'People' },
                    { key: 'technology', ru: 'Технологии', en: 'Technology' },
                    { key: 'art', ru: 'Искусство', en: 'Art' }
                  ].map((tag) => (
                    <button
                      key={tag.key}
                      onClick={() => { setSearchQuery(lang === 'ru' ? tag.ru : tag.en); fetchPhotos(lang === 'ru' ? tag.ru : tag.en); }}
                      className={cn(
                        "px-4 py-1.5 rounded-full border text-sm transition-colors",
                        theme === 'dark' ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-gray-200 bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      {lang === 'ru' ? tag.ru : tag.en}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="text-orange-600" size={20} />
                    {t('recentPublications')}
                  </h3>
                  {currentUser && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilterMode('all')}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm transition-colors",
                          filterMode === 'all' ? "bg-orange-600 text-white" : theme === 'dark' ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"
                        )}
                      >
                        {t('allPhotos')}
                      </button>
                      <button
                        onClick={() => setFilterMode('mine')}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm transition-colors",
                          filterMode === 'mine' ? "bg-orange-600 text-white" : theme === 'dark' ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"
                        )}
                      >
                        {t('myPhotos')}
                      </button>
                    </div>
                  )}
                </div>
                <button className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  theme === 'dark' ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}>
                  <Filter size={16} />
                  {t('filters')}
                </button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={cn("aspect-[4/3] rounded-2xl animate-pulse", theme === 'dark' ? "bg-white/5" : "bg-gray-200")} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {photos.map((photo) => (
                      <PhotoCard
                        key={photo.id}
                        photo={photo}
                        theme={theme}
                        isLiked={likedPhotos.has(photo.id)}
                        onLike={() => handleLikeToggle(photo.id, photo.isLiked)}
                        onClick={() => setSelectedPhoto(photo)}
                        onDelete={() => handleDeletePhoto(photo.id)}
                        canDelete={currentUser?.username === photo.author_id}
                        t={t}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {!isLoading && photos.length === 0 && (
                <div className={cn("text-center py-20", theme === 'dark' ? "text-white/40" : "text-gray-500")}>
                  <ImageIcon className={cn("mx-auto mb-4", theme === 'dark' ? "text-white/10" : "text-gray-200")} size={64} />
                  <p className="text-lg">{t('nothingFound')}</p>
                </div>
              )}
            </main>
          </>
        ) : (
          /* Favorites Page */
          <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Bookmark className="text-orange-600" size={20} />
                  {t('myFavorites')}
                </h3>
              </div>
              <button
                onClick={() => setCurrentPage('home')}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  theme === 'dark' ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Search size={16} />
                {t('browsePhotos')}
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={cn("aspect-[4/3] rounded-2xl animate-pulse", theme === 'dark' ? "bg-white/5" : "bg-gray-200")} />
                ))}
              </div>
            ) : photos.length === 0 ? (
              <div className={cn("text-center py-20", theme === 'dark' ? "text-white/40" : "text-gray-500")}>
                <Bookmark className={cn("mx-auto mb-4", theme === 'dark' ? "text-white/10" : "text-gray-300")} size={64} />
                <p className="text-lg mb-4">{t('emptyFavorites')}</p>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="px-6 py-3 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-500 transition-colors"
                >
                  {t('browsePhotos')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    theme={theme}
                    isLiked={true}
                    onLike={() => handleLikeToggle(photo.id, true)}
                    onClick={() => setSelectedPhoto(photo)}
                    onDelete={() => handleDeletePhoto(photo.id)}
                    canDelete={currentUser?.username === photo.author_id}
                    t={t}
                  />
                ))}
              </div>
            )}
          </main>
        )}

        {/* Footer */}
        <footer className={cn("border-t py-12 mt-20", theme === 'dark' ? "border-white/10" : "border-gray-200")}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <Camera className="text-orange-600" size={24} />
              <span className="font-bold text-xl tracking-tighter">{t('appTitle')}</span>
            </div>
            <p className={cn("text-sm", theme === 'dark' ? "text-white/40" : "text-gray-500")}>{t('copyright')}</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className={cn("transition-colors", theme === 'dark' ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900")}>{t('about')}</a>
              <a href="#" className={cn("transition-colors", theme === 'dark' ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900")}>{t('license')}</a>
              <a href="#" className={cn("transition-colors", theme === 'dark' ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900")}>{t('help')}</a>
            </div>
          </div>
        </footer>

        {/* Auth Modal */}
        <AnimatePresence>
          {isAuthModalOpen && (
            <AuthModal
              mode={authMode}
              onClose={() => setIsAuthModalOpen(false)}
              onSuccess={handleAuthSuccess}
              onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              token={token}
              theme={theme}
              lang={lang}
            />
          )}
        </AnimatePresence>

        {/* Upload Modal */}
        <AnimatePresence>
          {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">{t('uploadPhoto')}</h3>
                    <button
                      onClick={() => setIsUploadModalOpen(false)}
                      className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <UploadForm
                    token={token}
                    onSuccess={(newPhoto) => {
                      setPhotos(prev => [newPhoto, ...prev]);
                      setIsUploadModalOpen(false);
                      if (filterMode === 'mine') {
                        fetchUserPhotos(currentUser!.username);
                      }
                    }}
                    theme={theme}
                    lang={lang}
                    t={t}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPhoto(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="relative bg-[#111] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
              >
                <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-full md:w-[380px] p-8 flex flex-col bg-[#111]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{selectedPhoto.title}</h3>
                      <p className="text-white/60">{t('from')} {selectedPhoto.author}</p>
                    </div>
                    <div className="flex gap-2">
                      {currentUser?.username === selectedPhoto.author_id && (
                        <button
                          onClick={() => { setEditingPhoto(selectedPhoto); setIsEditModalOpen(true); }}
                          className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors text-white/60 hover:text-white"
                        >
                          <Edit size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedPhoto(null)}
                        className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{t('description')}</h4>
                      <p className="text-white/80 leading-relaxed">{selectedPhoto.description}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{t('tags')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhoto.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm text-white/40">
                        <span>{t('published')}</span>
                        <span>{new Date(selectedPhoto.publishDate).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all">
                      <Download size={18} />
                      {t('download')}
                    </button>
                    <button
                      onClick={() => handleLikeToggle(selectedPhoto.id, selectedPhoto.isLiked)}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                        likedPhotos.has(selectedPhoto.id)
                          ? "bg-orange-600 text-white hover:bg-orange-500"
                          : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                      )}
                    >
                      <Heart size={18} fill={likedPhotos.has(selectedPhoto.id) ? "currentColor" : "none"} />
                      {t('addToFavorites')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditModalOpen && editingPhoto && (
            <EditModal
              photo={editingPhoto}
              onClose={() => { setIsEditModalOpen(false); setEditingPhoto(null); }}
              onSave={handleUpdatePhoto}
              theme={theme}
              lang={lang}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}

// ==================== Photo Card Component ====================
function PhotoCard({
  photo,
  theme,
  isLiked,
  onLike,
  onClick,
  onDelete,
  canDelete,
  t
}: {
  photo: Photo;
  theme: 'light' | 'dark';
  isLiked: boolean;
  onLike: () => void;
  onClick: () => void;
  onDelete: () => void;
  canDelete: boolean;
  t: (key: keyof typeof translations.ru) => string;
}) {
  return (
    <motion.div
      layout
      key={photo.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-colors",
        theme === 'dark' ? "bg-white/5" : "bg-gray-100"
      )}
      onClick={onClick}
    >
      <img
        src={photo.url}
        alt={photo.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="font-bold text-lg leading-tight mb-1">{photo.title}</h4>
            <p className="text-white/60 text-sm">@{photo.author}</p>
          </div>
          <div className="flex gap-2">
            {canDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onLike(); }}
              className={cn(
                "w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors",
                isLiked ? "bg-orange-600 text-white" : "bg-white/10 hover:bg-white/20"
              )}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Like indicator when not hovered */}
      {isLiked && (
        <div className="absolute top-4 right-4 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <Heart size={14} fill="white" className="text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ==================== Auth Modal Component ====================
function AuthModal({
  mode,
  onClose,
  onSuccess,
  onSwitchMode,
  token,
  theme,
  lang,
}: {
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
  onSwitchMode: () => void;
  token: string | null;
  theme: 'light' | 'dark';
  lang: Lang;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = (key: keyof typeof translations.ru) => translations[lang][key] || key;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      if (mode === 'register') {
        const loginRes = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          throw new Error(loginData.detail || 'Login error after registration');
        }
        onSuccess({ username: loginData.username }, loginData.access_token);
      } else {
        onSuccess({ username: data.username }, data.access_token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-[#111] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">
              {mode === 'login' ? t('loginTitle') : t('registerTitle')}
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
                {t('username')}
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                placeholder={t('usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={20} /> {t('uploading')}</>
              ) : (
                <>{mode === 'login' ? t('login') : t('register')}</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              {mode === 'login' ? t('noAccount') : t('hasAccount')}
              <button
                onClick={onSwitchMode}
                className="ml-2 text-orange-500 hover:text-orange-400 font-semibold"
              >
                {mode === 'login' ? t('register') : t('login')}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==================== Upload Form Component ====================
function UploadForm({
  token,
  onSuccess,
  theme,
  lang,
  t,
}: {
  token: string | null;
  onSuccess: (photo: Photo) => void;
  theme: 'light' | 'dark';
  lang: Lang;
  t: (key: keyof typeof translations.ru) => string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !token) return;

    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url: preview,
          title,
          description,
          tags,
        })
      });
      const newPhoto = await res.json();
      onSuccess(newPhoto);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
            isDragActive ? "border-orange-500 bg-orange-500/5" : "border-white/10 hover:border-white/20"
          )}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="text-white/40" size={32} />
          </div>
          <p className="text-lg font-semibold mb-1">{t('dragDrop')}</p>
          <p className="text-white/40 text-sm">{t('orClick')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setFile(null); setPreview(null); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{t('title')}</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                placeholder={t('titlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{t('description')}</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-600/50 h-24 resize-none"
                placeholder={t('descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{t('tags')}</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                  placeholder={t('addTag')}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-600/20 text-sm text-orange-500">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => { setFile(null); setPreview(null); }}
          className="flex-1 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          disabled={!preview || isUploading}
          className="flex-[2] py-3 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          {isUploading ? t('uploading') : t('publish')}
        </button>
      </div>
    </form>
  );
}

// ==================== Edit Modal Component ====================
function EditModal({
  photo,
  onClose,
  onSave,
  theme,
  lang,
  t,
}: {
  photo: Photo;
  onClose: () => void;
  onSave: (photoId: string, updates: { title?: string; description?: string; tags?: string[] }) => void;
  theme: 'light' | 'dark';
  lang: Lang;
  t: (key: keyof typeof translations.ru) => string;
}) {
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);
  const [tags, setTags] = useState<string[]>(photo.tags);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(photo.id, { title, description, tags });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">{t('editPhoto')}</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{t('title')}</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                    placeholder={t('titlePlaceholder')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{t('description')}</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-600/50 h-24 resize-none"
                    placeholder={t('descriptionPlaceholder')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{t('tags')}</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                      placeholder={t('addTag')}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-600/20 text-sm text-orange-500">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-[2] py-3 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Edit size={20} />}
                {isSaving ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
