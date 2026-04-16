@echo off
echo.
echo ╔═══════════════════════════════════════╗
echo ║     NORSKLAB – STARTAR SERVER         ║
echo ╚═══════════════════════════════════════╝
echo.

:: Opnar port 3000 i Windows-brannmuren (treng administratorrettar)
echo Opnar brannmur for port 3000...
netsh advfirewall firewall delete rule name="Norsklab API" >nul 2>&1
netsh advfirewall firewall add rule name="Norsklab API" dir=in action=allow protocol=TCP localport=3000 >nul 2>&1
echo Brannmur OK.
echo.

:: Gå til rett mappe og start serveren
cd /d "%~dp0"
echo Startar server...
echo.
npm start

pause
