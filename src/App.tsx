import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GeneralDashboard } from './views/GeneralDashboard';
import { SearchItems } from './views/SearchItems';
import { SupplierDashboard } from './views/SupplierDashboard';
import { AIAssistant } from './views/AIAssistant';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState('general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'general': return <GeneralDashboard />;
      case 'search': return <SearchItems />;
      case 'supplier': return <SupplierDashboard />;
      case 'ai': return <AIAssistant />;
      default: return <GeneralDashboard />;
    }
  };

  const getHeaderProps = () => {
    switch (currentView) {
      case 'general': return { title: 'Painel Geral de ARPs', showSearch: true };
      case 'search': return { title: 'Portal de Compras', subtitle: 'Busca de Itens e Atas', showSearch: false };
      case 'supplier': return { title: 'gov.br', subtitle: 'Gestão de Atas', showSearch: true };
      case 'ai': return { title: 'Assistente IA', subtitle: 'Inteligência Artificial para Fornecedores', showSearch: false };
      default: return { title: 'Painel Geral de ARPs', showSearch: true };
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-200 font-sans">
      <Header 
        {...getHeaderProps()} 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          currentView={currentView} 
          onViewChange={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
        />
        
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-0 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 overflow-y-auto relative z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
