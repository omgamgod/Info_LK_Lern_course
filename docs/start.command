#!/bin/bash
# macOS: double-click to start the course "Rekursion & Listen".
cd "$(dirname "$0")" || exit 1
if [ ! -f start.py ]; then
  echo "start.py not found. Unzip the whole ZIP file first and start from the unzipped folder."
elif command -v python3 >/dev/null 2>&1; then
  python3 start.py
else
  echo "Python 3 was not found."
  echo "Install it from https://www.python.org/downloads/ and double-click start.command again."
fi
echo
read -r -p "Press Enter to close this window."
