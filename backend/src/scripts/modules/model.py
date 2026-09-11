import logging


class Switch_State:  

    # Classe qui gère l'état en passant d'armé à désarmé et de l'alarme active à inactive

    def __init__(self):
        # Initialisation de l'état

        self.is_armed =False    # N'est pas armé au début
        self.is_alarming = False # L'alarme n'est pas déclenchée au début

    def arm(self):
        # Fonction qui arme 
        self.is_armed = True
        logging.info("Système armé")
        print("Système armé")

    def disarm(self):
        # Fonction qui désarme 
        self.is_armed = False
        logging.info("Système déasarmé")
        print("Système déasarmé")

    def trigger_alarm(self):
        # Fonction qui active l'alarme
        self.is_alarming = True
        logging.info("Alarme déclenchée")
        print("Alarme déclenchée")

    def stop_alarm(self):
        # Fonction qui désactive l'alarme 
        self.is_alarming = False
        logging.info("Alarme arrêtée")
        print("Alarme arrêtée")


class Controle_Acces:

    # Classe qui gère le PIN pour armer ou désarmer l'alarme

    def __init__(self, password):

        # Initialise avec le bon mot de passe

        self.password = password    # On stocke le bon mot de passe
        self.code = ""      # On stocke que l'utilisateur va pressé

    def add(self, key):

        # Fonction qui permet d'ajouter une touche pressée au code

        self.code += key    # Permet d'ajouter la touche pressée à la fin de chaque touche saisie
        logging.debug(f"Touche ajouté: {key}")

    def erase(self):

        # La fonction efface le code entré au complet

        self.code = ""  
        logging.debug("Le code a été effacé")

    def verify(self):

        # La fonction vérifie si c'est le bon code qui a été saisie

        resultat = self.code == self.password
        self.code = ""  # Efface le code en mémoire.

        if resultat:
            logging.info("Bon code!")
        else:
            logging.warning("Code erroné!")

        return resultat     # Retourne Tue ou False dépendemment du résultat de la vérification


class KeypadController:
    # La classe gère le clavier et la logique pour l'accès

    def __init__(self, alarm, screen, acces, system_state):
        # Initialisation de l'alarme, de l'affichage, de l'accès, et du changement d'état

        self.alarm = alarm
        self.screen = screen
        self.acces = acces
        self.system_state = system_state

        logging.info("Initialisation de l'alarme, de l'affichage, de l'accès, et du changement d'état")

    def key_pressed(self, key):
        # Fonction qui est appelé quand une touche est pressée

        self.alarm.sound_key()

        if key == "*" :
            self.acces.erase()
            self.screen.display_message("Code PIN effacé")
            logging.info("L'utilisateur a appuyé sur * pour effacer le code")


        elif key == "#":
            if self.acces.verify():
                logging.info("Code PIN valide -> Armer/ Désarmer")
                print("Le code PIN est valide")
                self.alarm.succes()

            else:
                self.screen.display_message("Erreur, mauvais code entré")
                logging.warning(" Accès refusé! Cause: mauvais code")
                print("Code PIN erroné")

        else:
            self.acces.add(key)

        logging.debug(f"Touche pressée: {key}")
        print(f"Touche: {key}")
