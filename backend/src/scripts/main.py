import sys
from pathlib import Path

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
system_state = Switch_State()
logging.debug("Système initialisé")

screen = I2C_screen()
logging.debug("Affichage LCD initialisée")

alarm = Alarm(config, screen, system_state)
logging.debug("Alarme initialisée")

motion_sensor = MotionSensor(config, screen, system_state, alarm)
logging.debug("Détecteur de mouvement initialisé")

keypad = Keypad(config, screen)
logging.debug("Clavier initialisé")

acces = Controle_Acces(config["acces"]["password"])
logging.debug("Contrôle d'accès initialisé")

# Initialiser status reporter
status_reporter = init_status_reporter(
    building_id="bld_123",  
    backend_url="http://192.168.2.11:3000",  
    api_key="your_api_key_here"  
)
logging.info("Status reporter initialisé")

pattern_learner = PIRPatternLearner()
logging.info("Pattern Learner initialisé")

state = {
    "last_pattern_calculation": datetime.now(),
    "pattern_calculation_interval": 3600
}

screen.display_message("Le systeme est prêt")
logging.info("Le systeme est prêt")

keypad_controller = KeypadController(alarm, screen, acces, system_state)
logging.debug("Le contrôlleur a été créé")

keypad.start_listening(keypad_controller.key_pressed)
logging.info("L'écoute du clavier a commencé")


def handle_motion_detection():
    try:
        if hasattr(motion_sensor, 'motion_detected'):
            motion = motion_sensor.motion_detected

            status_reporter = get_status_reporter()
            status_reporter.update_gpio_state('motion', motion)
            status_reporter.update_gpio_state('system_armed', system_state.is_armed)

            pattern_learner.add_motion_reading(motion, datetime.now())

            current_hour = datetime.now().hour
            pattern = pattern_learner.get_pattern_for_hour(current_hour)

            if pattern_learner.should_trigger_alarm(
                motion_detected=motion,
                pattern=pattern,
                armed=system_state.is_armed
            ):
                logging.warning("Mouvement anormal détecté!")
                status_reporter.update_gpio_state('buzzer', True)
                status_reporter.update_gpio_state('led_red', True)

    except Exception as e:
        logging.debug(f"handle_motion_detection: {e}")


def main():
    try:
        status_reporter = get_status_reporter()

        status_reporter.update_gpio_state('motion', motion_sensor.motion_detected if hasattr(motion_sensor, 'motion_detected') else False)
        status_reporter.update_gpio_state('system_armed', system_state.is_armed)

        state_system = "ARMÉ" if system_state.is_armed else "DÉSARMÉ"
        alarm_state = "ACTIVÉ" if system_state.is_alarming else "DÉSACTIVÉ"

        logging.debug(f"État du système: {state_system}, Alarme: {alarm_state}")

        handle_motion_detection()

        current_time = datetime.now()
        time_diff = (current_time - state["last_pattern_calculation"]).total_seconds()

        if time_diff >= state["pattern_calculation_interval"]:
            pattern_learner.calculate_patterns()
            days = pattern_learner.get_days_collected()
            logging.info(f"Patterns recalculés ({days} jours de données)")
            state["last_pattern_calculation"] = current_time

    except Exception as e:
        logging.error(f"Erreur dans la boucle: {e}")


if __name__ == "__main__":
    try:
        while True:
            main()
            time.sleep(1)

    except KeyboardInterrupt:
        screen.cleanup()
        alarm.cleanup()
        
        status_reporter = get_status_reporter()
        status_reporter.stop_auto_send()
        
        GPIO.cleanup()

        logging.info("Affichage du résumé des patterns:")
        pattern_learner.print_summary()

        print("Programme arrêté")
        logging.info("SYSTEME D'ALARME ARRÊTÉ")