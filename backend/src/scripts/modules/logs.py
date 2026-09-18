import logging
from pathlib import Path

def setup_logging_from_cfg(cfg):
    # Fonction pour la journalisation à partir de config.yaml
    
    log_cfg = cfg.get("logging", {})
    
    level_str = log_cfg.get("level", "INFO").upper()
    level = getattr(logging, level_str, logging.INFO)
    
    log_file = log_cfg.get("file", "logs/alarm_system.log")
    
    # Créer le dossier logs s'il n'existe pas
    Path(log_file).parent.mkdir(parents=True, exist_ok=True)
    
    # Supprimer les anciens handlers
    for handler in logging.root.handlers[:]:
        logging.root.removeHandler(handler)

    # Liste pour stocker les nouveaux handlers
    handlers = []
    
    # File handler (logs dans un fichier)
    file_handler = logging.FileHandler(log_file, encoding="utf-8")
    file_handler.setLevel(level)
    handlers.append(file_handler)
    
    # Console handler (logs dans le terminal)
    if log_cfg.get("console", True):
        console_handler = logging.StreamHandler()
        console_handler.setLevel(level)
        handlers.append(console_handler)
    
    # Format
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    for handler in handlers:
        handler.setFormatter(formatter)
    
    # Configure root logger
    logging.basicConfig(
        level=level,
        handlers=handlers,
        force=True
    )

    # Retourne le logger systeme_alarm.log
    return logging.getLogger(__name__)
