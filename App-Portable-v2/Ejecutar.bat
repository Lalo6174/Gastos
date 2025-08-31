@echo off
echo ========================================
echo   Gestión Financiera - Versión 2.0
echo   Aplicación de gestión de gastos
echo ========================================
echo.
echo Iniciando aplicación...
cd /d "%~dp0"
start "" "Gestión Financiera.exe"
echo.
echo Si la aplicación no se abre, verifica que:
echo - Windows Defender no esté bloqueando el archivo
echo - Tienes permisos de ejecución
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
