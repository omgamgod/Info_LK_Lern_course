@echo off
rem Windows: double-click to start the course "Rekursion & Listen".
cd /d "%~dp0"
if not exist "start.py" (
  echo start.py not found. Unzip the whole ZIP file first and start from the unzipped folder.
  echo.
  pause
  exit /b 1
)
set "PYCMD="
py -3 --version >nul 2>&1
if not errorlevel 1 set "PYCMD=py -3"
if not defined PYCMD (
  python --version >nul 2>&1
  if not errorlevel 1 set "PYCMD=python"
)
if not defined PYCMD (
  echo Python 3 was not found.
  echo Install it from https://www.python.org/downloads/
  echo and tick "Add python.exe to PATH" in the installer. Then double-click start.bat again.
  echo.
  pause
  exit /b 1
)
%PYCMD% start.py
echo.
pause
