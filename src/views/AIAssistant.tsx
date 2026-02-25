import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Image as ImageIcon, Video, Search, Upload, Loader2, Play } from 'lucide-react';
import { askMarketIntelligence, editImage, generateVideo } from '../services/gemini';
import Markdown from 'react-markdown';

export function AIAssistant() {
  const [activeTab, setActiveTab] = useState<'market' | 'image' | 'video'>('market');

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
          <Sparkles className="mr-3 text-[#208494]" size={32} />
          Assistente IA
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Utilize o poder da Inteligência Artificial para analisar o mercado, editar imagens de produtos e gerar vídeos promocionais para suas propostas.
        </p>
      </div>

      <div className="flex space-x-2 mb-8 bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 w-fit">
        <TabButton 
          active={activeTab === 'market'} 
          onClick={() => setActiveTab('market')} 
          icon={<Search size={18} />} 
          label="Inteligência de Mercado" 
        />
        <TabButton 
          active={activeTab === 'image'} 
          onClick={() => setActiveTab('image')} 
          icon={<ImageIcon size={18} />} 
          label="Editor de Imagens" 
        />
        <TabButton 
          active={activeTab === 'video'} 
          onClick={() => setActiveTab('video')} 
          icon={<Video size={18} />} 
          label="Gerador de Vídeos" 
        />
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'market' && <MarketIntelligence />}
        {activeTab === 'image' && <ImageEditor />}
        {activeTab === 'video' && <VideoGenerator />}
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
        active 
          ? 'bg-[#208494] text-white shadow-sm' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

function MarketIntelligence() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, chunks: any[] } | null>(null);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await askMarketIntelligence(prompt);
      setResult(res);
    } catch (error) {
      console.error(error);
      alert("Erro ao consultar a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Análise de Mercado com Google Search</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Faça perguntas sobre tendências de mercado, preços de insumos ou notícias recentes que podem impactar suas propostas em licitações.
      </p>
      
      <div className="flex gap-3 mb-8">
        <input 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          className="flex-1 pl-4 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none" 
          placeholder="Ex: Qual a tendência de preços para notebooks corporativos no Brasil em 2024?" 
          type="text"
        />
        <button 
          onClick={handleAsk}
          disabled={loading || !prompt.trim()}
          className="bg-[#208494] hover:bg-[#1a6e7c] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          <span className="ml-2 hidden sm:inline">{loading ? 'Pesquisando...' : 'Pesquisar'}</span>
        </button>
      </div>

      {result && (
        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed mb-6">
            <Markdown>{result.text}</Markdown>
          </div>
          
          {result.chunks && result.chunks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Fontes Consultadas:</h4>
              <ul className="space-y-2">
                {result.chunks.map((chunk, idx) => {
                  if (chunk.web?.uri) {
                    return (
                      <li key={idx} className="text-xs">
                        <a href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-[#208494] hover:underline flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#208494] mr-2"></span>
                          {chunk.web.title || chunk.web.uri}
                        </a>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ImageEditor() {
  const [image, setImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      setImage({ data: base64String, mimeType: file.type });
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = async () => {
    if (!image || !prompt.trim()) return;
    setLoading(true);
    try {
      const res = await editImage(image.data, image.mimeType, prompt);
      setResultImage(res);
    } catch (error) {
      console.error(error);
      alert("Erro ao editar a imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Edição de Imagens de Produtos</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Faça upload de uma foto do seu produto e peça para a IA remover o fundo, adicionar um cenário profissional ou aplicar filtros.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors h-64 relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <img src={`data:${image.mimeType};base64,${image.data}`} alt="Original" className="absolute inset-0 w-full h-full object-contain p-2" />
            ) : (
              <>
                <Upload size={40} className="text-gray-400 mb-4" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Clique para fazer upload</p>
                <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center h-64 relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center text-[#208494]">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="text-sm font-bold animate-pulse">Processando imagem...</p>
              </div>
            ) : resultImage ? (
              <img src={resultImage} alt="Editada" className="absolute inset-0 w-full h-full object-contain p-2" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <ImageIcon size={40} className="mb-4 opacity-50" />
                <p className="text-sm font-medium">A imagem editada aparecerá aqui</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <input 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
          disabled={!image}
          className="flex-1 pl-4 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none disabled:opacity-50" 
          placeholder="Ex: Remova o fundo e adicione um fundo branco puro" 
          type="text"
        />
        <button 
          onClick={handleEdit}
          disabled={loading || !image || !prompt.trim()}
          className="bg-[#208494] hover:bg-[#1a6e7c] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          <span className="ml-2 hidden sm:inline">Gerar</span>
        </button>
      </div>
    </div>
  );
}

function VideoGenerator() {
  const [image, setImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      setImage({ data: base64String, mimeType: file.type });
      setResultVideo(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!image || !prompt.trim()) return;
    setLoading(true);
    try {
      const res = await generateVideo(image.data, image.mimeType, prompt);
      setResultVideo(res);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar o vídeo. A geração pode demorar alguns minutos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Gerador de Vídeos Promocionais (Veo)</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Crie vídeos incríveis a partir de uma foto do seu produto para incluir em suas propostas ou catálogos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors h-64 relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <img src={`data:${image.mimeType};base64,${image.data}`} alt="Original" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            ) : (
              <>
                <Upload size={40} className="text-gray-400 mb-4" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Upload da imagem inicial</p>
                <p className="text-xs text-gray-500">PNG, JPG (16:9 recomendado)</p>
              </>
            )}
            {image && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 text-white px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm">
                  Imagem Selecionada
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center h-64 relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center text-[#208494] p-6 text-center">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="text-sm font-bold mb-2">Gerando vídeo com Veo...</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Isso pode levar alguns minutos. Por favor, aguarde.</p>
              </div>
            ) : resultVideo ? (
              <video src={resultVideo} controls autoPlay loop className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <Play size={40} className="mb-4 opacity-50" />
                <p className="text-sm font-medium">O vídeo gerado aparecerá aqui</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <input 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          disabled={!image}
          className="flex-1 pl-4 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#208494] outline-none disabled:opacity-50" 
          placeholder="Ex: Um vídeo cinematográfico do produto girando lentamente em um estúdio com iluminação dramática" 
          type="text"
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !image || !prompt.trim()}
          className="bg-[#208494] hover:bg-[#1a6e7c] disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Video size={20} />}
          <span className="ml-2 hidden sm:inline">Gerar Vídeo</span>
        </button>
      </div>
    </div>
  );
}
