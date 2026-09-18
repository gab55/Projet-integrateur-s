import RPi.GPIO as GPIO     # Module GPIO
from RPLCD.i2c import CharLCD   # Module pour l'affichage
import time     # Module de délais
import threading    # Module pour faire des exécutions en parallèle
import logging      # Module pour exécuter des fonctions en parallèle
from services.status_reporter import GPIOStatusReporter     # Module pour reporter
from services.status_reporter import get_status_reporter    # 
from datetime import datetime   # Module pour gérer de la date et l'heure

# Initialisation statut RPi.GPIO vers backend
gpio_reporter = GPIOStatusReporter(
    building_id='bld_123',
    backend_url='http://backend.local:3000',
    api_key='rpi_key_xyz'
)

class I2C_screen:

    # Classe qui affiche l'écran LCD 16x2 via I2C

    def __init__(self):

        # Initialise l'écran LCD
        try:

            self.lcd = CharLCD(     # Instance l'écran
                i2c_expander="PCF8574",
                address=0x27,
                port=1,
                cols=16,
                rows=2
            )

            self.lcd.clear()    # Effacer l'écran
            logging.info("Afficheur réinitialisé")
        except Exception as e:
            logging.error(f"Erreur affichicage lors de la réinitialisation: {e}")

    def display_message(self, ligne1, ligne2=""):

        # Fonction pour afficher le message sur l'écran (2 lignes maximum)

        try:
            self.lcd.clear() # Effacer avant d'afficher
            self.lcd.cursor_pos = (0, 0)    # Potionnement en haut à gauche
            self.lcd.write_string(ligne1[:16]) # Écrire sur la première 16 caractères maximum

            if ligne2:
                self.lcd.cursor_pos = (1, 0)    # Positionnement en bas à gauche
                self.lcd.write_string(ligne2[:16])  # Écrire sur la deuxième 16 caractères maximum

        except Exception as e:  # Gérer les erreurs
            logging.error(f"Erreur lors de l'affichage: {e}")
            print(f"Erreur lors de l'affichage: {e}")

    def cleanup(self):  # Fonction qui efface l'écran
        try:
            self.lcd.clear()
        except:
            pass

    


class Alarm:

    # Classe qui gère les LED rouge et verte et le buzzer.
    # LED rouge -> l'alarme est déclenchée
    # LED verte -> système armée
    # Buzzer -> pour le son quand l'alarme est activé 

    def __init__(self, config, screen=None, switch_state=None):

        # Initialisation GPIO et l'écran

        self.gpio = config["gpio"]  # Récupérer les GPIO dans le config.yaml
        self.screen = screen    # Instance de l'écran
        self.switch_state = switch_state     # Instance du switch d'état

        self.red_led_pin = self.gpio["red_led_pin"]     # GPIO 5
        self.green_led_pin = self.gpio["green_led_pin"]   # GPIO 22
        self.active_buzzer = self.gpio["active_buzzer"] # GPIO 27

        # Configuration de la led verte, rouge et du buzzer en sortie
        GPIO.setup(self.red_led_pin, GPIO.OUT)
        GPIO.setup(self.green_led_pin, GPIO.OUT)
        GPIO.setup(self.active_buzzer, GPIO.OUT)

        # Éteindre la led verte, rouge et le buzzer au début
        GPIO.output(self.red_led_pin, GPIO.LOW)
        GPIO.output(self.green_led_pin, GPIO.LOW)
        GPIO.output(self.active_buzzer, GPIO.LOW)

        # Attendre 200ms que tout soit bien initialisé
        time.sleep(0.2)
        logging.info("Alarme a été initialisée")

    def sound_key(self):
        # Fonction qui fait le son des touches presssées
        GPIO.output(self.active_buzzer, GPIO.HIGH)
        time.sleep(0.05)
        GPIO.output(self.active_buzzer, GPIO.LOW)
        logging.debug(" Le bip du son de touche")

    def succes(self):
        # Gère l'armement et le désarmement
        if self.switch_state.is_armed:
            # Si le système est armé, on veut le désarmer
            self.switch_state.disarm()
            # Affiche ce message sur l'écran LCD
            if self.screen:
                self.screen.display_message("SYSTEME", "DESARMEE")
            print("Système désarmée")
        else:
            # Si le système est désarmé, on veut l'armer
            self.switch_state.arm()
            GPIO.output(self.green_led_pin, GPIO.HIGH)
            # Affiche ce message sur l'écran LCD
            if self.screen:
                self.screen.display_message("SYSTEME", "ARMEE")
            print("Système armée")

            time.sleep(5) # Garde la led verte allumée pendant 5 secondes

            # Éteint la LED verte
            GPIO.output(self.green_led_pin, GPIO.LOW)
            # Affiche ce message sur l'écran LCD
            if self.screen:
                self.screen.display_message("SYSTEME", "ARMEE")


    def activate(self):

        # Fonction pour l'activation de l'alarme: la led rouge clignote et le buzzer bip pendant 5 secondes

        self.switch_state.trigger_alarm() # L'état devient déclenchée

        # Affiche ce message sur l'écran LCD
        if self.screen:
            self.screen.display_message("ALARME", "DECLENCHEE!!")

        start_time = time.time() # Enregistre l'heure de départ

        # Récupère le statut
        status_reporter = get_status_reporter()

        while time.time() - start_time < 5: # Boucle pendant 5 secondes
            # Led rouge allumée et le buzzer activé
            GPIO.output(self.red_led_pin, GPIO.HIGH)
            status_reporter.update_gpio_state('led_red', True)

            # Le buzzer activé
            GPIO.output(self.active_buzzer, GPIO.HIGH)
            status_reporter.update_gpio_state('buzzer', True)

            time.sleep(0.1)

            # Envoie le statut au backend
            status_reporter.send_status_to_backend()
            logging.info("ALARME DÉCLENCHÉE - Status envoyé au backend")


            # Led rouge éteinte et le buzzer désactivé
            GPIO.output(self.active_buzzer, GPIO.LOW)
            GPIO.output(self.red_led_pin, GPIO.LOW)
            time.sleep(0.2)
        
        # Après 5 secondes, led rouge et buzzer sont à OFF
        GPIO.output(self.red_led_pin, GPIO.LOW)
        GPIO.output(self.active_buzzer, GPIO.LOW)

        self.switch_state.stop_alarm()    # L'état de l'alarme devient arrêtée

        # Affiche ce message sur l'écran LCD
        if self.screen:
            self.screen.display_message("ALARME ARRETEE!", "VEUILLEZ ENTRER LE CODE.")
        logging.info("Alarme est prêt à être activée.")
        # Affiche dans le terminal
        print("Alarme arrêtée")

    def cleanup(self):

        # Éteint le GPIO et nettoie 
        GPIO.output(self.red_led_pin, GPIO.LOW)
        GPIO.output(self.green_led_pin, GPIO.LOW)
        GPIO.output(self.active_buzzer, GPIO.LOW)
        GPIO.cleanup()
        logging.info("L'alarme a été nettoyée")


class MotionSensor:

    # Classe qui gère le capteur de détection de mouvement

    def __init__(self, config, screen=None, switch_state=None, alarm=None):

        # Initialisation du capteur

        self.sensor_pin = config["sensor"]["pir_motion_sensor"] # GPIO 4
        self.screen = screen    # Instance de l'écran
        self.switch_state = switch_state    # Instance de l'état du système
        self.alarm = alarm    # Instance de l'alarme
        self.last_state = False     # Le dernier état est à pas de mouvement
        self.state_count = 0    # Compteur

        GPIO.setup(self.sensor_pin, GPIO.IN)    # Configuration pour lire le capteur
        logging.info(" Le capteur de détection de mouvement est initialisé")

        self.start_polling()    # Vérification en tout temps du capteur

    def motion_detected(self):
        # Fonction qui retourne l'état de la du détecteur de mouvement
        return self.last_state

    def start_polling(self):

        # Fonction qui vérifie en continue le capteur de détection de mouvement

        def check_motion():

            # Fonction dans une boucle pour surveiller le capteur de détection de mouvement
            motion_timeout = None

            while True:
                # Lit le capteur: HIGH= mouvement et LOW= pas de mouvement
                current_state = GPIO.input(self.sensor_pin) == GPIO.HIGH

                # Vérifie que l'état change au moins 3 fois
                if current_state != self.last_state:    # Si l'état à changer depuis la dernière lecture faite
                    self.state_count += 1       # Incrémente le state_count

                    # Permet de confirmer que l'état a été changé au moins 3 fois de suite (pas un faux positifs) 
                    if self.state_count >=3 and current_state != self.last_state:
                        self.last_state = current_state     # Pour mettre l'ancien état à jour
                        self.callback(self.sensor_pin, current_state) # On appelle l'action callback
                        self.state_count = 0

                        # Permet d'enregistrer ù le mouvement a été détecté
                        if current_state:
                            motion_timeout = datetime.now()

                    else:
                        self.state_count = 0    # On réinitialise le compteur

                # Élimine les faux positifs
                if self.last_state and motion_timeout is not None:
                    elapsed = (datetime.now() - motion_timeout).total_seconds()
                    if elapsed >= 10:
                        self.last_state = False
                        motion_timeout = None

                time.sleep(0.05)    # On vérifie le capteur tous les 50 ms

        # On utilise un thread qui s'arrête en même temps que notre code
        thread = threading.Thread(target=check_motion, daemon=True)
        thread.start()  # On démare le thread 

    def callback(self, channel, current_state):

        # C'est la fonction qui est appelé quand le motion sensor détecte le changement d'état

        if current_state:     # Pour détecter si il y a du mouvement

            # Si le système doit être armé et si l'alarme n'est pas encore activé
            if self.switch_state.is_armed and not self.switch_state.is_alarming:
                # Message afficher sur le moniteur
                print("Mouvement détecté! ALARME ARMÉE")
                logging.warning("L'alarme a été déclenchée par le mouvement")
                # Message afficher sur l'écran LCD
                if self.screen:
                    self.screen.display_message("MOUVEMENT DÉTECTÉ!", "ALARME ARMÉE")

                # On déclenche l'alarme
                self.alarm.activate()

            else:
                print("Mouvement détecté! ALARME DÉSARMÉE")
                logging.info("L'alarme a été déclenchée par le mouvement(système désarmé)")
                # Message afficher sur l'écran LCD
                if self.screen:
                    self.screen.display_message("MOUVEMENT DÉTECTÉ!", "ALARME DÉSARMÉE")
        else:
            # Quand le capteur ne détecte pas de mouvement

            # Message afficher sur le moniteur
            print("Aucun mouvement détecté.")
            logging.debug(" Pas de mouvement détecté")
            # Message afficher sur l'écran LCD
            if self.screen:
                self.screen.display_message("AUCUN MOUVEMENT")


class Keypad:

    # classe qui gère le clavier
    
    def __init__(self, config, screen=None):

        # Initialiser le clavier

        gpio = config["gpio"]   # On récupére les données du gpio du config.yaml
        self.screen = screen    # Instance de l'afficheur LCD

        # Les lignes sont en sortie
        self.ROW_PINS = [
            gpio["c1_keypad"],  # ligne 0 (1,2,3,A)
            gpio["c2_keypad"],  # ligne 1 (4,5,6,B)
            gpio["c3_keypad"],  # ligne 2 (7,8,9,C)
            gpio["c4_keypad"]   # ligne 3 (*,0,#,D)
        ]

        # Les colonnes sont en entrée
        self.COLUMN_PINS = [
            gpio["r4_keypad"],  # colonne 0 (1,4,7,*)
            gpio["r3_keypad"],  # colonne 1 (2,5,8,0)
            gpio["r2_keypad"],  # colonne 2 (3,6,9,#)
            gpio["r1_keypad"]   # colonne 3 (A,B,C,D)
        ]

        # C'est la matrice des touches
        self.KEYMAP = [
            ["1", "2", "3", "A"],
            ["4", "5", "6", "B"],
            ["7", "8", "9", "C"],
            ["*", "0", "#", "D"]
        ]

        # Pour configurer les lignes
        for row in self.ROW_PINS:
            GPIO.setup(row, GPIO.OUT)   # On configure les lignes en sortie
            GPIO.output(row, GPIO.HIGH) # Les lignes sont tous à HIGH

        # Pour configurer les colonnes
        for col in self.COLUMN_PINS:
            # On configure tous les colonnes à HIGH et on utilise le pull up down interne
            GPIO.setup(col, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        logging.info(" Le clavier est initialisé")

    def scan_keys(self):

        # La fonction scanne toutes les lignes pour détecter les touches qui sont pressées

        for r in range(4): 
            # Chaque ligne est parcourue (ligne 0, 1, 2, 3)

            GPIO.output(self.ROW_PINS[r], GPIO.LOW)

            for c in range(4):
                # Chaque colonne est parcourue (colonne 0, 1, 2, 3)

                if GPIO.input(self.COLUMN_PINS[c]) == GPIO.LOW:     # Une touche a été détectée

                    time.sleep(0.05)    # On attend 50 ms

                    # On attend que la touche soit relâcher (passe de LOW à HIGH)
                    while GPIO.input(self.COLUMN_PINS[c]) == GPIO.LOW:
                        pass

                    GPIO.output(self.ROW_PINS[r], GPIO.HIGH)    # On remet la ligne à HIGH

                    return self.KEYMAP[r][c]    # Permet de retourner la touche qui a été pressé

            GPIO.output(self.ROW_PINS[r], GPIO.HIGH) # Permet de retouner la ligne à HIGH avant de passer à la prochaine ligne

        return None     # Retourne aucune touche si rien n'a été pressée

    def start_listening(self, callback):

        # Fonction qui permet de faire l'écoute en continu avec un autre thread

        def listen():

            # Fonction à l'intérieur d'une fonction qui toutrne à l'infini avec while

            last_key = None     # On garde la dernière touche pressée en mémoire pour éviter les doublons

            # Boucle infinie qui scanne le clavier en continue
            while True:   

                key = self.scan_keys()  # Pour lire une touche pressée

                if key and key != last_key:     # Si une nouvelle touche a été pressée
                    callback(key)   # On appelle la fonction callback avec la touche
                    last_key = key  # On mémorise la touche pressé comme la dernière

                elif not key:   # Si aucune touche a été pressée
                    last_key = None     # On réinitialise 

                time.sleep(0.01) # On scanne le clavier tous les 10 ms

        # On créer un thread qui s'arrête quand le programme s'arrête
        thread = threading.Thread(
            target=listen,  # C'est la fonction qu'on utilise
            daemon=True     # Le mode
        )

        # On démarre le thread
        thread.start()
        logging.info("L'écoute du clavier a commencée")


