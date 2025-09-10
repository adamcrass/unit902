#!/usr/bin/env bash

# ============================================================
# Vite + Netlify Functions Development Server
# ============================================================

# Set NODE_ENV to development
export NODE_ENV=development

# Clear the terminal for a clean startup
clear

# Get network information (cross-platform)
get_local_ip() {
  # macOS
  if command -v ipconfig &> /dev/null; then
    ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null
  # Linux
  elif command -v hostname &> /dev/null; then
    hostname -I | awk '{print $1}' 2>/dev/null
  # Fallback using ip command
  elif command -v ip &> /dev/null; then
    ip route get 8.8.8.8 | awk '{print $7}' | head -1 2>/dev/null
  # Final fallback
  else
    echo "192.168.1.100"
  fi
}

LOCAL_IP=$(get_local_ip)
LOCALHOST="127.0.0.1"
PORT=1027
FUNCTIONS_PORT=9999

# Display header with enhanced styling
echo ""
echo "🚀 VITE + NETLIFY DEV SERVER"
echo "══════════════════════════════════════════════════════"
echo ""

# Function to check if port is available
check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    return 1
  else
    return 0
  fi
}

# Check if ports are available
if ! check_port $PORT; then
  echo "❌ Port $PORT is already in use. Please free the port or change PORT variable."
  exit 1
fi

if ! check_port $FUNCTIONS_PORT; then
  echo "❌ Port $FUNCTIONS_PORT is already in use. Please free the port or change FUNCTIONS_PORT variable."
  exit 1
fi

# Start Netlify Functions in background
echo "⚡ Starting Netlify Functions on port $FUNCTIONS_PORT..."
netlify functions:serve --port $FUNCTIONS_PORT > /dev/null 2>&1 &
FUNCTIONS_PID=$!

# Give functions more time to start
sleep 6

# Start Vite in background
echo "⚡ Starting Vite development server on port $PORT..."
vite --host 0.0.0.0 --port $PORT > /dev/null 2>&1 &
VITE_PID=$!

# Wait for servers to initialize with better feedback
echo "⏳ Initializing development environment..."
echo "   • Waiting for Vite server..."

# Check if servers are running with timeout
TIMEOUT=30
for i in $(seq 1 $TIMEOUT); do
  VITE_READY=false
  FUNCTIONS_READY=false
  
  # Check Vite
  if curl -s http://$LOCALHOST:$PORT > /dev/null 2>&1; then
    VITE_READY=true
  fi
  
  # Check Functions
  if curl -s http://$LOCALHOST:$FUNCTIONS_PORT > /dev/null 2>&1; then
    FUNCTIONS_READY=true
  fi
  
  if $VITE_READY && $FUNCTIONS_READY; then
    break
  fi
  
  # Show progress
  printf "."
  sleep 0.5
done

echo ""

# Check if both servers started successfully
if ! curl -s http://$LOCALHOST:$PORT > /dev/null 2>&1; then
  echo "❌ Failed to start Vite server"
  kill $FUNCTIONS_PID 2>/dev/null
  exit 1
fi

if ! curl -s http://$LOCALHOST:$FUNCTIONS_PORT > /dev/null 2>&1; then
  echo "❌ Failed to start Netlify Functions"
  kill $VITE_PID 2>/dev/null
  exit 1
fi

echo ""
echo "✅ DEVELOPMENT SERVERS READY"
echo "══════════════════════════════════════════════════════"
echo ""
echo "🖥️  LOCAL ACCESS:"
echo "   → App:           http://$LOCALHOST:$PORT"
echo "   → Functions:     http://$LOCALHOST:$FUNCTIONS_PORT/.netlify/functions/"
echo "   → Dashboard:     http://$LOCALHOST:$FUNCTIONS_PORT/.netlify/functions/dashboard"
echo ""
echo "🌐 NETWORK ACCESS:"
echo "   → App:       http://$LOCAL_IP:$PORT"
echo "   → Share:     http://$LOCAL_IP:$PORT (accessible from other devices)"
echo ""
echo "══════════════════════════════════════════════════════"
echo "📱 MOBILE ACCESS"
echo "   Scan this QR code with your phone to open the app:"
echo ""

# Generate QR code for the network URL with error handling
if command -v node &> /dev/null && node -e "require('qrcode-terminal')" &> /dev/null; then
  node -e "
    try {
      require('qrcode-terminal').generate('http://$LOCAL_IP:$PORT', { small: true });
    } catch (e) {
      console.log('   QR code generation failed. Install qrcode-terminal: npm install qrcode-terminal');
    }
  "
else
  echo "   📱 Manual URL: http://$LOCAL_IP:$PORT"
  echo ""
  echo "   💡 qrcode-terminal is not installed."
  echo -n "   Would you like to install it now? (y/n): "
  read -r response
  
  if [[ "$response" =~ ^[Yy]([Ee][Ss])?$ ]]; then
    echo "   📦 Installing qrcode-terminal with yarn..."
    if command -v yarn &> /dev/null; then
      yarn add -D qrcode-terminal
    else
      echo "   ❌ Yarn not found. Please install yarn or install qrcode-terminal manually with: yarn add -D qrcode-terminal"
    fi
    
    # Try to generate QR code after installation
    if node -e "require('qrcode-terminal')" &> /dev/null; then
      echo "   ✅ Installation successful! Generating QR code:"
      echo ""
      node -e "require('qrcode-terminal').generate('http://$LOCAL_IP:$PORT', { small: true });"
    else
      echo "   ❌ Installation failed. You can install manually with: yarn add -D qrcode-terminal"
    fi
  else
    echo "   Skipping installation. You can install later with: yarn add -D qrcode-terminal"
  fi
fi

echo ""
echo "Check logs:      Use 'yarn dev:logs' for detailed output"
echo ""
echo "🔄 Servers running... Press Ctrl+C to stop"
echo ""

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down development servers..."
  
  # Kill processes
  if [ ! -z "$VITE_PID" ]; then
    kill $VITE_PID 2>/dev/null
    echo "   ✓ Vite server stopped"
  fi
  
  if [ ! -z "$FUNCTIONS_PID" ]; then
    kill $FUNCTIONS_PID 2>/dev/null
    echo "   ✓ Netlify Functions stopped"
  fi
  
  # Clean up any remaining processes on our ports
  lsof -ti:$PORT | xargs kill -9 2>/dev/null
  lsof -ti:$FUNCTIONS_PORT | xargs kill -9 2>/dev/null
  
  echo "🏁 Development environment shut down cleanly"
  exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running and monitor processes
while true; do
  # Check if processes are still running
  if ! kill -0 $VITE_PID 2>/dev/null; then
    echo "❌ Vite server stopped unexpectedly"
    cleanup
  fi
  
  if ! kill -0 $FUNCTIONS_PID 2>/dev/null; then
    echo "❌ Netlify Functions stopped unexpectedly"
    cleanup
  fi
  
  sleep 2
done