import React from 'react';
import { Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
          <SettingsIcon className="w-5 h-5 mr-2 text-indigo-600" />
          Configurações do Aplicativo
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
             <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
             <div>
                <h3 className="text-sm font-semibold text-green-800">Ambiente Configurado</h3>
                <p className="text-sm text-green-700 mt-1">
                   A chave de API está configurada via variáveis de ambiente. Você está pronto para usar todas as funcionalidades de IA.
                </p>
             </div>
          </div>
          
          <div className="border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Versão 1.0.0
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;