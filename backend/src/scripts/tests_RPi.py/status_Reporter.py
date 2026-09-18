import unittest
import sys

sys.path.insert(0, '../src')

from services.status_reporter import init_status_reporter, get_status_reporter


class TestStatusReporter(unittest.TestCase):
    # Test: Status Reporter - Envoi des données au backend
    
    def setUp(self):
        self.status_reporter = init_status_reporter(
            building_id="test_bld_123",
            backend_url="http://backend.local:3000",
            api_key="rpi_key_xyz"
        )
    
    def test_status_reporter_init(self):
        # Test: Status reporter s'initialise
        self.assertIsNotNone(self.status_reporter)
        print("Status Reporter init: PASS")
    
    def test_update_gpio_state_motion(self):
        # Test: Mettre à jour l'état motion
        self.status_reporter.update_gpio_state('motion', True)
        state = self.status_reporter.get_gpio_state()
        self.assertTrue(state['motion'])
        print("Update motion state: PASS")
    
    def test_update_gpio_state_led_red(self):
        # Test: Mettre à jour l'état LED rouge
        self.status_reporter.update_gpio_state('led_red', True)
        state = self.status_reporter.get_gpio_state()
        self.assertTrue(state['led_red'])
        print("Update led_red state: PASS")
    
    def test_update_gpio_state_led_green(self):
        # Test: Mettre à jour l'état LED verte
        self.status_reporter.update_gpio_state('led_green', True)
        state = self.status_reporter.get_gpio_state()
        self.assertTrue(state['led_green'])
        print("Update led_green state: PASS")
    
    def test_update_gpio_state_buzzer(self):
        # Test: Mettre à jour l'état buzzer
        self.status_reporter.update_gpio_state('buzzer', True)
        state = self.status_reporter.get_gpio_state()
        self.assertTrue(state['buzzer'])
        print("Update buzzer state: PASS")
    
    def test_update_gpio_state_system_armed(self):
        # Test: Mettre à jour l'état armé
        self.status_reporter.update_gpio_state('system_armed', True)
        state = self.status_reporter.get_gpio_state()
        self.assertTrue(state['system_armed'])
        print("Update system_armed state: PASS")
    
    def test_get_gpio_state_all_fields(self):
        # Test: Récupérer tous les états
        state = self.status_reporter.get_gpio_state()
        
        self.assertIn('motion', state)
        self.assertIn('led_red', state)
        self.assertIn('led_green', state)
        self.assertIn('buzzer', state)
        self.assertIn('system_armed', state)
        self.assertIn('keypad_code', state)
        
        print("Get all GPIO states: PASS")
    
    def test_multiple_state_updates(self):
        # Test: Mettre à jour plusieurs états
        self.status_reporter.update_gpio_state('motion', True)
        self.status_reporter.update_gpio_state('led_red', True)
        self.status_reporter.update_gpio_state('buzzer', True)
        self.status_reporter.update_gpio_state('system_armed', True)
        
        state = self.status_reporter.get_gpio_state()
        
        self.assertTrue(state['motion'])
        self.assertTrue(state['led_red'])
        self.assertTrue(state['buzzer'])
        self.assertTrue(state['system_armed'])
        
        print("Multiple state updates: PASS")
    
    def test_state_toggle(self):
        # Test: Toggler les états
        # Set to True
        self.status_reporter.update_gpio_state('motion', True)
        state1 = self.status_reporter.get_gpio_state()
        self.assertTrue(state1['motion'])
        
        # Set to False
        self.status_reporter.update_gpio_state('motion', False)
        state2 = self.status_reporter.get_gpio_state()
        self.assertFalse(state2['motion'])
        
        print("State toggle: PASS")
    
    def test_get_status_reporter_singleton(self):
        # Test: get_status_reporter retourne la même instance
        reporter1 = get_status_reporter()
        reporter2 = get_status_reporter()
        
        self.assertIs(reporter1, reporter2)
        print("Status reporter singleton: PASS")


if __name__ == '__main__':
    print("=====================================")
    print("Test: Status Reporter")
    print("=====================================")
    
    suite = unittest.TestLoader().loadTestsFromTestCase(TestStatusReporter)
    unittest.TextTestRunner(verbosity=2).run(suite)