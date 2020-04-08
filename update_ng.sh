#!/usr/bin/env bash
echo "remove node_modules and dist folders..."
rm -rf node_modules dist # use rmdir /S/Q node_modules dist in Windows Command Prompt; use rm -r -fo node_modules,dist in Windows PowerShell
echo "install new version of angular/cli..."
npm install --save-dev @angular/cli@latest
echo "install remaining dependencies..."
npm install
echo "all installed!"
echo "call ng update"
ng update
