import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  FolderOpen, 
  Wallet, 
  CalendarClock, 
  Handshake,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen?: boolean;
}

export function Sidebar({ currentView, onViewChange, isOpen = true }: SidebarProps) {
  return (
    <aside className={cn(
      "w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex-shrink-0 flex-col overflow-y-auto transition-all duration-300 z-10",
      isOpen ? "flex" : "hidden md:flex"
    )}>
      <div className="p-6 flex-1">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-4 tracking-wider">Navegação Principal</p>
        <div className="space-y-1 mb-8">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Painel Geral" 
            active={currentView === 'general'} 
            onClick={() => onViewChange('general')} 
          />
          <NavItem 
            icon={<Search size={18} />} 
            label="Busca de Itens e Atas" 
            active={currentView === 'search'} 
            onClick={() => onViewChange('search')} 
          />
          <NavItem 
            icon={<Briefcase size={18} />} 
            label="Painel do Fornecedor" 
            active={currentView === 'supplier'} 
            onClick={() => onViewChange('supplier')} 
          />
        </div>

        <div className="border-t border-gray-100 dark:border-slate-800 my-6"></div>
        
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-4 tracking-wider">Ferramentas IA</p>
        <div className="space-y-1 mb-8">
          <NavItem 
            icon={<Sparkles size={18} />} 
            label="Assistente IA" 
            active={currentView === 'ai'} 
            onClick={() => onViewChange('ai')} 
          />
        </div>

        <div className="border-t border-gray-100 dark:border-slate-800 my-6"></div>
        
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-4 tracking-wider">Gestão do Fornecedor</p>
        <div className="space-y-1">
          <NavItem icon={<FolderOpen size={18} />} label="Meus Contratos" />
          <NavItem icon={<Wallet size={18} />} label="Saldo de Empenho" />
          <NavItem icon={<CalendarClock size={18} />} label="Prazos e Vigências" />
          <NavItem icon={<Handshake size={18} />} label="Adesões (Carona)" />
        </div>
      </div>

      <div className="p-4 m-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#208494] flex items-center justify-center text-white font-bold shadow-inner">
            JS
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">João Silva</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Analista de Compras</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 p-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        active 
          ? "bg-[#208494]/10 text-[#208494] dark:text-[#4fd1c5]" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-gray-200"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
