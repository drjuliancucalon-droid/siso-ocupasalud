@echo off
echo === Eliminando lock files ===
del /F /Q "C:\Users\JQK3\Desktop\refactorizacion total\.git\index.lock" 2>nul
del /F /Q "C:\Users\JQK3\Desktop\refactorizacion total\.git\HEAD.lock" 2>nul
echo Lock files eliminados.

echo === Commiteando DEPLOY.md ===
cd /D "C:\Users\JQK3\Desktop\refactorizacion total"
git add DEPLOY.md
git commit -m "docs: guia de GitHub y despliegue"

echo === Configurando remote y haciendo push ===
git remote remove origin 2>nul
git remote add origin https://github.com/drjuliancucalon-droide/siso-ocupasalud.git
git push -u origin master

echo === LISTO ===
pause
