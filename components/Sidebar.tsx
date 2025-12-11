import React from 'react';
import { LayoutDashboard, PenTool, Calendar, BarChart2, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'create', label: 'Criar Conteúdo', icon: PenTool },
    { id: 'schedule', label: 'Calendário', icon: Calendar },
    { id: 'analytics', label: 'Insights', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex-col h-screen fixed left-0 top-0 shadow-xl z-50 hidden lg:flex">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          SocialAI
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manager Pro</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'settings' 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings size={20} />
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
