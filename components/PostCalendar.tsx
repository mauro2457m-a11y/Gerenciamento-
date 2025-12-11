import React from 'react';
import { SocialPost, SocialPlatform } from '../types';
import { Calendar as CalendarIcon, Clock, Trash2, Send } from 'lucide-react';

interface PostCalendarProps {
  posts: SocialPost[];
  onDeletePost: (id: string) => void;
  onUpdateStatus: (id: string, status: SocialPost['status']) => void;
}

const PostCalendar: React.FC<PostCalendarProps> = ({ posts, onDeletePost, onUpdateStatus }) => {
  // Sort posts by date (newest first for list, or upcoming)
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.INSTAGRAM: return 'bg-pink-100 text-pink-700 border-pink-200';
      case SocialPlatform.LINKEDIN: return 'bg-blue-100 text-blue-700 border-blue-200';
      case SocialPlatform.TWITTER: return 'bg-slate-100 text-slate-700 border-slate-200';
      case SocialPlatform.FACEBOOK: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: SocialPost['status']) => {
    switch (status) {
      case 'published': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Publicado</span>;
      case 'scheduled': return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Agendado</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Rascunho</span>;
    }
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center text-slate-400">
        <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>Nenhum post agendado ainda. Use o criador para começar!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-white relative md:sticky md:top-0 z-10">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" />
          <span className="hidden sm:inline">Cronograma de Conteúdo</span>
          <span className="sm:hidden">Cronograma</span>
        </h2>
        <span className="text-sm text-slate-500">{posts.length} posts</span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 border-b border-slate-100">Plataforma</th>
              <th className="p-4 border-b border-slate-100 w-1/2">Conteúdo</th>
              <th className="p-4 border-b border-slate-100">Data</th>
              <th className="p-4 border-b border-slate-100">Status</th>
              <th className="p-4 border-b border-slate-100 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedPosts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4 align-top">
                  <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${getPlatformColor(post.platform)}`}>
                    {post.platform}
                  </span>
                </td>
                <td className="p-4 align-top">
                  <div className="flex gap-3">
                    {post.imageUrl && (
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={post.imageUrl} alt="Post asset" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-700 line-clamp-2 mb-1 font-medium">{post.content}</p>
                      <p className="text-xs text-indigo-500 line-clamp-1">{post.hashtags.map(h => `#${h.replace('#','')}`).join(' ')}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-top text-sm text-slate-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1.5" />
                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="p-4 align-top">
                  {getStatusBadge(post.status)}
                </td>
                <td className="p-4 align-top text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {post.status !== 'published' && (
                      <button 
                        onClick={() => onUpdateStatus(post.id, 'published')}
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded" 
                        title="Marcar como publicado"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                       onClick={() => onDeletePost(post.id)}
                       className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                       title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4 bg-slate-50">
        {sortedPosts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${getPlatformColor(post.platform)}`}>
                {post.platform}
              </span>
              {getStatusBadge(post.status)}
            </div>
            
            <div className="flex gap-3">
               {post.imageUrl && (
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={post.imageUrl} alt="Asset" className="w-full h-full object-cover" />
                  </div>
               )}
               <div className="flex-1 min-w-0">
                 <p className="text-sm text-slate-800 line-clamp-3 mb-1 font-medium">{post.content}</p>
                 <p className="text-xs text-indigo-500 line-clamp-1 overflow-hidden text-ellipsis">{post.hashtags.map(h => `#${h.replace('#','')}`).join(' ')}</p>
               </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
              <div className="flex items-center text-xs text-slate-400">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(post.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex space-x-3">
                  {post.status !== 'published' && (
                    <button 
                      onClick={() => onUpdateStatus(post.id, 'published')}
                      className="text-slate-400 hover:text-green-600"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                      onClick={() => onDeletePost(post.id)}
                      className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCalendar;