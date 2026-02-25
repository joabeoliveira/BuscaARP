import { Contrast, Search, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, showSearch = true, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm z-20 sticky top-0">
      <div className="bg-gray-100 dark:bg-slate-950 py-1 px-4 md:px-6 flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800">
        <div className="hidden md:flex space-x-4">
          <a className="hover:underline font-medium" href="#">Órgãos do Governo</a>
          <a className="hover:underline font-medium" href="#">Acesso à Informação</a>
          <a className="hover:underline font-medium" href="#">Legislação</a>
          <a className="hover:underline font-medium" href="#">Acessibilidade</a>
        </div>
        <div className="flex items-center space-x-3 ml-auto md:ml-0">
          <button 
            className="flex items-center space-x-1 hover:text-[#208494] transition-colors"
            onClick={() => document.documentElement.classList.toggle('dark')}
          >
            <Contrast size={14} />
            <span className="hidden sm:inline">Alto Contraste</span>
          </button>
          <a className="font-bold text-[#208494] bg-[#208494]/10 px-3 py-1 rounded-full hover:bg-[#208494]/20 transition-colors" href="#">
            Entrar com gov.br
          </a>
        </div>
      </div>
      
      <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          {onMenuClick && (
            <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-[#208494]">
              <Menu size={24} />
            </button>
          )}
          <div className="w-20 md:w-24 shrink-0">
            <svg className="w-full h-auto" fill="none" viewBox="0 0 130 50" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-[#0C326F] dark:fill-white" d="M16.9 33.3c-2.4 0-4.3-.8-5.7-2.3-1.4-1.5-2.1-3.6-2.1-6.2 0-2.6.7-4.7 2.1-6.2 1.4-1.5 3.3-2.3 5.7-2.3 1.3 0 2.4.2 3.4.7.9.5 1.7 1.1 2.3 1.9l-2.6 2.6c-1.6-1.7-3-2.6-4.2-2.6-1.1 0-2 .4-2.7 1.2-.7.8-1 1.9-1 3.4 0 1.5.3 2.6 1 3.4.7.8 1.6 1.2 2.7 1.2 1.3 0 2.7-1 4.3-2.9l2.5 2.5c-.7.9-1.5 1.7-2.4 2.3-1 .9-2.2 1.3-3.3 1.3zM34.4 33.3c-2.4 0-4.4-.8-5.8-2.3-1.5-1.5-2.2-3.6-2.2-6.2s.7-4.7 2.2-6.2c1.4-1.5 3.4-2.3 5.8-2.3s4.4.8 5.8 2.3c1.5 1.5 2.2 3.6 2.2 6.2s-.7 4.7-2.2 6.2c-1.4 1.5-3.4 2.3-5.8 2.3zm0-3.3c1.2 0 2.2-.5 2.9-1.4.7-.9 1.1-2.1 1.1-3.6s-.4-2.7-1.1-3.6c-.7-.9-1.7-1.4-2.9-1.4s-2.2.5-2.9 1.4c-.7.9-1.1 2.1-1.1 3.6s.4 2.7 1.1 3.6c.7.9 1.7 1.4 2.9 1.4zM47.7 32.9L43.1 19h3.7l2.8 9.6 2.8-9.6h3.6l-4.6 13.9h-3.7zM60.6 30.6c0 1 .8 1.8 1.8 1.8 1 0 1.8-.8 1.8-1.8 0-1-.8-1.8-1.8-1.8-1 .1-1.8.9-1.8 1.8zM76.9 32.9h-3.3v-1.7c-.8 1.3-1.9 2-3.4 2-1.3 0-2.3-.4-3-1.2-.7-.8-1-1.8-1-3.1 0-1.2.3-2.2 1-3 .6-.8 1.6-1.2 2.9-1.2 1.1 0 2 .3 2.7.9l.3-1.6V18h3.8v14.9zm-3.8-3.9v-2.3c-.5-.7-1.1-1-1.8-1-.7 0-1.2.2-1.6.6-.4.4-.6 1-.6 1.7 0 .8.2 1.4.6 1.8.4.4.9.6 1.5.6.8 0 1.4-.5 1.9-1.4zM83.4 32.9h-3.7V19h3.6v2.2c.4-.8.9-1.4 1.4-1.8.5-.4 1.1-.6 1.8-.6.3 0 .5 0 .8.1v3.3c-.3-.1-.7-.2-1.1-.2-.9 0-1.6.3-2.1 1s-.7 1.6-.7 2.7v7.2z" />
            </svg>
          </div>
          <div className="hidden md:block h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{subtitle}</p>}
          </div>
        </div>
        
        {showSearch && (
          <div className="w-full md:w-1/3 relative">
            <input 
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#208494] focus:border-transparent text-sm shadow-sm dark:text-white transition-all" 
              placeholder="O que você procura?" 
              type="text"
            />
            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#208494] transition-colors">
              <Search size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
