# Quick Start Guide

## Installation (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Setup Script
```bash
npm run setup
```

Or manually:
```bash
# Build extension
npm run build

# Build native host
cd native && make && cd ..

# Install native host
./scripts/install_native_host.sh
```

### Step 3: Load Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `dist` folder from this project
6. **Copy your Extension ID** (shown on the extension card)

### Step 4: Update Extension ID

```bash
./scripts/update_extension_id.sh YOUR_EXTENSION_ID_HERE
```

### Step 5: Configure Proxy Servers

Edit `src/data/countries.ts` and replace `proxy.example.com` with actual proxy server addresses:

```typescript
{
  code: 'us',
  name: 'United States',
  flag: '🇺🇸',
  proxyServers: [
    { host: 'your-proxy-server.com', port: 8080, type: 'http' }
  ]
}
```

Then rebuild:
```bash
npm run build
```

## Usage

1. Click the extension icon in Chrome toolbar
2. Search or browse countries
3. Click a country to connect
4. Click "Disconnect" to stop

## Development

```bash
# Start dev server
npm run dev

# Rebuild extension
npm run build

# Rebuild native host
cd native && make clean && make
```

## Troubleshooting

### Extension won't load
- Check `dist` folder exists and has `manifest.json`
- Check browser console for errors
- Verify all files are present

### Native host not working
- Verify installation: `ls ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/`
- Check extension ID matches in manifest
- Verify binary permissions: `chmod +x vpn_host`

### Proxy connection fails
- Verify proxy server addresses are correct
- Test proxy servers independently
- Check if authentication is required

## Next Steps

1. Replace placeholder proxy servers with real ones
2. Add authentication if needed
3. Customize UI colors/styles
4. Add more countries if needed

