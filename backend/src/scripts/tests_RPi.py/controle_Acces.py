import unittest
import sys

sys.path.insert(0, '../src')

from modules.model import Controle_Acces


class TestControleAcces(unittest.TestCase):
    
    def setUp(self):
        self.acces = Controle_Acces("1234")
        # Test bon code
    def test_correct_code(self):
        self.acces.add('1')
        self.acces.add('2')
        self.acces.add('3')
        self.acces.add('4')

        
        result = self.acces.verify()
        self.assertTrue(result)
        print("Code correct: RÉUSSI AVEC SUCCÈS")
    
    def test_wrong_code(self):
        # Testle mauvais code est rejeté
        self.acces.add('9')
        self.acces.add('9')
        self.acces.add('9')
        
        result = self.acces.verify()
        self.assertFalse(result)
        print("Mauvais code: RÉUSSI AVEC SUCCÈS")
    
    def test_code_erase(self):
        # Test le code peut être effacé
        self.acces.add('1')
        self.acces.add('2')
        self.acces.erase()
        
        self.assertEqual(self.acces.code, "")
        print("Code effacé: RÉUSSI AVEC SUCCÈS")
    
    def test_partial_code_wrong(self):
        # Test le code partiel est incorrect
        self.acces.add('1')
        self.acces.add('2')
        self.acces.add('3')
        
        result = self.acces.verify()
        self.assertFalse(result)
        print("Code partiel: RÉUSSI AVEC SUCCÈS")
    
    def test_code_cleared_after_verify(self):
        # Test le code est effacé après vérification"""
        self.acces.add('1')
        self.acces.add('2')
        self.acces.add('3')
        self.acces.add('4')
        
        self.acces.verify()
        self.assertEqual(self.acces.code, "")
        print("Le code est effacé après vérification: RÉUSSI AVEC SUCCÈS")
    
    def test_multiple_attempts(self):
        # Test plusieurs tentatives
        # Tentative 1: mauvais
        self.acces.add('9')
        result1 = self.acces.verify()
        self.assertFalse(result1)
        
        # Tentative 2: correct
        self.acces.add('1')
        self.acces.add('2')
        self.acces.add('3')
        self.acces.add('4')

        result2 = self.acces.verify()
        self.assertTrue(result2)
        
        print("Plusieurs tentatives: RÉUSSI AVEC SUCCÈS")
    
    def test_wrong_password_different(self):
        # Test différent code est rejeté
        acces2 = Controle_Acces("5678")
        acces2.add('1')
        acces2.add('2')
        acces2.add('3')
        acces2.add('4')
        
        result = acces2.verify()
        self.assertFalse(result)
        print("Mot de passe différent: RÉUSSI AVEC SUCCÈS")


if __name__ == '__main__':
    print("=====================================")
    print("Test: Controle Acces")
    print("=====================================")
        
    suite = unittest.TestLoader().loadTestsFromTestCase(TestControleAcces)
    unittest.TextTestRunner(verbosity=2).run(suite)