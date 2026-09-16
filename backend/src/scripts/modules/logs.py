import logging
from pathlib import Path

def setup_logging_from_cfg(cfg):

    log_cfg = cfg["logging"]

    level_str = log_cfg.get("level", "INFO").upper()

    level = getattr(logging, level_str, logging.INFO)

    log_file = log_cfg.get("file", "logs/alarm_system.log")

    Path(log_file).parent.mkdir(parents=True, exist_ok=True)

    handlers = []

    file_handler = logging.FileHandler(log_file, encoding="utf-8")
    handlers.append(file_handler)

    if log_cfg.get("console", True):
        console_handler = logging.StreamHandler()
        handlers.append(console_handler)

    logging.basicConfig(
        level=level,
        format="%(asctime)s | %(levelname)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=handlers
    )