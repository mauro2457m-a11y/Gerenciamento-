import React, { useState } from 'react';
import { SocialPlatform, PostTone, GeneratedContent, SocialPost } from '../types';
import { generatePostText, generatePostImage } from '../services/geminiService';
import { Wand2, Image as ImageIcon, Copy, Save, Loader2, Share2, Check, PenLine, Eye } from 'lucide-react';

interface PostCreatorProps {
  onSavePost: (post: SocialPost) => void;
  onNavigateToSettings: () => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({ onSavePost }) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.INSTAGRAM);
  const [tone, setTone] = useState<PostTone>(PostTone.PROFESSIONAL);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [generateImage, setGenerateImage] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Mobile Tab State
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  const handleGenerate = async () => {
    if (!topic) return;

    setIsGenerating(true);
    setGeneratedContent(null);
    setGeneratedImage(null);
    setSaveStatus('idle');
    
    // Auto switch to preview on mobile when generating starts
    if (window.innerWidth < 1024) {
        setMobileTab('preview');
    }

    try {
      const content = await generatePostText(topic, platform, tone, includeEmoji);
      setGeneratedContent(content);

      if (generateImage && content.imagePrompt) {
        setIsGeneratingImage(true);
        try {
          const base64Image = await generatePostImage(content.imagePrompt);
          setGeneratedImage(base64Image);
        } catch (imgErr) {
          console.error("Failed to generate image", imgErr);
        } finally {
          setIsGeneratingImage(false);
        }
      }
    } catch (error) {
      alert("Erro ao gerar conteúdo. Verifique o console para mais detalhes.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;

    const newPost: SocialPost = {
      id: Date.now().toString(),
      platform,
      content: generatedContent.text,
      hashtags: generatedContent.hashtags,
      imageUrl: generatedImage || undefined,
      scheduledDate: new Date().toISOString(), // Default to now, can be changed in calendar
      status: 'draft',
      createdAt: Date.now(),
    };

    onSavePost(newPost);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Tabs */}
      <div className="lg:hidden flex mb-4 bg-slate-200 p-1 rounded-xl">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${
            mobileTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <PenLine className="w-4 h-4 mr-2" />
          Configurar
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${
            mobileTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Eye className="w-4 h-4 mr-2" />
          Prévia
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Input Section */}
        <div className={`${mobileTab === 'edit' ? 'block' : 'hidden'} lg:block bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-fit`}>
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <Wand2 className="w-5 h-5 mr-2 text-indigo-600" />
            Configurar Criação
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Plataforma</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(SocialPlatform).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`text-sm py-2 px-3 rounded-lg border transition-all ${
                      platform === p
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sobre o que vamos postar?</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Dicas para home office produtivo, Lançamento do novo produto de café..."
                className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tom de Voz</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as PostTone)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-700"
                >
                  {Object.values(PostTone).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-end space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEmoji}
                    onChange={(e) => setIncludeEmoji(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                  />
                  <span className="text-sm text-slate-600">Usar Emojis</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateImage}
                    onChange={(e) => setGenerateImage(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                  />
                  <span className="text-sm text-slate-600 flex items-center">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Gerar Imagem AI
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all flex justify-center items-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Criando Mágica...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Gerar Conteúdo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className={`${mobileTab === 'preview' ? 'block' : 'hidden'} lg:block bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col h-fit min-h-[500px]`}>
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center justify-between">
            <span>Prévia</span>
            {generatedContent && (
              <div className="flex space-x-2">
                 <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saved'}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${saveStatus === 'saved' ? 'bg-green-100 text-green-700' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'}`}
                >
                  {saveStatus === 'saved' ? <Check className="w-4 h-4 mr-1"/> : <Save className="w-4 h-4 mr-1" />}
                  {saveStatus === 'saved' ? 'Salvo!' : 'Salvar Rascunho'}
                </button>
              </div>
            )}
          </h2>

          {!generatedContent && !isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Share2 className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-center">
                Seu conteúdo gerado aparecerá aqui.
                <br/>
                <button onClick={() => setMobileTab('edit')} className="lg:hidden text-indigo-600 font-medium mt-2 underline">
                   Voltar para Configurar
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Generated Image Preview */}
              {(generateImage || isGeneratingImage || generatedImage) && (
                 <div className="aspect-video bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center relative">
                    {isGeneratingImage ? (
                      <div className="flex flex-col items-center text-indigo-600">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-xs font-medium uppercase tracking-wider">Gerando Imagem...</span>
                      </div>
                    ) : generatedImage ? (
                      <img src={generatedImage} alt="AI Generated" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-400 text-sm">Imagem será gerada aqui</div>
                    )}
                 </div>
              )}

              {/* Generated Text */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative group">
                {isGenerating ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed mb-4">
                      {generatedContent?.text}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {generatedContent?.hashtags.map(tag => (
                        <span key={tag} className="text-indigo-600 text-sm font-medium bg-indigo-50 px-2 py-1 rounded">
                          #{tag.replace('#', '')}
                        </span>
                      ))}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigator.clipboard.writeText(`${generatedContent?.text}\n\n${generatedContent?.hashtags.map(h => '#' + h.replace('#', '')).join(' ')}`)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600"
                        title="Copiar texto"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Details */}
              {generatedContent && (
                 <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                       <span className="block font-semibold mb-1">Plataforma</span>
                       {platform}
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                       <span className="block font-semibold mb-1">Tom</span>
                       {tone}
                    </div>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCreator;