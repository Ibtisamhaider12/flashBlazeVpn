export interface Country {
  code: string;
  name: string;
  flag: string;
  proxyServers: ProxyServer[];
}

export interface ProxyServer {
  host: string;
  port: number;
  type: 'http' | 'https' | 'socks4' | 'socks5';
  username?: string;
  password?: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export interface ConnectionInfo {
  status: ConnectionStatus;
  country?: string;
  proxy?: ProxyServer;
}

