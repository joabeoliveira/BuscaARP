import { useEffect, useState, Key } from 'react';
import { fetchARPItems, ARPItem } from '../services/api';
import { Search, Filter, QrCode, ChevronLeft, ChevronRight } from 'lucide-react';

export function SearchItems() {
  const [items, setItems] = useState<ARPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      try {
        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);
        
        const res = await fetchARPItems({
          dataVigenciaInicialMin: lastYear.toISOString().split('T')[0],
          dataVigenciaInicialMax: today.toISOString().split('T')[0],
          pagina: page,
          tamanhoPagina: 12
        });
        setItems(res.resultado || []);
        setTotal(res.totalRegistros || 0);
      } catch (error) {
        console.error("Failed to load items", error);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, [page]);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Busca de Itens e Atas</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Pesquise por itens no catálogo de materiais (CATMAT) e serviços (CATSER), consulte atas de registro de preços vigentes e solicite adesão diretamente aos órgãos gerenciadores.
        </p>
      </div>

      <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center text-[#208494] dark:text-[#4fd1c5]">
            <Filter size={20} className="mr-2" />
            Filtros de Pesquisa
          </h2>
          <button className="text-sm text-[#208494] dark:text-[#4fd1c5] font-semibold hover:underline">Limpar filtros</button>
        </div>
        
        <form className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Descrição do Item ou Código CATMAT/CATSER</label>
            <div className="relative">
              <input 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] focus:border-transparent outline-none transition-shadow" 
                placeholder="Ex: Seringa descartável 20ml, Notebook i7..." 
                type="text"
              />
              <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="md:col-span-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Órgão Gerenciador</label>
            <select className="w-full py-2.5 px-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none">
              <option value="">Selecione um órgão</option>
              <option value="MS">Ministério da Saúde</option>
              <option value="MEC">Ministério da Educação</option>
            </select>
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Situação da Ata</label>
            <select className="w-full py-2.5 px-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none">
              <option value="active">Vigente</option>
              <option value="expiring">Vence em breve</option>
              <option value="expired">Expirada</option>
            </select>
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">UF de Entrega</label>
            <select className="w-full py-2.5 px-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none">
              <option value="">Nacional</option>
              <option value="DF">Distrito Federal</option>
              <option value="SP">São Paulo</option>
            </select>
          </div>
          
          <div className="md:col-span-2 flex items-end">
            <button className="w-full bg-[#208494] hover:bg-[#1a6e7c] text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors flex justify-center items-center" type="button">
              <Search size={18} className="mr-2" />
              Buscar
            </button>
          </div>
        </form>
      </section>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Resultados da Busca 
          <span className="text-sm font-medium text-gray-500 ml-3 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {total} itens encontrados
          </span>
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ordenar por:</span>
          <select className="text-sm py-1.5 pl-3 pr-8 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#208494] outline-none font-medium">
            <option>Mais recentes</option>
            <option>Menor preço</option>
            <option>Maior quantidade</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#208494]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <ItemCard key={`${item.numeroAtaRegistroPreco}-${item.numeroItem}-${idx}`} item={item} />
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Nenhum item encontrado para os filtros selecionados.
            </div>
          )}
        </div>
      )}

      {total > 0 && (
        <div className="mt-10 flex justify-center">
          <nav className="inline-flex rounded-xl shadow-sm -space-x-px overflow-hidden">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-bold text-gray-700 dark:text-gray-200">
              Página {page}
            </span>
            <button 
              onClick={() => setPage(p => p + 1)}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item }: { item: ARPItem; key?: Key }) {
  // Determine a mock status based on some logic or just default to VIGENTE
  const status = "VIGENTE"; 
  
  return (
    <article className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col h-full group overflow-hidden">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider">
            {status}
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center bg-gray-50 dark:bg-slate-900 px-2 py-1 rounded-md border border-gray-100 dark:border-slate-700" title="Código CATMAT">
            <QrCode size={14} className="mr-1.5 text-gray-400" /> 
            {item.codigoItem}
          </span>
        </div>
        
        <h4 className="text-lg font-bold text-[#208494] dark:text-[#4fd1c5] mb-2 group-hover:underline cursor-pointer line-clamp-2 leading-tight">
          {item.descricaoItem || 'Item sem descrição'}
        </h4>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
          {item.descricaoDetalhada || 'Sem descrição detalhada disponível.'}
        </p>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">UASG Gerenciadora:</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 truncate max-w-[150px]" title={item.nomeUnidadeGerenciadora}>
              {item.codigoUnidadeGerenciadora} - {item.nomeUnidadeGerenciadora.substring(0, 10)}...
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Preço Unitário:</span>
            <span className="font-black text-gray-800 dark:text-gray-200">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorUnitario || 0)}
            </span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Qtd. Registrada:</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">
              {item.quantidadeRegistrada?.toLocaleString('pt-BR')} {item.unidadeMedida}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-t border-gray-100 dark:border-slate-700 flex gap-3">
        <button className="flex-1 bg-white dark:bg-slate-800 border-2 border-[#208494] text-[#208494] dark:text-[#4fd1c5] hover:bg-[#208494]/5 dark:hover:bg-slate-700 py-2 rounded-xl text-sm font-bold transition-colors">
          Ver Detalhes
        </button>
        <button className="flex-1 bg-[#208494] text-white hover:bg-[#1a6e7c] py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
          Solicitar Adesão
        </button>
      </div>
    </article>
  );
}
