import requests
import json
import logging
import time
import threading
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GPIOStatusReporter:

    def __init__(self, building_id, backend_url, api_key):
        self.building_id = building_id
        self.backend_url = backend_url
        self.api_key = api_key
        
       
        self.gpio_state = {
            "led_red": False,
            "led_green": False,
            "buzzer": False,
            "motion": False,
            "keypad_code": None,
            "system_armed": False
        }

        self.running = True
        self.last_sent = None
        self.send_interval = 5
    
    def update_gpio_state(self, component, value):
        if component in self.gpio_state:
            self.gpio_state[component] = value
            logger.debug(f"GPIO updated: {component} = {value}")

        else:
            logging.warning(f"Composant GPIO inconnu: {component}")

    def get_gpio_state(self):
        return self.gpio_state.copy()
    
    def send_status_to_backend(self):
        try:
            url = f"{self.backend_url}/api/rpi/status"

            gpio_state_clean = {
                'led_red': bool(self.gpio_state.get('led_red', False)),
                'led_green': bool(self.gpio_state.get('led_green', False)),
                'buzzer': bool(self.gpio_state.get('buzzer', False)),
                'motion': bool(self.gpio_state.get('motion', False)),
                'system_armed': bool(self.gpio_state.get('system_armed', False)),
                'keypad_code': None
        }
            
            payload = {
                'building_id': self.building_id,
                **gpio_state_clean,  # Étendre le dict
                'timestamp': datetime.now().isoformat()
            }
            
            headers = {
                'Authorization': f"Bearer {self.api_key}",
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=5)
            
            if response.status_code in [200, 201]:
                logger.info(f"Status envoyé au backend")
                self.last_sent = datetime.now()
                return True
            else:
                logger.error(f"Erreur: {response.status_code}")
                logger.error(f" Réponse: {response.text}")
                return False
                
        except requests.exceptions.Timeout:
            logger.error(f"Timeout: Le Backend ne répond pas")
            return False
        except requests.exceptions.ConnectionError:
            logger.error(f"Erreur connexion: Le Backend n'est pas joignable")
            return False
        except Exception as err:
            logger.error(f"Erreur dans l'envoi du statut: {err}")
            return False

    def should_send_status(self):
        if self.last_sent is None:
            return True

        elapsed = (datetime.now() - self.last_sent).total_seconds()
        return elapsed >= self.send_interval

    def start_auto_send(self):
        def auto_send():
            logger.info("On commence l'envoi automatique")
            while self.running:
                if self.should_send_status():
                    self.send_status_to_backend()
                time.sleep(1)
        
        thread = threading.Thread(target=auto_send, daemon=True)
        thread.start()
        logger.info("L'envoi automatique a commencé")
    
    def stop_auto_send(self):
        self.running = False
        logger.info("L'envoi automatique thread arrêté")



_status_reporter = None


def init_status_reporter(building_id, backend_url, api_key):
    
    global _status_reporter
    _status_reporter = GPIOStatusReporter(building_id, backend_url, api_key)
    _status_reporter.start_auto_send()
    return _status_reporter


def get_status_reporter():
  
    global _status_reporter
    if _status_reporter is None:
        raise RuntimeError("Status reporter pas initialisé. Appeler init_status_reporter() avant.")
    return _status_reporter