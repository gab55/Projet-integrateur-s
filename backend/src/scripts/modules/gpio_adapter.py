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

    def display_message(self, ligne1, ligne2=""):

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

class Switch_State:  

    # Classe qui gère l'état en passant d'armé à désarmé et de l'alarme active à inactive

    def __init__(self):
        # Initialisation de l'état

        self.is_armed =False    # N'est pas armé au début
        self.is_alarming = False # L'alarme n'est pas déclenchée au début

    def arm(self):
        # Fonction qui arme 
        self.is_armed = True
        print("Système armé")

    def disarm(self):
        # Fonction qui désarme 
        self.is_armed = False
        print("Système déasarmé")

    def trigger_alarm(self):
        # Fonction qui active l'alarme
        self.is_alarming = True
        print("Alarme déclenchée")

    def stop_alarm(self):
        # Fonction qui désactive l'alarme 
        self.is_alarming = False
        print("Alarme arrêtée")

    


class Alarm:

    # Classe qui gère les LED rouge et verte et le buzzer.

    def __init__(self, config, screen=None, switch_state=None):

        # Initialisation GPIO et l'écran

        self.gpio = config["gpio"]  # Récupérer les GPIO dans le config.yaml
        self.screen = screen    # Instance de l'écran
        self.switch_state = switch_state     # Instance du switch d'état

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
        if self.switch_state.is_armed:
            # Si le système est armé, on veut le désarmer
            self.switch_state.disarm()
            if self.screen:
                self.screen.display_message("SYSTEME DESARMEE")
            print("Système désarmée")
        else:
            # Si le système est désarmé, on veut l'armer
            self.switch_state.arm()
            GPIO.output(self.green_led_pin, GPIO.HIGH)
            if self.screen:
                self.screen.display_message("SYSTEME ARMEE")
            print("Système armée")

            time.sleep(5) # Garde la led verte allumée pendant 5 secondes

            GPIO.output(self.green_led_pin, GPIO.LOW)
            if self.screen:
                self.screen.display_message("SYSTEME ARMEE")


    def activer(self):

        # Fonction pour l'activation de l'alarme: la led rouge clignote et le buzzer bip

        self.switch_state.trigger_alarm() # L'état devient déclenchée

        if self.screen:
            self.screen.display_message("ALARME DECLENCHEE!!")

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
        self.switch_state.stop_alarm()    # L'état de l'alarme devient arrêtée
        
        if self.screen:
            self.screen.display_message("ALARME ARRETEE!")
        print("Alarme arrêtée")

    def cleanup(self):
        GPIO.output(self.red_led_pin, GPIO.LOW)
        GPIO.output(self.green_led_pin, GPIO.LOW)
        GPIO.output(self.active_buzzer, GPIO.LOW)
        GPIO.cleanup()


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

        # Vérifier que GPIO.setmode() est appelé une seule fois
        if GPIO.getmode() is None:
            GPIO.setmode(GPIO.BCM)

        GPIO.setup(self.sensor_pin, GPIO.IN)    # Configuration pour lire le capteur

        self.start_polling()    # Vérification en tout temps du capteur

    def start_polling(self):

        # Fonction qui vérifie en continue le capteur de détection de mouvement

        def check_motion():
            while True:
                # Capteur: HIGH= mouvement et LOW= pas de mouvement
                current_state = GPIO.input(self.sensor_pin) == GPIO.HIGH

                # Permet d'éviter les faux positifs quand on utilise le clavier
                if current_state != self.last_state:    # Si l'état à changer depuis la dernière lecture faite
                    self.state_count += 1       # Uncrémente le state_count

                    # Permet de confirmer que l'état a été changé au moins 3 fois de suite (pas un faux positifs) 
                    if self.state_count >=3 and current_state != self.last_state:
                        self.last_state = current_state     # Pour mettre l'ancien état à jour
                        self.callback(self.sensor_pin)   # On appelle l'action callback
                        self.state_count = 0    # On réinitialise le compteur

                # Si l'état est pareille que la dernière fois
                else:
                    self.state_count = 0 # Il n'y a pas de changement, on réinitialise le compteur

                time.sleep(0.05)    # On vérifie le capteur tous les 50 ms

        # On utilise un thread qui s'arrête en même temps que notre code
        thread = threading.Thread(target=check_motion, daemon=True)
        thread.start()  # On démare le thread 

    def callback(self, channel):

        # C'est la fonction qui est appelé quand le motion sensor détecte le changement d'état

        if GPIO.input(self.sensor_pin):     # Pour détecter si il y a du mouvement

            print("Mouvement détecté!")     # Si le capteur est HIGH signifie que le mouvement en détecté

            # Si le système doit être armé et si l'alarme n'est pas encore activé
            if self.switch_state.is_armed and not self.switch_state.is_alarming:
                # Message afficher sur le moniteur
                print("Alarme déclenché par mouvement")
                # Message afficher sur l'écran LCD
                if self.screen:
                    self.screen.display_message("MOUVEMENT DÉTECTÉ!")
                # On déclenche l'alarme
                self.alarm.activer()

        else:
            # Quand le capteur ne détecte pas de mouvement

            # Message afficher sur le moniteur
            print("Aucun mouvement détecté.")
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
            gpio["c1_keypad"],  # ligne 0
            gpio["c2_keypad"],  # ligne 1
            gpio["c3_keypad"],  # ligne 2
            gpio["c4_keypad"]   # ligne 3
        ]

        # Les colonnes sont en entrée
        self.COLUMN_PINS = [
            gpio["r4_keypad"],  # colonne 0
            gpio["r3_keypad"],  # colonne 1
            gpio["r2_keypad"],  # colonne 2
            gpio["r1_keypad"]   # colonne 3
        ]

        # C'est la matrice des touches
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
            GPIO.setup(row, GPIO.OUT)   # On configure les lignes en sortie
            GPIO.output(row, GPIO.HIGH) # Les lignes sont tous à HIGH

        for col in self.COLUMN_PINS:
            # On configure tous les colonnes à HIGH et on utilise le pull up down interne
            GPIO.setup(col, GPIO.IN, pull_up_down=GPIO.PUD_UP)

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


class Controle_Acces:

    # Classe qui gère le PIN pour armer ou désarmer l'alarme

    def __init__(self, password):

        # Initialise avec le bon mot de passe

        self.password = password    # On stocke le bon mot de passe
        self.code = ""      # On stocke que l'utilisateur va pressé

    def add(self, key):

        # Fonction qui permet d'ajouter une touche pressée au code

        self.code += key    # Permet d'ajouter la touche pressée à la fin de chaque touche saisie

    def erase(self):

        # La fonction efface le code entré au complet

        self.code = ""  

    def verify(self):

        # La fonction vérifie si c'est le bon code qui a été saisie

        resultat = self.code == self.password
        self.code = ""  # Efface le code en mémoire

        return resultat     # Retourne Tue ou False dépendemment du résultat de la vérification

