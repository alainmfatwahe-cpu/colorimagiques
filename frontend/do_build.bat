@echo off
chcp 65001 >nul
set PATH=%ProgramFiles%\nodejs;%PATH%
echo === BUILD STARTED === >> build_output.txt
echo Time: %TIME% >> build_output.txt
call npm run build >> build_output.txt 2>&1
echo EXITCODE: %ERRORLEVEL% >> build_output.txt
echo === BUILD ENDED === >> build_output.txt