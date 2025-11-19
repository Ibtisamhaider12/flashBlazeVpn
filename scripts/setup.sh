#!/bin/bash

# Complete setup script for FlashBlaze VPN

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Setting up FlashBlaze VPN..."
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command -v g++ &> /dev/null && ! command -v clang++ &> /dev/null; then
    echo "⚠️  C++ compiler not found. Native host will not be built."
    echo "   Install g++ or clang++ to build the native host."
    SKIP_NATIVE=true
else
    SKIP_NATIVE=false
fi

echo "✅ Prerequisites check complete"
echo ""

# Install npm dependencies
echo "📦 Installing npm dependencies..."
cd "$PROJECT_DIR"
npm install
echo "✅ npm dependencies installed"
echo ""

# Build the extension
echo "🔨 Building extension..."
npm run build
echo "✅ Extension built"
echo ""

# Build native host if compiler is available
if [ "$SKIP_NATIVE" = false ]; then
    echo "🔨 Building native host..."
    cd "$PROJECT_DIR/native"
    make clean
    make
    echo "✅ Native host built"
    echo ""
    
    # Install native host
    echo "📥 Installing native host..."
    cd "$PROJECT_DIR"
    chmod +x scripts/install_native_host.sh
    ./scripts/install_native_host.sh
    echo "✅ Native host installed"
    echo ""
else
    echo "⏭️  Skipping native host build (no C++ compiler found)"
    echo ""
fi

# Create icons if they don't exist
if [ ! -f "$PROJECT_DIR/public/icons/icon16.png" ]; then
    echo "🎨 Creating placeholder icons..."
    chmod +x "$PROJECT_DIR/scripts/create_icons.sh"
    "$PROJECT_DIR/scripts/create_icons.sh"
    echo "⚠️  Please replace placeholder icons with actual PNG files"
    echo ""
fi

echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Load the extension in Chrome:"
echo "      - Go to chrome://extensions/"
echo "      - Enable 'Developer mode'"
echo "      - Click 'Load unpacked'"
echo "      - Select the 'dist' folder"
echo ""
echo "   2. Get your extension ID from chrome://extensions/"
echo ""
echo "   3. Update the native host with your extension ID:"
echo "      ./scripts/update_extension_id.sh YOUR_EXTENSION_ID"
echo ""
echo "   4. Replace proxy.example.com addresses in src/data/countries.ts"
echo "      with actual proxy server addresses"
echo ""
echo "🎉 Happy browsing!"

