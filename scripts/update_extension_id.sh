#!/bin/bash

# Script to update extension ID in native host manifest

if [ -z "$1" ]; then
    echo "Usage: $0 <extension-id>"
    echo "Example: $0 abcdefghijklmnopqrstuvwxyz123456"
    exit 1
fi

EXTENSION_ID="$1"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    NATIVE_HOSTS_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    NATIVE_HOSTS_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

MANIFEST_FILE="$NATIVE_HOSTS_DIR/com.flashblaze.vpn.json"

if [ ! -f "$MANIFEST_FILE" ]; then
    echo "Error: Native host manifest not found at $MANIFEST_FILE"
    echo "Please run install_native_host.sh first"
    exit 1
fi

# Update the manifest
cat > "$MANIFEST_FILE" <<EOF
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

echo "Extension ID updated to: $EXTENSION_ID"
echo "Manifest updated at: $MANIFEST_FILE"

