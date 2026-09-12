from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)-8s | %(message)s')
logger = logging.getLogger(__name__)


class PIRPatternLearner:
    """
    Apprend les patterns de mouvement d'un capteur PIR
    
    Phases:
    1. COLLECTE: add_motion_reading()
    2. ANALYSE: calculate_patterns()
    3. DETECTION: should_trigger_alarm()
    """

    def __init__(self):
        self.readings = []
        self.patterns = {}
        logger.info("OK PIRPatternLearner initialized")

    def add_motion_reading(self, motion_detected, timestamp):
        """Ajouter une lecture de mouvement"""
        self.readings.append({
            "motion": motion_detected,
            "timestamp": timestamp
        })
        logger.debug(f"Reading: motion={motion_detected}")

    def calculate_patterns(self):
        """Analyser et creer patterns par heure"""
        if not self.readings:
            logger.warning("No readings to analyze!")
            return
        
        hourly_data = {}
        
        for reading in self.readings:
            hour = reading["timestamp"].hour
            
            if hour not in hourly_data:
                hourly_data[hour] = {"motions": 0, "total": 0}
            
            hourly_data[hour]["total"] += 1
            if reading["motion"]:
                hourly_data[hour]["motions"] += 1
        
        for hour, data in hourly_data.items():
            frequency = data["motions"] / data["total"]
            
            if frequency >= 0.7:
                classification = "HIGH_ACTIVITY"
            elif frequency >= 0.2:
                classification = "MEDIUM_ACTIVITY"
            elif frequency > 0:
                classification = "LOW_ACTIVITY"
            else:
                classification = "NO_ACTIVITY"
            
            self.patterns[hour] = {
                "frequency": frequency,
                "classification": classification
            }
        
        days = self.get_days_collected()
        logger.info(f"Patterns calculated: {len(self.patterns)} hours over {days} days")

    def should_trigger_alarm(self, motion_detected, pattern, armed=True):
        """Decider si alarme doit declencher"""
        if not armed:
            logger.debug("System disarmed - no alarm")
            return False
        
        if motion_detected and pattern.get("frequency", 0) < 0.2:
            logger.warning("ALARM TRIGGERED! Motion during quiet hour")
            return True
        
        return False

    def get_pattern_for_hour(self, hour):
        """Recuperer pattern d'une heure"""
        if hour in self.patterns:
            return self.patterns[hour]
        
        return {"frequency": 0, "classification": "UNKNOWN"}

    def get_all_patterns(self):
        """Retourner tous les patterns"""
        return self.patterns

    def get_days_collected(self):
        """Calculer jours de donnees collectees"""
        if not self.readings:
            return 0
        
        first = self.readings[0]["timestamp"]
        last = self.readings[-1]["timestamp"]
        days = (last - first).days
        
        return days

    def reset(self):
        """Reinitialiser les donnees"""
        self.readings = []
        self.patterns = {}
        logger.info("Data reset")

    def print_summary(self):
        """Afficher resume des patterns"""
        logger.info(f"Total: {len(self.readings)} readings over {self.get_days_collected()} days")
        logger.info(f"Patterns: {len(self.patterns)} hours\n")
        
        for hour in sorted(self.patterns.keys()):
            pattern = self.patterns[hour]
            freq_pct = int(pattern["frequency"] * 100)
            logger.info(f"  {hour:2d}h: {pattern['classification']:16} ({freq_pct:3d}%)")
