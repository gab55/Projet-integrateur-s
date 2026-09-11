import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "modules"))  # Ajoute le dossier module au chemin

# Importations
import RPi.GPIO as GPIO
import yaml
import logging
import time
from gpio_adapter import Alarm, MotionSensor, Keypad, I2C_screen
from model import Switch_State, Controle_Acces, KeypadController
from logs import setup_logging_from_cfg

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

# Permet d'initialiser les composants du changement d'état, l'écran I2C, le motion sensor
# du mot de passe, de l'alarme, du clavier et de l'accès
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

screen.display_message("Le systeme est prêt")
logging.info("Le systeme est prêt")


keypad_controller = KeypadController(alarm, screen, acces, system_state)
logging.debug("Le contrôlleur a été créé")

keypad.start_listening(keypad_controller.key_pressed)
logging.info("L'écoute du clavier a commencé")



def main():
    # Boucle principale du programme

    try:
        state_system = "ARMÉ" if system_state.is_armed else "DÉSARMÉ"
        alarm_state = "ACTIVÉ" if system_state.is_alarming else "DÉSACTIVÉ"

        logging.debug(f"État du système: {state_system}, Alarme: {alarm_state}")

    except Exception as e:
        logging.error(f"Erreur dans la boucle: {e}")
        print(f"Erreur: {e}")


if __name__ == "__main__":
    main()

    try:
        while True:
            main()
            time.sleep(0.1)

    except KeyboardInterrupt:
        screen.cleanup()
        alarm.cleanup()
        GPIO.cleanup()

        print("Programme arrêté")
        logging.info("SYSTEME D'ALARME ARRÊTÉ")
 

