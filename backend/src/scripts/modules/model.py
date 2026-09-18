import logging      # Importer le module de journalisation
from services.status_reporter import get_status_reporter    # Importer le status reporter




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

        try:
            # Notifie le backend du changement d'état
            status_reporter = get_status_reporter()
            status_reporter.update_gpio_state('system_armed', True)
        except Exception as e:
            logging.debug(f"Erreur update system_armed: {e}")

    def disarm(self):
        # Fonction qui désarme 
        self.is_armed = False
        logging.info("Système déasarmé")
        print("Système déasarmé")

        try:
            # Notifie le backend du changement d'état
            status_reporter = get_status_reporter()
            status_reporter.update_gpio_state('system_armed', True)
        except Exception as e:
            logging.debug(f"Erreur update system_armed: {e}")

    def trigger_alarm(self):
        # Fonction qui active l'alarme
        self.is_alarming = True
        logging.info("Alarme déclenchée")
        print("Alarme déclenchée")

        try:
            # Notifie le backend du changement d'état
            status_reporter = get_status_reporter()
            status_reporter.update_gpio_state('system_armed', True)
        except Exception as e:
            logging.debug(f"Erreur update system_armed: {e}")

    def stop_alarm(self):
        # Fonction qui désactive l'alarme 
        self.is_alarming = False
        logging.info("Alarme arrêtée")
        print("Alarme arrêtée")

        try:
            # Notifie le backend du changement d'état
            status_reporter = get_status_reporter()
            status_reporter.update_gpio_state('system_armed', True)
        except Exception as e:
            logging.debug(f"Erreur update system_armed: {e}")


class Controle_Acces:

    # Classe qui gère le PIN pour armer ou désarmer l'alarme

    def __init__(self, password):

        # Initialise avec le bon mot de passe

        self.password = password    # On stocke le bon mot de passe
        self.code = ""      # On stocke que l'utilisateur va pressé

    def add(self, key):

        # Fonction qui permet d'ajouter une touche pressée au code

        self.code += key    # Permet d'ajouter la touche pressée à la fin de chaque touche saisie
        code_display = "*" * len(self.code)     # Affiche **** sur le screen LCD quand on compose le code
        logging.debug(f"Touche ajouté: {key}")

    def erase(self):

        # La fonction efface le code entré au complet
        self.code = ""  
        logging.debug("Le code a été effacé")  # Journalise l'action

    def verify(self):

        # La fonction vérifie si c'est le bon code qui a été saisie

        resultat = self.code == self.password   # Compare le code entré et le bon code  
        self.code = ""  # Efface le code en mémoire.

        if resultat:
            logging.info("Bon code!")   # Journalise l'action
        else:
            logging.warning("Code erroné!")  # Journalise l'action

        return resultat     # Retourne Tue ou False dépendemment du résultat de la vérification


class KeypadController:
    # La classe gère le clavier et la logique pour l'accès

    def __init__(self, alarm, screen, acces, system_state):
        # Initialisation de l'alarme, de l'affichage, de l'accès, et du changement d'état

        self.alarm = alarm  # Permet de faire fonctionner les LED et le buzzer
        self.screen = screen    #Affiche les messages
        self.acces = acces  # Vérifie le code PIN
        self.system_state = system_state    # Permet de connaitre l'état du système

        # Journalise l'action
        logging.info("Initialisation de l'alarme, de l'affichage, de l'accès, et du changement d'état")

    def key_pressed(self, key):
        # Fonction qui est appelé quand une touche est pressée

        self.alarm.sound_key()  # Fait un bip court pour confirmer qu'un bouton a été pressé

        if key == "*" :     # Touche pour effacer
            self.acces.erase()  
            self.screen.display_message("CODE PIN", "EFFACE")   # Affiche sur l'écran LCD
            logging.info("L'utilisateur a appuyé sur * pour effacer le code")  # Journalise l'action


        elif key == "#":        # Touche pour valider le code
            if self.acces.verify():     # Si le code est vérifier
                logging.info("Code PIN valide -> Armer/ Désarmer")  # Journalise l'action
                print("Le code PIN est valide")     # Affiche dans le terminal
                self.alarm.succes()     # Exécute l'action

            else:
                self.screen.display_message("ERREUR", "MAUVAIS CODE")   # Affiche sur l'écran LCD
            if self.acces.verify():     # Si le code est vérifier
                logging.warning(" Accès refusé! Cause: mauvais code")   # Journalise l'action
                print("Code PIN erroné")    # Affiche dans le terminal

        else:
            self.acces.add(key) # Ajoute une touche si ce n'est pas * ou #

        logging.debug(f"Touche pressée: {key}") # Journalise la touche
        print(f"Touche: {key}")     # Affiche dans le terminal la touche
