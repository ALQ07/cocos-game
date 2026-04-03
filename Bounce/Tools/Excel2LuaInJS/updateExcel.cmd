@echo off
@echo %1
rd /s /q %~dp0excel >nul 2>nul
call node %~dp0update-doc.js %1
rd /s /q %~dp0excel >nul 2>nul
