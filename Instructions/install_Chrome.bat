@echo off

start chrome

:checkExec

tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL

IF "%ERRORLEVEL%"=="0" (
	echo Running
) ELSE (
	echo Not Running
	GOTO checkExec 
)

timeout /T 3 /nobreak

start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch1.user.js
start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch2.user.js
start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch3.user.js
start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch4.user.js
start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch5.user.js
start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch6.user.js
start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch7.user.js
start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch8.user.js
start chrome https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch9.user.js
exit;