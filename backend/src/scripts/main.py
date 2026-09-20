# Chemins python
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

# Ajouter les répertoires au chemin Python pour pouvoir importer les modules
sys.path.insert(0, 'src')
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent / "modules"))

# Importations
import RPi.GPIO as GPIO
import yaml
import logging
import time
from datetime import datetime
from gpio_adapter import Alarm, MotionSensor, Keypad, I2C_screen
from model import Switch_State, Controle_Acces, KeypadController
from logs import setup_logging_from_cfg
from pattern_learning import PIRPatternLearner
from services.status_reporter import init_status_reporter, get_status_reporter

# Charger le config.yaml
def load_config():
    with open("config.yaml", "r") as file:
        return yaml.safe_load(file)

config = load_config()
setup_logging_from_cfg(config)
logging.info("Démarrage du système d'alarme")

# Nettoyer GPIO avant de commencer
GPIO.setwarnings(False)
try:
    GPIO.cleanup()
except:
    pass

time.sleep(0.5)
GPIO.setmode(GPIO.BCM)

# Initialiser les composants

# Instance qui gère l'état
system_state = Switch_State()
logging.debug("Système initialisé")

# Initialise l'écran LCD pour afficher les messages
screen = I2C_screen()
logging.debug("Affichage LCD initialisée")

# Permet d'allumer/éteindre les LED et de faire biper le buzzer
alarm = Alarm(config, screen, system_state)
logging.debug("Alarme initialisée")

# Le capteur est en continu en arrière-plan dans un thread
motion_sensor = MotionSensor(config, screen, system_state, alarm)
logging.debug("Détecteur de mouvement initialisé")

# Initialise le clavie
keypad = Keypad(config, screen)
logging.debug("Clavier initialisé")

# Récupère le password depuis le fichier de config
acces = Controle_Acces(config["acces"]["password"])
logging.debug("Contrôle d'accès initialisé")

# Initialiser status reporter pour communiquer avec le backend
backend_url = os.getenv("BACKEND_URL")
backend_port = os.getenv("BACKEND_PORT")
api_key = os.getenv("API_SECRET_KEY")
status_reporter = init_status_reporter(
    building_id="bld_123",
    backend_url=f"http://{backend_url}:{backend_port}",
    api_key=api_key
)
logging.info("Status reporter initialisé")

# Instance du Pattern Learner
pattern_learner = PIRPatternLearner()
logging.info("Pattern Learner initialisé")
# Dictionnaire d'état qui permet de gérer les recalculs de patterns
state = {
    "last_pattern_calculation": datetime.now(),     # Horodatage du dernier calcul
    "pattern_calculation_interval": 3600    # Recalcule tous les heures
}

# Affiche sur l'écran LCD que le système est prêt
screen.display_message("Le systeme est prêt")
logging.info("Le systeme est prêt")

# Crée le controller qui gère le clavier
keypad_controller = KeypadController(alarm, screen, acces, system_state)
logging.debug("Le contrôlleur a été créé")

# Démarre l'écoute du clavier en arrière-plan
keypad.start_listening(keypad_controller.key_pressed)
logging.info("L'écoute du clavier a commencé")


def handle_motion_detection():
    # Fonction qui sert à traite la détection de mouvement du capteur
    try:
        if hasattr(motion_sensor, 'motion_detected'):   # Vérifie à l'attribut motion_detected
            motion = motion_sensor.motion_detected      # Récupèrel'état du capteur

            status_reporter = get_status_reporter()     # Récupère l'instance du reporter
            status_reporter.update_gpio_state('motion', motion)     # Envoie l'état au backend
            status_reporter.update_gpio_state('system_armed', system_state.is_armed)    # Envoie l'état du global au backend

            pattern_learner.add_motion_reading(motion, datetime.now())      # Ajoute cette lecture au Pattern Learner pour l'apprentissage

            # Récupère l'heure actuelle
            current_hour = datetime.now().hour
            # Récupère le pattern pour cette heure
            pattern = pattern_learner.get_pattern_for_hour(current_hour)

            # Décide si l'alarme doit être déclenchée selon si il y a un mouvement détecter,
            # Si c,est une calme ou active et si le système est armé
            if pattern_learner.should_trigger_alarm(
                motion_detected=motion,
                pattern=pattern,
                armed=system_state.is_armed
            ):
                # Vérifie si l'alarme n'est pas dejà active
                if not system_state.is_alarming:
                    logging.warning("Mouvement anormal détecté!")   # Journalisation l'évènement
                    # Déclenche l'alarme
                    alarm.activate()
                    # Permet de notifier le backend de l'activation
                    status_reporter.update_gpio_state('buzzer', True)
                    status_reporter.update_gpio_state('led_red', True)

            else:
                # Éteint le buzzer et la LED rouge
                status_reporter.update_gpio_state('buzzer', False)
                status_reporter.update_gpio_state('led_red', False)

    except Exception as e:
        # Journaliser les erreurs
        logging.debug(f"handle_motion_detection: {e}")


def main():
    # Boucle principale qui permet de récupérer l'état actuel
    # D'envoyer le statut au backend
    # Qui traite la détection de mouvement
    # Qui recalcule les patterns tous les heures

    try:
        status_reporter = get_status_reporter() # Récupère l'instance du reporter

        # Récupère l'état du mouvement depuis le capteur
        motion = motion_sensor.last_state if hasattr(motion_sensor, 'last_state') else False
        # Envoie les états au backend
        status_reporter.update_gpio_state('motion', motion)
        status_reporter.update_gpio_state('system_armed', system_state.is_armed)

        # Créer l'état du système
        state_system = "ARMÉ" if system_state.is_armed else "DÉSARMÉ"
        alarm_state = "ACTIVÉ" if system_state.is_alarming else "DÉSACTIVÉ"

        logging.debug(f"État du système: {state_system}, Alarme: {alarm_state}")    # Journalisation de l'état en ce moment

        # Appelle la fonction qui traite le mouvement détecté
        handle_motion_detection()

        # Récupère le temps en ce moment
        current_time = datetime.now()
        # Calcule temps depuis le dernier recalcul
        time_diff = (current_time - state["last_pattern_calculation"]).total_seconds()

        # Si 1heure s'est écouler(3600), recalculer les patterns
        if time_diff >= state["pattern_calculation_interval"]:
            pattern_learner.calculate_patterns()     # Recalcule tous les patterns
            days = pattern_learner.get_days_collected()  # Récupère le nombre de jours de données collectées
            logging.info(f"Patterns recalculés ({days} jours de données)") # Journalise l'action
            state["last_pattern_calculation"] = current_time    # Met à jour l'horodatage depuis le dernier recalcul

    except Exception as e:
        # Pour gérer les erreurs (est affiché dans la journalisation)
        logging.error(f"Erreur dans la boucle: {e}")


if __name__ == "__main__":
    try:
        # Boucle en continue tant que le programme n'est pas arrêté
        while True:
            main()  # Fonction principale
            time.sleep(1)   # Attendre 1 seconde

    except KeyboardInterrupt:
        # Permettre un arrêt propre
        screen.cleanup()    # Nettoie l'écran
        alarm.cleanup()     # Éteint LEDs et buzzer

        # Arrête l'envoie automatique au backend
        status_reporter = get_status_reporter()
        status_reporter.stop_auto_send()

        # Nettoyer les broches GPIO
        GPIO.cleanup()

        # Affiche un résumé des patterns collectés et des statistiques
        logging.info("Affichage du résumé des patterns:")
        pattern_learner.print_summary()

        # Message de confirmation d'arrêt dans le terminal et dans la journalisation
        print("Programme arrêté")
        logging.info("SYSTEME D'ALARME ARRÊTÉ")