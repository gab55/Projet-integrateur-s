import unittest
import sys

# Importer tous les tests
from test_gpio import TestGPIOSetup
from test_motion_sensor import TestMotionSensor
from test_keypad import TestKeypad
from test_switch_state import TestSwitchState
from test_controle_acces import TestControleAcces
from test_status_reporter import TestStatusReporter
from test_pattern_learning import TestPatternLearning


def run_all_tests():
# Permet d'exécuter tous les tests unitaires
    
    print("=====================================")
    print("Tests: SYSTEME D'ALARME")
    print("=====================================")
    
    # Créer une suite de tests
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Ajouter tous les tests
    test_cases = [
        TestGPIOSetup,
        TestMotionSensor,
        TestKeypad,
        TestSwitchState,
        TestControleAcces,
        TestStatusReporter,
        TestPatternLearning
    ]
    
    for test_case in test_cases:
        tests = loader.loadTestsFromTestCase(test_case)
        suite.addTests(tests)
    
    # Exécuter les tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Afficher le résumé
    print("\n" + "="*60)
    print("RÉSUMÉ DES TESTS")
    print("="*60)
    print(f"Tests exécutés: {result.testsRun}")
    print(f"Réussis: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Échoués: {len(result.failures)}")
    print(f"Erreurs: {len(result.errors)}")
    print("="*60 + "\n")
    
    if result.wasSuccessful():
        print("TOUS LES TESTS SONT PASSÉS! \n")
        return 0
    else:
        print("CERTAINS TESTS ONT ÉCHOUÉ!\n")
        return 1


def run_single_test(test_name):
    # Exécuter un test spécifique
    
    print("\n" + "="*60)
    print(f"TEST: {test_name}")
    print("="*60 + "\n")
    
    test_cases = {
        'gpio': TestGPIOSetup,
        'motion': TestMotionSensor,
        'keypad': TestKeypad,
        'state': TestSwitchState,
        'acces': TestControleAcces,
        'reporter': TestStatusReporter,
        'pattern': TestPatternLearning
    }
    
    if test_name.lower() not in test_cases:
        print(f"Test '{test_name}' non trouvé!")
        print(f"Tests disponibles: {', '.join(test_cases.keys())}")
        return 1
    
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(test_cases[test_name.lower()])
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    if result.wasSuccessful():
        print(f"\nTest '{test_name}' réussi!")
        return 0
    else:
        print(f"\nTest '{test_name}' échoué!")
        return 1


if __name__ == '__main__':
    if len(sys.argv) > 1:
        # Exécuter un test spécifique
        exit_code = run_single_test(sys.argv[1])
    else:
        # Exécuter tous les tests
        exit_code = run_all_tests()
    
    sys.exit(exit_code)