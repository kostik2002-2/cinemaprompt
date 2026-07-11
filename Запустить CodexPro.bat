@echo off
set CODEXPRO_BASH_MODE=full
chcp 65001 >nul
cd /d "%~dp0"
codexpro start --tunnel none --tool-mode full --token 829cb0371ef7301d5099daea4715e7b254aa53bb449b7685
pause