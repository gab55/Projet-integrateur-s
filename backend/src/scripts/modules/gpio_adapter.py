import RPi.GPIO as GPIO     # Module GPIO
from RPLCD.i2c import CharLCD   # Module pour l'affichage
import time     # Module de délais
import threading    # Module pour faire des exécutions en parallèle


class I2C_screen:

    # Classe qui affiche l'écran

    def __init__(self):

        # Initialise l'écran LCD

        self.lcd = CharLCD(     # Instance l'écran
            i2c_expander="PCF8574",
            address=0x27,
            port=1,
            cols=16,
            rows=2
        )

        self.lcd.clear()    # Effacer l'écran

    def afficher_message(self, ligne1, ligne2=""):

        # Fonction pour afficher le message sur l'écran

        try:
            self.lcd.clear() # Effacer avant d'afficher
            self.lcd.cursor_pos = (0, 0)    # Potionnement en haut à gauche
            self.lcd.write_string(ligne1[:16]) # Écrire sur la première 16 caractères maximum

            if ligne2:
                self.lcd.cursor_pos = (1, 0)    # Positionnement en bas à gauche
                self.lcd.write_string(ligne2[:16])  # Écrire sur la deuxième 16 caractères maximum

        except Exception as e:  # Gérer les erreurs
            print(f"Erreur lors de l'affichage: {e}")

    def cleanup(self):  # Fonction qui efface l'écran
        self.lcd.clear()

class Changement_Etat:  

    # Classe qui gère l'état en passant d'armé à désarmé et de l'alarme active à inactive

    def __init__(self):
        # Initialisation de l'état

        self.est_arme =False    # N'est pas armé au début
        self.est_declenchee = False # L'alarme n'est pas déclenchée au début

    def arm(self):
        # Fonction qui arme 
        self.est_arme = True
        print("Système armé")

    def disarm(self):
        # Fonction qui désarme 
        self.est_arme = False
        print("Système déasarmé")

    def alerte_alarm(self):
        # Fonction qui active l'alarme
        self.est_declenchee = True
        print("Alarme déclenchée")

    def arret_alarme(self):
        # Fonction qui désactive l'alarme 
        self.est_declenchee = False
        print("Alarme arrêtée")

    


class Alarme:

    # Classe qui gère les LED rouge et verte et le buzzer.

    def __init__(self, config, screen=None, changement_etat=None):

        # Initialisation GPIO et l'écran

        self.gpio = config["gpio"]  # Récupérer les GPIO dans le config.yaml
        self.screen = screen    # Instance de l'écran
        self.changement_state = changement_etat     # Instance du changement d'état

        self.red_led_pin = self.gpio["red_led_pin"]     # GPIO 5
        self.green_led_pin = self.gpio["green_led_pin"]   # GPIO 22
        self.active_buzzer = self.gpio["active_buzzer"] # GPIO 27

        # Vérifier que GPIO.setmode() est appelé une seule fois
        if GPIO.getmode() is None:
            GPIO.setmode(GPIO.BCM) # Permet d'utiliser les numéros GPIO 

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

    def son_touche(self):
        # Fonction qui fait le son des touches presssées
        GPIO.output(self.active_buzzer, GPIO.HIGH)
        time.sleep(0.05)
        GPIO.output(self.active_buzzer, GPIO.LOW)

    def succes(self):
        # Gère l'armement et le désarmement
        if self.changement_state.est_arme:
            # Si le système est armé, on veut le désarmer
            self.changement_state.disarm()
            if self.screen:
                self.screen.afficher_message("SYSTEME DESARMEE")
            print("Système désarmée")
        else:
            # Si le système est désarmé, on veut l'armer
            self.changement_state.arm()
            GPIO.output(self.green_led_pin, GPIO.HIGH)
            if self.screen:
                self.screen.afficher_message("SYSTEME ARMEE")
            print("Système armée")

            time.sleep(5) # Garde la led verte allumée pendant 5 secondes

            GPIO.output(self.green_led_pin, GPIO.LOW)
            if self.screen:
                self.screen.afficher_message("SYSTEME ARMEE")


    def activer(self):

        # Fonction pour l'activation de l'alarme: la led rouge clignote et le buzzer bip

        self.changement_state.alerte_alarm() # L'état devient déclenchée

        if self.screen:
            self.screen.afficher_message("ALARME DECLENCHEE!!")

        start_time = time.time() # Enregistre l'heure de départ

        while time.time() - start_time < 5: # Boucle pendant 5 secondes
            # Led rouge allumée et le buzzer activé
            GPIO.output(self.red_led_pin, GPIO.HIGH)
            GPIO.output(self.active_buzzer, GPIO.HIGH)
            time.sleep(0.1)

            # Led rouge éteinte et le buzzer désactivé
            GPIO.output(self.active_buzzer, GPIO.LOW)
            GPIO.output(self.red_led_pin, GPIO.LOW)
            time.sleep(0.2)
        
        # Après 5 secondes, led rouge et buzzer sont à OFF
        GPIO.output(self.red_led_pin, GPIO.LOW)
        GPIO.output(self.active_buzzer, GPIO.LOW)
        self.changement_state.arret_alarme()    # L'état de l'alarme devient arrêtée
        
        if self.screen:
            self.screen.afficher_message("ALARME ARRETEE!")
        print("Alarme arrêtée")

    def cleanup(self):
        GPIO.output(self.red_led_pin, GPIO.LOW)
        GPIO.output(self.green_led_pin, GPIO.LOW)
        GPIO.output(self.active_buzzer, GPIO.LOW)
        GPIO.cleanup()


class MotionSensor:

    # Classe qui gère le capteur de détection de mouvement

    def __init__(self, config, screen=None, changement_state=None, alarme=None):

        # Initialisation du capteur

        self.sensor_pin = config["sensor"]["pir_motion_sensor"] # GPIO 4
        self.screen = screen    # Instance de l'écran
        self.changement_state = changement_state    # Instance de l'état du système
        self.alarme = alarme    # Instance de l'alarme
        self.last_state = False     # Le dernier état est à pas de mouvement
        self.state_count = 0    # Compteur

        # Vérifier que GPIO.setmode() est appelé une seule fois
        if GPIO.getmode() is None:
            GPIO.setmode(GPIO.BCM)

        GPIO.setup(self.sensor_pin, GPIO.IN)    # Configuration pour lire le capteur

        self.start_polling()    # Vérification en tout temps du capteur

    def start_polling(self):

        # Fonction qui vérifie en continue le capteur de détection de mouvement

        def check_motion():
            while True:
                # capteur: HIGH= mouvement et LOW= pas de mouvement
                current_state = GPIO.input(self.sensor_pin) == GPIO.HIGH

                if current_state != self.last_state:
                    self.state_count += 1

                    if self.state_count >=3 and current_state != self.last_state:
                        self.last_state = current_state
                        self.callback(self.sensor_pin)
                        self.state_count = 0

                else:
                    self.state_count = 0

                time.sleep(0.05)

        thread = threading.Thread(target=check_motion, daemon=True)
        thread.start()

    def callback(self, channel):

        if GPIO.input(self.sensor_pin):

            print("Mouvement détecté!")

            if self.changement_state.est_arme and not self.changement_state.est_declenchee:
                print("Alarme déclenché par mouvement")
                if self.screen:
                    self.screen.afficher_message("MOUVEMENT DÉTECTÉ!")

                self.alarme.activer()

        else:

            print("Aucun mouvement détecté.")
            if self.screen:
                self.screen.afficher_message("AUCUN MOUVEMENT")


class Keypad:

    def __init__(self, config, screen=None):

        gpio = config["gpio"]
        self.screen = screen

        self.ROW_PINS = [
            gpio["c1_keypad"],
            gpio["c2_keypad"],
            gpio["c3_keypad"],
            gpio["c4_keypad"]
        ]

        self.COLUMN_PINS = [
            gpio["r4_keypad"],
            gpio["r3_keypad"],
            gpio["r2_keypad"],
            gpio["r1_keypad"]
        ]

        self.KEYMAP = [
            ["1", "2", "3", "A"],
            ["4", "5", "6", "B"],
            ["7", "8", "9", "C"],
            ["*", "0", "#", "D"]
        ]

        # Vérifier que GPIO.setmode() est appelé une seule fois
        if GPIO.getmode() is None:
            GPIO.setmode(GPIO.BCM)

        for row in self.ROW_PINS:
            GPIO.setup(row, GPIO.OUT)
            GPIO.output(row, GPIO.HIGH)

        for col in self.COLUMN_PINS:
            GPIO.setup(col, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    def lire_touche(self):

        for r in range(4):

            GPIO.output(self.ROW_PINS[r], GPIO.LOW)

            for c in range(4):

                if GPIO.input(self.COLUMN_PINS[c]) == GPIO.LOW:

                    time.sleep(0.05)

                    while GPIO.input(self.COLUMN_PINS[c]) == GPIO.LOW:
                        pass

                    GPIO.output(self.ROW_PINS[r], GPIO.HIGH)

                    return self.KEYMAP[r][c]

            GPIO.output(self.ROW_PINS[r], GPIO.HIGH)

        return None

    def commencer_ecouter(self, callback):

        def ecoute():

            derniere_touche = None

            while True:

                touche = self.lire_touche()

                if touche and touche != derniere_touche:
                    callback(touche)
                    derniere_touche = touche

                elif not touche:
                    derniere_touche = None

                time.sleep(0.05)

        thread = threading.Thread(
            target=ecoute,
            daemon=True
        )

        thread.start()


class Controle_Acces:

    def __init__(self, password):

        self.password = password
        self.code = ""

    def ajouter(self, touche):

        self.code += touche

    def effacer(self):

        self.code = ""

    def verifier(self):

        resultat = self.code == self.password
        self.code = ""

        return resultat


