#!/bin/bash
cd "$(dirname "$0")"
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
echo "=============================================="
echo " 本机访问:  http://localhost:8900/index.html"
echo " 手机访问:  http://${IP:-未获取到IP}:8900/index.html"
echo " 按 Ctrl+C 停止服务器"
echo "=============================================="
sleep 1
open "http://localhost:8900/index.html" 2>/dev/null
python3 -m http.server 8900 --bind 0.0.0.0
