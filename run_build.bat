@echo off
chcp 65001 >nul
set PATH=C:\rogram Files\nodejs;%PATH%
cd /d C:\temp
call npm run build > build_log.txt 2>&1
exit %ERRORLEVEL%