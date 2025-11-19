/// <reference types="chrome"/>

declare namespace chrome {
  namespace proxy {
    interface ProxyServer {
      host: string;
      port: number;
      scheme?: 'http' | 'https' | 'socks4' | 'socks5';
    }

    interface ProxyConfig {
      mode: 'direct' | 'auto_detect' | 'pac_script' | 'fixed_servers' | 'system';
      rules?: {
        singleProxy?: ProxyServer;
        proxyForHttp?: ProxyServer;
        proxyForHttps?: ProxyServer;
        proxyForFtp?: ProxyServer;
        fallbackProxy?: ProxyServer;
      };
      pacScript?: {
        data?: string;
        url?: string;
        mandatory?: boolean;
      };
    }

    interface ProxySettings {
      value: ProxyConfig;
      scope?: 'regular' | 'incognito_persistent' | 'incognito_session_only';
    }

    interface Settings {
      set(details: ProxySettings, callback?: () => void): void;
      clear(details: { scope?: 'regular' | 'incognito_persistent' | 'incognito_session_only' }, callback?: () => void): void;
      get(details: { incognito?: boolean }, callback: (details: { value: ProxyConfig; levelOfControl: string; incognitoSpecific?: boolean }) => void): void;
    }
    
    const settings: Settings;

    interface ErrorDetails {
      error: string;
      fatal: boolean;
      errorDetails: string;
      details: string;
    }

    namespace onProxyError {
      function addListener(callback: (details: ErrorDetails) => void): void;
    }
  }

  namespace runtime {
    interface LastError {
      message?: string;
    }

    const lastError: LastError | undefined;

    function sendNativeMessage(
      application: string,
      message: any,
      responseCallback?: (response: any) => void
    ): void;
  }

  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | { [key: string]: any } | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
      clear(callback?: () => void): void;
    }

    const local: StorageArea;
    const sync: StorageArea;
  }
}

