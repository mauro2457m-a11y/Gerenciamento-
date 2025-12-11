import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PostCreator from './components/PostCreator';
import PostCalendar from './components/PostCalendar';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { SocialPost } from './types';
import { LayoutDashboard, PenTool, Calendar, BarChart2, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState<SocialPost[]>([]);

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('socialPosts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error("Failed to parse posts", e);
      }
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('socialPosts', JSON.stringify(posts));
  }, [posts]);

  const handleSavePost = (newPost: SocialPost) => {
    setPosts(prev => [newPost, ...prev]);
    // Optional: Auto switch to calendar or stay to create more
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateStatus = (id: string, status: SocialPost['status']) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard posts={posts} switchToCreate={() => setActiveTab('create')} />;
      case 'create':
        return <PostCreator onSavePost={handleSavePost} onNavigateToSettings={() => setActiveTab('settings')} />;
      case 'schedule':
        return <PostCalendar posts={posts} onDeletePost={handleDeletePost} onUpdateStatus={handleUpdateStatus} />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard posts={posts} switchToCreate={() => setActiveTab('create')} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'create', label: 'Criar', icon: PenTool },
    { id: 'schedule', label: 'Agenda', icon: Calendar },
    { id: 'analytics', label: 'Dados', icon: BarChart2 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="flex-1 w-full lg:ml-64 pb-24 lg:pb-8 transition-all">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
           {/* Header */}
           <div className="mb-6 lg:mb-8 flex justify-between items-center sticky top-0 bg-slate-50 z-30 py-2 lg:static">
             <div className="flex items-center">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
                    {activeTab === 'dashboard' && 'Visão Geral'}
                    {activeTab === 'create' && 'Estúdio de Criação'}
                    {activeTab === 'schedule' && 'Calendário'}
                    {activeTab === 'analytics' && 'Análise de Dados'}
                    {activeTab === 'settings' && 'Configurações'}
                  </h1>
                  <p className="text-slate-500 text-xs lg:text-sm mt-1 hidden sm:block">Gerencie suas redes com inteligência.</p>
                </div>
             </div>
             
             <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`p-2 rounded-full transition-colors ${activeTab === 'settings' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-500 hover:text-indigo-600 shadow-sm'}`}
                  title="Configurações"
                >
                   <SettingsIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
                <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm text-sm lg:text-base">
                  JD
                </div>
             </div>
           </div>

           <div className="animate-in fade-in duration-300">
             {renderContent()}
           </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50 px-4 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={20} className={isActive ? 'fill-indigo-100' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
