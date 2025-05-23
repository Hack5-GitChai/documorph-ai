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

