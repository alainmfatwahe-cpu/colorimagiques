@echo off
chcp 65001 >nul
echo === Build ColoriMagiques Frontend ===
echo.
echo Time: %TIME%
cd /d C:\temp
set PATH=C:\rogram Files\nodejs;%PATH%
echo PATH=%PATH%
echo.
echo Running: npm run build
call npm run build > build_log.txt 2>&1
echo EXITCODE=%ERRORLEVEL%
echo EXITCODE=%ERRORLEVEL% >> build_log.txt
echo === DONE ===