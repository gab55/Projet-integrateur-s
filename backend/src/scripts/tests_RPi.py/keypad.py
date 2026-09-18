import unittest
import RPi.GPIO as GPIO
import sys
import yaml

sys.path.insert(0, '../src')

from modules.gpio_adapter import Keypad


class TestKeypad(unittest.TestCase):
    # Test Keypad - Détection des touches
    
    def setUp(self):
        with open('../config.yaml', 'r') as f:
            self.config = yaml.safe_load(f)
        
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
    
    def tearDown(self):
        GPIO.cleanup()
    
    def test_keypad_init(self):
        #Test: Keypad s'initialise sans erreur
        try:
            keypad = Keypad(self.config, screen=None)
            self.assertIsNotNone(keypad)
            print("Initialisation du clavier: RÉUSSI AVEC SUCCÈS")
        except Exception as e:
            self.fail(f"Initialisation du clavier a échoué: {e}")
    
    def test_keypad_pins_configured(self):
        # Test Pins du clavier sont configurés
        keypad = Keypad(self.config, screen=None)
        self.assertEqual(len(keypad.ROW_PINS), 4)
        self.assertEqual(len(keypad.COLUMN_PINS), 4)
        print("Pins du clavier configuré: RÉUSSI AVEC SUCCÈS")
    
    def test_keypad_has_keymap(self):
        # Test Keypad a une keymap
        keypad = Keypad(self.config, screen=None)
        self.assertEqual(len(keypad.KEYMAP), 4)
        for row in keypad.KEYMAP:
            self.assertEqual(len(row), 4)
        print("Keypad keymap: RÉUSSI AVEC SUCCÈS")
    
    def test_keypad_keymap_values(self):
        # Test Keypad keymap contient les bonnes valeurs"""
        keypad = Keypad(self.config, screen=None)
        
        expected = [
            ['1', '2', '3', 'A'],
            ['4', '5', '6', 'B'],
            ['7', '8', '9', 'C'],
            ['*', '0', '#', 'D']
        ]
        
        self.assertEqual(keypad.KEYMAP, expected)
        print("Valeur Keypad keymap: RÉUSSI AVEC SUCCÈS")


if __name__ == '__main__':
    print("=====================================")
    print("Test: keypad")
    print("=====================================")
    
    suite = unittest.TestLoader().loadTestsFromTestCase(TestKeypad)
    unittest.TextTestRunner(verbosity=2).run(suite)