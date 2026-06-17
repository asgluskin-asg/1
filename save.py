import json, os
from config import SAVE_DIR, SAVE_FILE, STARTING_CHIPS

def load():
    try:
        os.makedirs(SAVE_DIR, exist_ok=True)
        with open(SAVE_FILE) as f:
            data = json.load(f)
        return int(data.get("chips", STARTING_CHIPS))
    except Exception:
        return STARTING_CHIPS

def save(chips):
    try:
        os.makedirs(SAVE_DIR, exist_ok=True)
        with open(SAVE_FILE, "w") as f:
            json.dump({"chips": chips}, f)
    except Exception:
        pass

def reset():
    save(STARTING_CHIPS)
    return STARTING_CHIPS
