import { useEffect, useState } from 'react';
import { fetchARPItems, ARPItem } from '../services/api';
import { Download, Plus, FileText, Wallet, AlertTriangle, Clock, Search, MapPin, TrendingDown, TrendingUp } from 'lucide-react';

export function SupplierDashboard() {
  const [myItems, setMyItems] = useState<ARPItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);
        
        // Fetch some items to act as "Minhas Atas"
        const res = await fetchARPItems({
          dataVigenciaInicialMin: lastYear.toISOString().split('T')[0],
          dataVigenciaInicialMax: today.toISOString().split('T')[0],
          tamanhoPagina: 5
        });
        setMyItems(res.resultado || []);
      } catch (error) {
        console.error("Failed to load supplier data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Painel do Fornecedor</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie suas Atas de Registro de Preços e monitore o mercado.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center justify-center px-4 py-2.5 border-2 border-[#208494] text-[#208494] dark:text-[#4fd1c5] dark:border-[#4fd1c5] rounded-xl hover:bg-[#208494]/5 dark:hover:bg-slate-800 font-bold text-sm transition-colors">
            <Download size={18} className="mr-2" />
            Exportar Relatório
          </button>
          <button className="flex items-center justify-center px-4 py-2.5 bg-[#208494] text-white rounded-xl hover:bg-[#1a6e7c] font-bold text-sm transition-colors shadow-sm">
            <Plus size={18} className="mr-2" />
            Nova Proposta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Atas Ativas" 
          value="12" 
          icon={<FileText size={24} />} 
          color="blue" 
        />
        <StatCard 
          title="Saldo Total Disponível" 
          value="R$ 4.250.000,00" 
          icon={<Wallet size={24} />} 
          color="emerald" 
        />
        <StatCard 
          title="Vencimento Próximo" 
          value="3 Atas" 
          subtitle="Menos de 30 dias"
          icon={<AlertTriangle size={24} />} 
          color="amber" 
        />
        <StatCard 
          title="Empenhos Pendentes" 
          value="2" 
          icon={<Clock size={24} />} 
          color="rose" 
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 mb-10 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold text-[#208494] dark:text-[#4fd1c5] flex items-center">
            <FileText size={20} className="mr-2" />
            Minhas Atas
          </h3>
          <div className="relative w-full sm:w-64">
            <input 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none" 
              placeholder="Filtrar por nº da Ata..." 
              type="text"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-slate-700">
                <th className="px-6 py-4">Nº da Ata / UASG</th>
                <th className="px-6 py-4">Órgão Gerenciador</th>
                <th className="px-6 py-4 text-right">Valor Global</th>
                <th className="px-6 py-4 text-right">Saldo de Empenho</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Carregando...</td>
                </tr>
              ) : myItems.length > 0 ? (
                myItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">{item.numeroAtaRegistroPreco || `ARP ${idx+1}/2024`}</div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">UASG: {item.codigoUnidadeGerenciadora}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      <div className="font-medium truncate max-w-[200px]" title={item.nomeUnidadeGerenciadora}>
                        {item.nomeUnidadeGerenciadora}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">CNPJ: {item.niFornecedor || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-700 dark:text-gray-300">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.valorUnitario || 0) * (item.quantidadeRegistrada || 0))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.valorUnitario || 0) * (item.quantidadeRegistrada || 0) * 0.6)}
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-md text-xs font-bold tracking-wide">
                        ATIVA
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhuma ata encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex justify-end">
          <button className="text-sm text-[#208494] dark:text-[#4fd1c5] font-bold hover:underline flex items-center">
            Ver todas as atas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center">
            <Search size={20} className="mr-2 text-[#208494]" />
            Análise de Mercado
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Busque por itens similares no banco de preços para calibrar suas propostas futuras.</p>
          
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Código CATMAT / Descrição</label>
              <input className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none py-2.5 px-3" placeholder="Ex: 150233 ou 'Papel A4'" type="text" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Região</label>
              <select className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none py-2.5 px-3">
                <option>Todas as regiões</option>
                <option>Centro-Oeste</option>
                <option>Sudeste</option>
              </select>
            </div>
            <button className="w-full bg-slate-900 dark:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors flex justify-center items-center shadow-sm" type="button">
              Analisar Preços
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1.5">Dica gov.br</h4>
            <p className="text-xs text-blue-700 dark:text-blue-200/80 leading-relaxed">
              Acompanhe atas que estão para vencer em sua região para preparar seu estoque e proposta antecipadamente.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              Monitoramento de Concorrentes
            </h3>
            <span className="text-xs font-bold px-3 py-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300">
              CATMAT: 450210 (Computador)
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 text-xs text-gray-500 dark:text-gray-400 uppercase font-bold border-b border-gray-100 dark:border-slate-700">
                  <th className="px-6 py-4">Fornecedor</th>
                  <th className="px-6 py-4">Órgão / UF</th>
                  <th className="px-6 py-4 text-right">Preço Unit. Homologado</th>
                  <th className="px-6 py-4 text-right">Diferença (vs Seu)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-sm">
                <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">Tech Solutions LTDA</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1.5 text-gray-400" /> MJSP / DF
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-800 dark:text-gray-200">R$ 4.200,00</td>
                  <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end">
                    <TrendingDown size={16} className="mr-1" /> -5%
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">Inovação Hardware S.A.</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1.5 text-gray-400" /> TRT-5 / BA
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-800 dark:text-gray-200">R$ 4.450,00</td>
                  <td className="px-6 py-4 text-right text-rose-500 font-bold flex items-center justify-end">
                    <TrendingUp size={16} className="mr-1" /> +2%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50/50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 flex justify-center">
            <button className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-[#208494] dark:hover:text-[#4fd1c5] transition-colors">
              Carregar mais resultados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: any) {
  const colorMap: Record<string, string> = {
    blue: 'border-l-blue-500',
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    rose: 'border-l-rose-500',
  };

  const iconColorMap: Record<string, string> = {
    blue: 'text-blue-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    rose: 'text-rose-500',
  };

  return (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 border-l-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        <span className={iconColorMap[color]}>{icon}</span>
      </div>
      <p className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{value}</p>
      {subtitle && <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1.5">{subtitle}</p>}
    </div>
  );
}
