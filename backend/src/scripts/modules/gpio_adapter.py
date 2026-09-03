import RPi.GPIO as GPIO     # Module de gestion des GPIO
from RPLCD.i2c import CharLCD   # Écran LCD I2C
import time

class GPIO_Adapter:

    # Classe pour les LEDs et le buzzer

    def __init__(self, red_led_pin, green_led_pin, buzzer_pin):

        # Initialisation des pins pour les LEDs et le buzzer.

        self.red_led_pin = red_led_pin
        self.green_led_pin = green_led_pin
        self.buzzer_pin = buzzer_pin

        # Configuration mode BCM
        GPIO.setmode(GPIO.BCM)

        # Pins en mode sortie
        GPIO.setup(self.red_led_pin, GPIO.OUT)
        GPIO.setup(self.green_led_pin, GPIO.OUT)
        GPIO.setup(self.buzzer_pin, GPIO.OUT)

        # Tous éteindre au démarrage
        GPIO.output(self.red_led_pin, GPIO.LOW)
        GPIO.output(self.green_led_pin, GPIO.LOW)
        GPIO.setup(self.buzzer_pin, GPIO.LOW)

        # Clignotement
        self.last_toggle = time.time()
        self.led_state = False


    def apply(self, en_alerte, blink_interval_ms):

        """
        L'état d'alerte: 
        Quand c'est activé, LED rouge clignote et buzzer sonne.
        Quand c'est désactivé, LED rouge, vert et buzzer sont désactivés.
        """

        if en_alerte:
            # LED rouge clignote et le buzzer sonne
            GPIO.output(self.red_led_pin, GPIO.HIGH)
            GPIO.output(self.buzzer_pin, GPIO.HIGH)

            # Intervalle de clignotement
            time.sleep(blink_interval_ms / 1000)

            # Éteindre LED et le buzzer
            GPIO.output(self.red_led_pin, GPIO.LOW)
            GPIO.output(self.buzzer_pin, GPIO.LOW)

        else:
            # Quand il n'y a pas d'alarme tout est éteint.
            GPIO.output(self.red_led_pin, GPIO.LOW)
            GPIO.output(self.green_led_pin, GPIO.LOW)
            GPIO.output(self.buzzer_pin, GPIO.LOW)

    def cleanup(self):
            # Nettoyage des pins
            GPIO.output(self.red_led_pin, GPIO.LOW)
            GPIO.output(self.green_led_pin, GPIO.LOW)
            GPIO.output(self.buzzer_pin, GPIO.LOW)
            GPIO.cleanup()


class MotionSensor:

    # Classe pour le motion sensor.

    def __init__(self, config):

        # Iniatialisé le motion sensor.
        
        self.config = config

        # Récupérer le numéro du pin dans config.yaml
        self.sensor_pin = config["sensor"]["pir_motion_sensor"]

        try:

            # Initialiser GPIO
            if GPIO.getmode() is None:
                GPIO.setmode(GPIO.BCM)

            # Pin d'entré
            GPIO.setup(self.sensor_pin, GPIO.IN)                

            # Détecte les changements d'état
            GPIO.add_event_callback(
                self.sensor_pin, 
                GPIO.BOTH, 
                callback=self.gpio_callback, 
                bouncetime=200 
            )
        except Exception as e:
            print(f"Erreur du capteur: {e}")

    def gpio_callback(self, channel):

        # Le callback se déclenche quand il y a un changement d'état

        # Vérifie l'état du capteur
        if GPIO.input(self.sensor_pin) == GPIO.HIGH:
            # HIGH = mouvement détecté
            self.motion_detected()
        else:
            # LOW = aucun mouvement
            self.motion_stopped()

    def motion_detected(self):
        # Fonction est appelé quand un mouvement est détecté
        print("Mouvement détecté!")

    def motion_stopped(self):
        # Fonction est appelé quand il n'y aucun mouvement
        print("Auncun mouvement détecté.")

class I2C_screen:

    # Classe pour gérer l'affichage.

    def __init__(self):

        # Initialise l'écran.
        self.lcd = CharLCD(
            i2c_expander="PCF8574",
            address=0x27,
            port=1,
            cols=16,
            rows=2
        )

        try:
            time.sleep(0.5) # Attendre l'initialisation
            self.lcd.clear()    # Effacer l'écran
            self.lcd.cursor_pos = (0, 0)    # Position en haut à gauche
            self.lcd.write_string("Hello World!")   # Écrire un message d
            time.sleep(10)  # Le message s'affiche pendant 10 secondes

        except KeyboardInterrupt: # Si il y a une interruption
            pass
        finally:
            self.lcd.clear()    # Toujours effacer l'écran à la fin

