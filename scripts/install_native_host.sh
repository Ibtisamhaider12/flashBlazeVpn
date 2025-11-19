#!/bin/bash

# Installation script for FlashBlaze VPN Native Messaging Host

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
NATIVE_DIR="$PROJECT_DIR/native"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CHROME_DIR="$HOME/Library/Application Support/Google/Chrome"
    NATIVE_HOSTS_DIR="$CHROME_DIR/NativeMessagingHosts"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CHROME_DIR="$HOME/.config/google-chrome"
    NATIVE_HOSTS_DIR="$CHROME_DIR/NativeMessagingHosts"
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

echo "Installing FlashBlaze VPN Native Messaging Host..."

# Build the native host
echo "Building native host..."
cd "$NATIVE_DIR"
make clean
make

# Create NativeMessagingHosts directory if it doesn't exist
mkdir -p "$NATIVE_HOSTS_DIR"

# Copy the binary
echo "Copying binary..."
cp "$NATIVE_DIR/vpn_host" "$NATIVE_HOSTS_DIR/vpn_host"
chmod +x "$NATIVE_HOSTS_DIR/vpn_host"

# Get extension ID (will be updated after extension is loaded)
EXTENSION_ID="YOUR_EXTENSION_ID_HERE"

# Update the manifest with the correct path
cat > "$NATIVE_HOSTS_DIR/com.flashblaze.vpn.json" <<EOF
{
  "name": "com.flashblaze.vpn",
  "description": "FlashBlaze VPN Native Messaging Host",
  "path": "$NATIVE_HOSTS_DIR/vpn_host",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://$EXTENSION_ID/"
  ]
}
EOF

echo "Native host installed successfully!"
echo ""
echo "NOTE: After loading the extension in Chrome, update the extension ID in:"
echo "$NATIVE_HOSTS_DIR/com.flashblaze.vpn.json"
echo ""
echo "You can find your extension ID in chrome://extensions/"

