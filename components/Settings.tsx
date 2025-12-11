import React, { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../services/geminiService';
import { Save, Key, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

const Settings: React.FC = () => {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(getApiKey());
  }, []);

  const handleSave = () => {
    setApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
          <Key className="w-5 h-5 mr-2 text-indigo-600" />
          Configuração da API
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
           <h3 className="text-sm font-semibold text-blue-800 mb-1 flex items-center">
              Como obter sua chave?
           </h3>
           <p className="text-sm text-blue-700 mb-2">
              Para utilizar a inteligência artificial do Gemini para gerar posts e imagens, você precisa de uma chave de API do Google AI Studio.
           </p>
           <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Obter chave API gratuitamente <ExternalLink className="w-3 h-3 ml-1" />
           </a>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Chave de API do Gemini (Google GenAI)
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Cole sua chave aqui (começa com AIza...)"
                className="w-full p-3 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 font-mono text-sm"
              />
              {key && (
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
               Sua chave é salva localmente no seu navegador e nunca é enviada para nossos servidores.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Salvo com Sucesso
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
