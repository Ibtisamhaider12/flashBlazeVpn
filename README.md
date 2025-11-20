# FlashBlaze VPN - Chrome Extension

A full-featured Chrome extension VPN with support for all countries, built with React frontend and C/C++ native messaging host.

## Features

- 🌍 Support for 100+ countries
- ⚡ Fast proxy connection switching
- 🎨 Modern React-based UI
- 🔧 C/C++ native messaging host for advanced proxy management
- 🔒 Secure proxy connections
- 📱 Responsive design

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: C/C++ Native Messaging Host
- **Proxy Protocol**: HTTP, HTTPS, SOCKS4, SOCKS5
- **Storage**: Chrome Storage API

## Prerequisites

- Node.js 18+ and npm
- Chrome browser
- C++ compiler (g++ or clang++)
- Make

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This will create a `dist` folder with the compiled extension.

### 3. Build Native Host

```bash
cd native
make
```

### 4. Install Native Host

```bash
chmod +x scripts/install_native_host.sh
./scripts/install_native_host.sh
```

### 5. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder
5. Note your extension ID (displayed on the extension card)

### 6. Update Extension ID in Native Host

After loading the extension, update the native host manifest with your extension ID:

```bash
./scripts/update_extension_id.sh  cjinfmlfnkckaejjbmphanfgdgggooji
```

## Development

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Rebuild Native Host

```bash
cd native
make clean
make
```

## Project Structure

```
flashBlazeVpn/
├── src/
│   ├── components/          # React components
│   ├── data/               # Country/proxy data
│   ├── styles/             # CSS styles
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── popup.tsx           # Extension popup entry
│   ├── popup.html          # Popup HTML
│   └── background.js       # Service worker
├── native/
│   ├── vpn_host.cpp        # C++ native messaging host
│   ├── Makefile            # Build configuration
│   └── com.flashblaze.vpn.json  # Native host manifest
├── scripts/
│   ├── install_native_host.sh   # Installation script
│   └── update_extension_id.sh   # Extension ID updater
├── manifest.json           # Chrome extension manifest
├── package.json
├── vite.config.js
└── tsconfig.json
```

## Configuration

### Adding Proxy Servers

Edit `src/data/countries.ts` to add or update proxy servers for countries:

```typescript
{
  code: 'us',
  name: 'United States',
  flag: '🇺🇸',
  proxyServers: [
    { host: 'proxy.example.com', port: 8080, type: 'http' },
    { host: 'socks.example.com', port: 1080, type: 'socks5' }
  ]
}
```

### Native Host Configuration

The native host manifest is located at:
- **macOS**: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.flashblaze.vpn.json`
- **Linux**: `~/.config/google-chrome/NativeMessagingHosts/com.flashblaze.vpn.json`

## Usage

1. Click the extension icon in Chrome toolbar
2. Search for a country or browse the list
3. Click on a country to connect
4. Click "Disconnect" to stop the VPN connection

## Proxy Server Setup

**Important**: The proxy servers in `src/data/countries.ts` are placeholders. You need to:

1. Replace `proxy.example.com` with actual proxy server addresses
2. Update ports and types (http, https, socks4, socks5) as needed
3. Add authentication credentials if required

### Free Proxy Sources

You can use free proxy APIs or lists:
- Free Proxy List APIs
- Public proxy aggregators
- Your own proxy infrastructure

## Troubleshooting

### Native Host Not Working

1. Verify the native host is installed:
   ```bash
   ls ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/
   ```

2. Check the extension ID matches in the manifest

3. Verify the binary has execute permissions:
   ```bash
   chmod +x ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/vpn_host
   ```

### Extension Not Loading

1. Check for errors in `chrome://extensions/`
2. Verify all files are in the `dist` folder
3. Check browser console for errors

### Proxy Connection Fails

1. Verify proxy server addresses are correct
2. Check if proxy servers require authentication
3. Test proxy servers independently
4. Check Chrome's proxy settings

## Security Notes

- This extension uses Chrome's proxy API, which routes traffic through specified proxies
- Ensure proxy servers are trusted and secure
- Consider implementing authentication for proxy servers
- Review Chrome extension permissions before installation

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue on the repository.

