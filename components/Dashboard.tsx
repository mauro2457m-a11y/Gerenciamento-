import React, { useEffect, useState } from 'react';
import { SocialPost, SocialPlatform } from '../types';
import { analyzeTrends } from '../services/geminiService';
import { TrendingUp, Users, Eye, Activity, Lightbulb } from 'lucide-react';

interface DashboardProps {
  posts: SocialPost[];
  switchToCreate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, switchToCreate }) => {
  const [trendAnalysis, setTrendAnalysis] = useState<string>('');
  const [loadingTrends, setLoadingTrends] = useState(false);

  useEffect(() => {
    // Only analyze if we have posts
    if (posts.length > 0 && !trendAnalysis) {
      const fetchTrends = async () => {
        setLoadingTrends(true);
        const recentTopics = posts.slice(0, 5).map(p => p.content.substring(0, 50));
        const analysis = await analyzeTrends(recentTopics);
        setTrendAnalysis(analysis);
        setLoadingTrends(false);
      };
      fetchTrends();
    }
  }, [posts, trendAnalysis]);

  const stats = [
    { label: 'Alcance Total', value: '12.5K', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Engajamento', value: '8.2%', change: '+5.4%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Impressões', value: '45.2K', change: '+23%', icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Posts Agendados', value: posts.filter(p => p.status === 'scheduled').length.toString(), change: '0', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Olá, Criador!</h1>
          <p className="text-indigo-100 max-w-xl mb-6">
            Suas redes sociais estão prontas para decolar hoje. Você tem {posts.filter(p => p.status === 'draft').length} rascunhos esperando revisão.
          </p>
          <button 
            onClick={switchToCreate}
            className="bg-white text-indigo-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Criar Novo Post
          </button>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 -mb-10 w-40 h-40 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
            Sugestões Inteligentes (IA)
          </h2>
          {posts.length === 0 ? (
             <div className="text-slate-400 text-sm py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
               Crie alguns posts para que a IA possa analisar seu estilo e dar sugestões.
             </div>
          ) : loadingTrends ? (
             <div className="animate-pulse space-y-3">
               <div className="h-4 bg-slate-100 rounded w-full"></div>
               <div className="h-4 bg-slate-100 rounded w-5/6"></div>
               <div className="h-4 bg-slate-100 rounded w-4/6"></div>
             </div>
          ) : (
            <div className="prose prose-sm prose-slate max-w-none">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-slate-700 whitespace-pre-line">
                {trendAnalysis}
              </div>
            </div>
          )}
        </div>

        {/* Quick Drafts List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Rascunhos Recentes</h2>
          <div className="space-y-4">
            {posts.filter(p => p.status === 'draft').slice(0, 3).map(post => (
              <div key={post.id} className="p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{post.platform}</span>
                   <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
              </div>
            ))}
            {posts.filter(p => p.status === 'draft').length === 0 && (
               <p className="text-sm text-slate-400 text-center py-4">Sem rascunhos pendentes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;