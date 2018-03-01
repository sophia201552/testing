@echo off
cd "%~sdp0"
call npm install
node build.js
pause