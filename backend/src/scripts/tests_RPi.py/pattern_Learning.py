import unittest
import sys
from datetime import datetime

sys.path.insert(0, '../src')

from modules.pattern_learning import PIRPatternLearner


class TestPatternLearning(unittest.TestCase):
    # Test: Pattern Learning - Calcul des patterns de mouvement
    
    def setUp(self):
        self.learner = PIRPatternLearner()
    
    def test_init_pattern_learner(self):
        # Test: PIRPatternLearner s'initialise
        self.assertIsNotNone(self.learner)
        print("Pattern Learner init: PASS")
    
    def test_readings_initialized_as_empty_list(self):
        # Test: readings est une liste vide au démarrage
        self.assertIsInstance(self.learner.readings, list)
        self.assertEqual(len(self.learner.readings), 0)
        print("Readings initialized empty: PASS")
    
    def test_add_motion_reading(self):
        # Test: Ajouter une lecture de mouvement
        timestamp = datetime.now()
        self.learner.add_motion_reading(True, timestamp)
        
        readings = self.learner.readings
        self.assertGreater(len(readings), 0)
        print("Add motion reading: PASS")
    
    def test_add_multiple_motion_readings(self):
        # Test: Ajouter plusieurs lectures
        for i in range(5):
            timestamp = datetime.now()
            self.learner.add_motion_reading(i % 2 == 0, timestamp)
        
        readings = self.learner.readings
        self.assertEqual(len(readings), 5)
        print("Add multiple readings: PASS")
    
    def test_get_pattern_for_hour(self):
        # Test: Récupérer le pattern pour une heure
        # Ajouter des lectures
        for hour in range(24):
            timestamp = datetime.now().replace(hour=hour, minute=0)
            motion = 1 if (8 <= hour <= 18) else 0
            self.learner.add_motion_reading(motion, timestamp)
        
        # Calculer les patterns
        self.learner.calculate_patterns()
        
        # Vérifier un pattern
        pattern = self.learner.get_pattern_for_hour(14)
        self.assertIsNotNone(pattern)
        print("Get pattern for hour: PASS")
    
    def test_should_trigger_alarm_with_motion_during_quiet(self):
        # Test: Alarme devrait être déclenchée
        pattern = {'ACTIVE': 0.1, 'QUIET': 0.9}
        
        # Motion pendant QUIET hour → devrait déclencher
        should_trigger = self.learner.should_trigger_alarm(
            motion_detected=True,
            pattern=pattern,
            armed=True
        )
        self.assertTrue(should_trigger)
        print("Should trigger alarm during quiet: PASS")
    
    def test_should_not_trigger_alarm_no_armed(self):
        # Test: Alarme ne devrait pas se déclencher si désarmé"""
        pattern = {'ACTIVE': 0.1, 'QUIET': 0.9}
        
        # Même avec mouvement, pas d'alarme si désarmé
        should_trigger = self.learner.should_trigger_alarm(
            motion_detected=True,
            pattern=pattern,
            armed=False
        )
        self.assertFalse(should_trigger)
        print("Should not trigger if disarmed: PASS")
    
    def test_should_not_trigger_alarm_no_motion(self):
        # Test: Alarme ne devrait pas se déclencher sans mouvement
        pattern = {'ACTIVE': 0.1, 'QUIET': 0.9}
        
        should_trigger = self.learner.should_trigger_alarm(
            motion_detected=False,
            pattern=pattern,
            armed=True
        )
        self.assertFalse(should_trigger)
        print("Should not trigger without motion: PASS")
    
    def test_calculate_patterns(self):
        # Test: Calculer les patterns
        # Ajouter des lectures
        for i in range(10):
            timestamp = datetime.now()
            self.learner.add_motion_reading(True, timestamp)
        
        # Calculer
        self.learner.calculate_patterns()
        
        # Vérifier que patterns existe
        self.assertGreater(len(self.learner.patterns), 0)
        print("Calculate patterns: PASS")
    
    def test_get_days_collected(self):
        # Test: Obtenir le nombre de jours collectés
        for i in range(5):
            timestamp = datetime.now()
            self.learner.add_motion_reading(True, timestamp)
        
        days = self.learner.get_days_collected()
        self.assertGreaterEqual(days, 0)
        print("Get days collected: PASS")
    
    def test_print_summary(self):
        # Test: Imprimer le résumé
        # Ajouter quelques lectures
        for i in range(10):
            timestamp = datetime.now()
            self.learner.add_motion_reading(i % 2 == 0, timestamp)
        
        # Ne doit pas crasher
        try:
            self.learner.print_summary()
            print("Print summary: PASS")
        except Exception as e:
            self.fail(f"print_summary failed: {e}")


if __name__ == '__main__':
    print("=====================================")
    print("Test: Pattern Learning")
    print("=====================================")
    
    
    suite = unittest.TestLoader().loadTestsFromTestCase(TestPatternLearning)
    unittest.TextTestRunner(verbosity=2).run(suite)