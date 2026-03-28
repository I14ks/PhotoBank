import React, { useState, useEffect, useCallback } from 'react';
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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDropzone } from 'react-dropzone';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  publishDate: string;
}

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch photos
  const fetchPhotos = useCallback(async (query = '') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/images${query ? `?search=${encodeURIComponent(query)}` : ''}`);
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      console.error('Failed to fetch photos', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPhotos(searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md border-bottom border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Camera className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter">ФОТОБАНК</h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                placeholder="Поиск вдохновения..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-600/50 transition-all placeholder:text-white/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all active:scale-95"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Загрузить</span>
            </button>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/photobank/1920/1080?blur=10" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]" />
        </div>
        
        <div className="relative z-10 text-center max-w-3xl px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
          >
            МИР В <span className="text-orange-600">ОБЪЕКТИВЕ</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 mb-8"
          >
            Откройте для себя тысячи высококачественных изображений от лучших авторов со всего мира.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Природа', 'Архитектура', 'Люди', 'Технологии', 'Искусство'].map((tag) => (
              <button 
                key={tag}
                onClick={() => { setSearchQuery(tag); fetchPhotos(tag); }}
                className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Layers className="text-orange-600" size={20} />
            Недавние публикации
          </h3>
          <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <Filter size={16} />
            Фильтры
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {photos.map((photo) => (
                <motion.div
                  layout
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-white/5"
                  onClick={() => setSelectedPhoto(photo)}
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
                        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                          <Heart size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && photos.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="mx-auto text-white/10 mb-4" size={64} />
            <p className="text-white/40 text-lg">Ничего не найдено по вашему запросу</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Camera className="text-orange-600" size={24} />
            <span className="font-bold text-xl tracking-tighter">ФОТОБАНК</span>
          </div>
          <p className="text-white/40 text-sm">© 2026 РТУ МИРЭА. Практическая работа №5-8.</p>
          <div className="flex gap-6 text-white/60 text-sm">
            <a href="#" className="hover:text-white transition-colors">О нас</a>
            <a href="#" className="hover:text-white transition-colors">Лицензия</a>
            <a href="#" className="hover:text-white transition-colors">Помощь</a>
          </div>
        </div>
      </footer>

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
                  <h3 className="text-2xl font-bold">Загрузить фото</h3>
                  <button 
                    onClick={() => setIsUploadModalOpen(false)}
                    className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <UploadForm 
                  onSuccess={(newPhoto) => {
                    setPhotos(prev => [newPhoto, ...prev]);
                    setIsUploadModalOpen(false);
                  }} 
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
                    <p className="text-white/60">от {selectedPhoto.author}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedPhoto(null)}
                    className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Описание</h4>
                    <p className="text-white/80 leading-relaxed">{selectedPhoto.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Теги</h4>
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
                      <span>Опубликовано</span>
                      <span>{new Date(selectedPhoto.publishDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all">
                    <Download size={18} />
                    Скачать
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">
                    <Heart size={18} />
                    В избранное
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadForm({ 
  onSuccess, 
}: { 
  onSuccess: (photo: Photo) => void, 
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
    if (!preview) return;

    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: preview,
          title,
          description,
          tags,
          author: 'Вы'
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
          <p className="text-lg font-semibold mb-1">Перетащите фото сюда</p>
          <p className="text-white/40 text-sm">или нажмите для выбора файла</p>
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
              <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Название</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                placeholder="Назовите ваш шедевр"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Описание</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-600/50 h-24 resize-none"
                placeholder="Расскажите историю этого фото..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Теги</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                  placeholder="Добавить тег..."
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
          Отмена
        </button>
        <button 
          type="submit"
          disabled={!preview || isUploading}
          className="flex-[2] py-3 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          {isUploading ? 'Загрузка...' : 'Опубликовать'}
        </button>
      </div>
    </form>
  );
}
