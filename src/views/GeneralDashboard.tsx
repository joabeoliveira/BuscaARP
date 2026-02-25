import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchARPs } from '../services/api';
import { Package, DollarSign, AlertTriangle, TrendingUp, Calendar, Monitor, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const data = [
  { name: 'Tecnologia', value: 150 },
  { name: 'Saúde', value: 230 },
  { name: 'Educação', value: 180 },
  { name: 'Infraestrutura', value: 120 },
  { name: 'Segurança', value: 90 },
  { name: 'Logística', value: 140 },
];

export function GeneralDashboard() {
  const [totalAtas, setTotalAtas] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch ARPs from the last year to get a total count
        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);
        
        const res = await fetchARPs({
          dataVigenciaInicialMin: lastYear.toISOString().split('T')[0],
          dataVigenciaInicialMax: today.toISOString().split('T')[0],
          tamanhoPagina: 1
        });
        setTotalAtas(res.totalRegistros);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0C326F] to-[#208494] rounded-2xl p-6 mb-8 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#208494]/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Sparkles className="mr-2 text-yellow-300" size={24} />
              Novo: Assistente IA para Fornecedores
            </h2>
            <p className="text-blue-100 max-w-2xl">
              Utilize nossa nova ferramenta de Inteligência Artificial para analisar o mercado, editar imagens de produtos e gerar vídeos promocionais automaticamente.
            </p>
          </div>
          <button className="bg-white text-[#0C326F] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center shrink-0">
            Experimentar Agora
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </motion.div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Visão Geral</h2>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe os indicadores das Atas de Registro de Preços.</p>
        </div>
        <div className="hidden sm:block">
          <button className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm transition-colors">
            <Calendar size={18} />
            Últimos 30 dias
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:border-[#208494] transition-colors">
          <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package size={100} className="text-[#208494]" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#208494]/10 text-[#208494] p-2.5 rounded-xl">
              <Package size={20} />
            </span>
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">Total de Atas Ativas</h3>
          </div>
          <p className="text-4xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">
            {loading ? '...' : (totalAtas !== null ? totalAtas.toLocaleString('pt-BR') : '1.248')}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
            <TrendingUp size={16} />
            +2.5% em relação ao mês anterior
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:border-emerald-500 transition-colors">
          <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign size={100} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-2.5 rounded-xl">
              <DollarSign size={20} />
            </span>
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">Valor Total Homologado</h3>
          </div>
          <p className="text-4xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">R$ 452 mi</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Disponível para adesão
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:border-rose-500 transition-colors">
          <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle size={100} className="text-rose-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 p-2.5 rounded-xl">
              <AlertTriangle size={20} />
            </span>
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">Próximos Vencimentos</h3>
          </div>
          <p className="text-4xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">34</p>
          <p className="text-sm text-rose-500 dark:text-rose-400 flex items-center gap-1.5 font-medium">
            <AlertTriangle size={16} />
            Vencem nos próximos 30 dias
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Distribuição por Categoria</h3>
            <button className="text-[#208494] text-sm font-semibold hover:underline">Ver relatório completo</button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(32, 132, 148, 0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#1351B4" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Últimas Adesões</h3>
          <div className="space-y-5 flex-1">
            <AdhesionItem 
              icon={<Monitor size={18} />}
              title="Equipamentos de TI"
              subtitle="ARP 45/2023 • Min. da Saúde"
              status="Aprovado"
              color="blue"
            />
            <AdhesionItem 
              icon={<Truck size={18} />}
              title="Serviços de Logística"
              subtitle="ARP 12/2024 • INSS"
              status="Em Análise"
              color="amber"
            />
            <AdhesionItem 
              icon={<Sparkles size={18} />}
              title="Limpeza e Conservação"
              subtitle="ARP 89/2023 • Receita Federal"
              status="Aprovado"
              color="purple"
            />
          </div>
          <button className="w-full mt-6 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            Ver todas as adesões
          </button>
        </div>
      </div>
    </div>
  );
}

function AdhesionItem({ icon, title, subtitle, status, color }: any) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  const statusMap: Record<string, string> = {
    'Aprovado': 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    'Em Análise': 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  };

  return (
    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0">
      <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{subtitle}</p>
      </div>
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap ${statusMap[status]}`}>
        {status}
      </span>
    </div>
  );
}
