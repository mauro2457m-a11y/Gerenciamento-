import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const Analytics: React.FC = () => {
  // Mock data simulation
  const engagementData = [
    { name: 'Seg', insta: 4000, linkedin: 2400, twitter: 2400 },
    { name: 'Ter', insta: 3000, linkedin: 1398, twitter: 2210 },
    { name: 'Qua', insta: 2000, linkedin: 9800, twitter: 2290 },
    { name: 'Qui', insta: 2780, linkedin: 3908, twitter: 2000 },
    { name: 'Sex', insta: 1890, linkedin: 4800, twitter: 2181 },
    { name: 'Sab', insta: 2390, linkedin: 3800, twitter: 2500 },
    { name: 'Dom', insta: 3490, linkedin: 4300, twitter: 2100 },
  ];

  const audienceData = [
    { name: '18-24', value: 20 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 25 },
    { name: '45+', value: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Engagement Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Engajamento Semanal</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={engagementData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLinkedin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="insta" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorInsta)" name="Instagram" />
                <Area type="monotone" dataKey="linkedin" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLinkedin)" name="LinkedIn" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Demografia da Audiência</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={audienceData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={40} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}}/>
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-slate-500">
             Faixa etária predominante: <span className="font-semibold text-indigo-600">25-34 anos</span>
          </div>
        </div>
      </div>

      {/* Best Time to Post */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <h2 className="text-lg font-semibold text-slate-800 mb-4">Melhor Horário para Postar (Sugestão AI)</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {['09:00', '12:30', '18:00', '21:00'].map(time => (
                 <div key={time} className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center">
                     <span className="block text-2xl font-bold text-indigo-600">{time}</span>
                     <span className="text-xs text-indigo-400 font-medium">Alta Conversão</span>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default Analytics;