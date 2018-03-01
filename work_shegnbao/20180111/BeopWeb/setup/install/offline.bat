@echo off
REM 升级pip及setuptools,部分包在低版本下无法安装
python -m pip install --upgrade pip
pip install -U setuptools

pip install --no-index -f ./packages -r req
"./packages/numpy-1.9.1.exe"
pause