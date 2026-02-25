const BASE_URL = 'https://dadosabertos.compras.gov.br';

export interface ApiResponse<T> {
  resultado: T[];
  totalRegistros: number;
  totalPaginas: number;
  paginasRestantes: number;
}

export interface ARP {
  numeroAtaRegistroPreco: string;
  numeroControlePncpAta: string;
  codigoUnidadeGerenciadora: string;
  nomeUnidadeGerenciadora: string;
  dataVigenciaInicial: string;
  dataVigenciaFinal: string;
  codigoModalidadeCompra: string;
  nomeModalidadeCompra: string;
  linkAtaPncp: string;
  situacao: string;
}

export interface ARPItem {
  numeroItem: string;
  codigoItem: number;
  tipoItem: string;
  descricaoItem: string;
  descricaoDetalhada: string;
  valorUnitario: number;
  niFornecedor: string;
  nomeRazaoSocialFornecedor: string;
  quantidadeRegistrada: number;
  unidadeMedida: string;
  numeroAtaRegistroPreco: string;
  codigoUnidadeGerenciadora: string;
  nomeUnidadeGerenciadora: string;
}

export async function fetchARPs(params: Record<string, string | number>): Promise<ApiResponse<ARP>> {
  const url = new URL(`${BASE_URL}/modulo-arp/1_consultarARP`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    if (res.status === 404) return { resultado: [], totalRegistros: 0, totalPaginas: 0, paginasRestantes: 0 };
    throw new Error(`Failed to fetch ARPs: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchARPItems(params: Record<string, string | number>): Promise<ApiResponse<ARPItem>> {
  const url = new URL(`${BASE_URL}/modulo-arp/2_consultarARPItem`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    if (res.status === 404) return { resultado: [], totalRegistros: 0, totalPaginas: 0, paginasRestantes: 0 };
    throw new Error(`Failed to fetch ARP Items: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchItemAdhesions(numeroAta: string, unidadeGerenciadora: string, numeroItem: string) {
  const url = new URL(`${BASE_URL}/modulo-arp/5_consultarAdesoesItem`);
  url.searchParams.append('numeroAta', numeroAta);
  url.searchParams.append('unidadeGerenciadora', unidadeGerenciadora);
  url.searchParams.append('numeroItem', numeroItem);

  const res = await fetch(url.toString());
  if (!res.ok) {
    if (res.status === 404) return { resultado: [], totalRegistros: 0, totalPaginas: 0, paginasRestantes: 0 };
    throw new Error(`Failed to fetch Adhesions: ${res.statusText}`);
  }
  return res.json();
}
