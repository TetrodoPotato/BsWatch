@echo off

CD C:\Program Files\Mozilla Firefox\
start firefox.exe 

:checkExec

tasklist /FI "IMAGENAME eq firefox.exe" 2>NUL | find /I /N "firefox.exe">NUL

IF "%ERRORLEVEL%"=="0" (
	echo Running
) ELSE (
	echo Not Running
	GOTO checkExec 
)

timeout /T 3 /nobreak

start firefox.exe https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch1.user.js
start firefox.exe https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch2.user.js
start firefox.exe https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch3.user.js
start firefox.exe https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch5.user.js
start firefox.exe https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch6.user.js
start firefox.exe https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch7.user.js
start firefox.exe https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch8.user.js
start firefox.exe https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch9.user.js
exit;