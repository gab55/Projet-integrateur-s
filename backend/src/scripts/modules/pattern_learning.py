from datetime import datetime, timedelta    # Import de l'heure et de la date
import logging      # Import de la journalisation

# Configuration de la journalisation
logging.basicConfig(level=logging.INFO, format='%(levelname)-8s | %(message)s')
logger = logging.getLogger(__name__)


class PIRPatternLearner:
    # Classe qui permet d'analyser et d'apprendre les patterns de mouvement du capteur.


    def __init__(self):
        # L'initialisation l'analyse et la collection des patterns

        self.readings = []  # Liste des états du capteur et de l'horodatage
        self.patterns = {}  # Dictionnaire des patterns analysés par heure
        logger.info("OK PIRPatternLearner initialized") # Journalisation de l'action

    def add_motion_reading(self, motion_detected, timestamp):
        # Fonction qui ajoute une lecture du capteur à la collection
        # Créer un dictionnaire qui contient la lecture
        self.readings.append({
            "motion": motion_detected,
            "timestamp": timestamp
        })
        logger.debug(f"Reading: motion={motion_detected}")  # Journalise de l'action


    def calculate_patterns(self):
        # Fonction fait l'analyse des lectures et créer les patterns par heure
        # Permet de vérifier si il y a des données à analyser
        if not self.readings:
            logger.warning("No readings to analyze!")   # Journalisation
            return
        
        hourly_data = {}    # Créer un dictionnaire pour acccumuler les données par heure

        # Parcourt tous les lectures qu'on a collecté
        for reading in self.readings:
            hour = reading["timestamp"].hour

            # Permet d'initialiser l'here si c'est la première heure de lecture
            if hour not in hourly_data:
                hourly_data[hour] = {"motions": 0, "total": 0}  # Compteur de mouvements et compteurs total de lectures

            # Parcourt chaque heure et calcule la fréquence de celle-ci
            hourly_data[hour]["total"] += 1
            if reading["motion"]:
                hourly_data[hour]["motions"] += 1
        # Permet la classification
        # Permet de classer l'heure selon la fréquence de mouvement
        for hour, data in hourly_data.items():
            frequency = data["motions"] / data["total"]
            
            if frequency >= 0.7:
                # Très actif -> ex:le jour
                classification = "HIGH_ACTIVITY"
            elif frequency >= 0.2:
                # Mouvement modéré -> ex:la fin de semaine
                classification = "MEDIUM_ACTIVITY"
            elif frequency > 0:
                # Peu actif -> ex:le soir apres 20h
                classification = "LOW_ACTIVITY"
            else:
                # Pas actif -> ex:la nuit
                classification = "NO_ACTIVITY"

            # Stocke le pattern calculé pour cette heure
            self.patterns[hour] = {
                "frequency": frequency,
                "classification": classification
            }

        # Permet de calculer la durée totale de données collectés
        days = self.get_days_collected()
        logger.info(f"Patterns calculated: {len(self.patterns)} hours over {days} days")    # Journalisation

    def should_trigger_alarm(self, motion_detected, pattern, armed=True):
        # Fonction qui décide si l'alarme doit être déclenchée selon le pattern
    
        # Si le système n'est pas armé, le pattern ne déclenche pas l'alrme
        if not armed:
            logger.debug("System disarmed - no alarm")
            return False

        # Vérifie si un mouvement a été capté
        # Si la féquence dépasse 0.2, l'alarme sera déclenchée
        if motion_detected and pattern.get("frequency", 0) < 0.2:
            logger.warning("ALARME DECLENCHEE! MOUVEMENT DURANT LES HEURES CALMES")
            return True
        # Sinon pas d'alarme
        return False

    def get_pattern_for_hour(self, hour):
        # Permet de récupérer le patten pour une heure spécifique

        # Si le pattern existe pour cette heure là
        if hour in self.patterns:
            # Retourne le patteern qui a été trouvée
            return self.patterns[hour]
        # Si il n'y a pas de pattern, ça retourne inconnu
        return {"frequency": 0, "classification": "UNKNOWN"}

    def get_all_patterns(self):
        # Fonction qui retourne tous les pattern calculés
        return self.patterns    # Retourne le dictionnaire stocké

    def get_days_collected(self):
        # Fonction qui permet de calculer le nombre de jours de données collectées.

        # Vérifie s'il y a des données
        if not self.readings:
            return 0
        
        first = self.readings[0]["timestamp"]   # Récupère l'horodatage de la première lecture
        last = self.readings[-1]["timestamp"]   # Récupère l'horodatage de la dernière lecture
        days = (last - first).days  # Calcule la différence en jours
        
        return days # Retoune les jours

    def reset(self):
        # Fonction qui permet de réinitialisé les données collectées
        self.readings = []  # Réinitialise les listes
        self.patterns = {}  # Réinitialise les dictionnaires
        logger.info("Data reset")   # Journalise l'action

    def print_summary(self):
        # Fonction qui affiche un petit résumé

        # Journalise le nombre d'heures total de lectures et la durée
        logger.info(f"Total: {len(self.readings)} readings over {self.get_days_collected()} days")
        # Journalise le nombres d'heures avec patterns
        logger.info(f"Patterns: {len(self.patterns)} hours\n")

        # Un tableau des patterns
        
        # Parcourt chaque heure de la journée en ordre croissant
        for hour in sorted(self.patterns.keys()):
            # Récuprère le pattern pour cette heure
            pattern = self.patterns[hour]

            # Convertit la fréquence en pourcentage
            freq_pct = int(pattern["frequency"] * 100)

            # Journalise en montrant l'heure formattée, la classification et le pourcentage
            logger.info(f"  {hour:2d}h: {pattern['classification']:16} ({freq_pct:3d}%)")
