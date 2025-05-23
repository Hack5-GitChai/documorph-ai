## Disk storage checking 
df -h
du -sh * .[^.]* | sort -hr | head -n 20

## Codespace-disk cleaning cmds
rm -rf venv
npm cache clean --force
sudo apt-get clean && sudo rm -rf /var/lib/apt/lists/*
rm -rf ~/.cache/huggingface/*

## Activating venv
python -m venv venv
source venv/bin/activate 
pip install -r app/requirements.txt 

## Backend running cmds
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## N8N Config link
https://organic-waddle-97wpwp567vjr3rvw-5678.app.github.dev/webhook/c6210c30-7933-41fb-ad55-3e30a5c31259

