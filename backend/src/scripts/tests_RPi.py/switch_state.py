import unittest
import sys

sys.path.insert(0, '../src')

from modules.model import Switch_State


class TestSwitchState(unittest.TestCase):
    """Test: Switch State - Arm/Disarm/Trigger Alarm"""
    
    def setUp(self):
        self.system_state = Switch_State()
    
    def test_initial_state_disarmed(self):
        """Test: État initial est désarmé"""
        self.assertFalse(self.system_state.is_armed)
        print("✅ Initial state (désarmé): PASS")
    
    def test_initial_alarm_not_triggered(self):
        """Test: L'alarme n'est pas déclenchée au démarrage"""
        self.assertFalse(self.system_state.is_alarming)
        print("✅ Initial alarm (not triggered): PASS")
    
    def test_arm_system(self):
        """Test: Armer le système"""
        self.system_state.arm()
        self.assertTrue(self.system_state.is_armed)
        print("✅ Arm system: PASS")
    
    def test_disarm_system(self):
        """Test: Désarmer le système"""
        self.system_state.arm()
        self.system_state.disarm()
        self.assertFalse(self.system_state.is_armed)
        print("✅ Disarm system: PASS")
    
    def test_trigger_alarm(self):
        """Test: Déclencher l'alarme"""
        self.system_state.trigger_alarm()
        self.assertTrue(self.system_state.is_alarming)
        print("✅ Trigger alarm: PASS")
    
    def test_stop_alarm(self):
        """Test: Arrêter l'alarme"""
        self.system_state.trigger_alarm()
        self.system_state.stop_alarm()
        self.assertFalse(self.system_state.is_alarming)
        print("✅ Stop alarm: PASS")
    
    def test_arm_then_trigger(self):
        """Test: Armer puis déclencher"""
        self.system_state.arm()
        self.assertTrue(self.system_state.is_armed)
        
        self.system_state.trigger_alarm()
        self.assertTrue(self.system_state.is_alarming)
        
        print("✅ Arm then trigger: PASS")
    
    def test_arm_disarm_arm_cycle(self):
        """Test: Cycle arm → disarm → arm"""
        # Arm
        self.system_state.arm()
        self.assertTrue(self.system_state.is_armed)
        
        # Disarm
        self.system_state.disarm()
        self.assertFalse(self.system_state.is_armed)
        
        # Arm again
        self.system_state.arm()
        self.assertTrue(self.system_state.is_armed)
        
        print("✅ Arm/Disarm/Arm cycle: PASS")


if __name__ == '__main__':
    print("=====================================")
    print("Test: Switch State")
    print("=====================================")
    
    suite = unittest.TestLoader().loadTestsFromTestCase(TestSwitchState)
    unittest.TextTestRunner(verbosity=2).run(suite)