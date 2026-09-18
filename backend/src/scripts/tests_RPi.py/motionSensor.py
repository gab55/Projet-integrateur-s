import unittest
import RPi.GPIO as GPIO
import sys
import yaml

sys.path.insert(0, '../src')

from modules.gpio_adapter import MotionSensor
from modules.model import Switch_State


class TestMotionSensor(unittest.TestCase):
    """Test: Motion Sensor - Détection de mouvement"""
    
    def setUp(self):
        with open('../config.yaml', 'r') as f:
            self.config = yaml.safe_load(f)
        
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        self.system_state = Switch_State()
    
    def tearDown(self):
        GPIO.cleanup()
    
    def test_motion_sensor_init(self):
        """Test: Motion sensor s'initialise sans erreur"""
        try:
            motion_sensor = MotionSensor(
                self.config,
                screen=None,
                switch_state=self.system_state,
                alarm=None
            )
            self.assertIsNotNone(motion_sensor)
            print("Motion Sensor Init: PASS")
        except Exception as e:
            self.fail(f"Motion Sensor init failed: {e}")
    
    def test_motion_last_state_initialized(self):
        # Test: Motion sensor has last_state attribute
        motion_sensor = MotionSensor(
            self.config,
            screen=None,
            switch_state=self.system_state,
            alarm=None
        )
        self.assertIsNotNone(motion_sensor.last_state)
        self.assertFalse(motion_sensor.last_state)  # Should start as False
        print("Motion last_state initialized: PASS")
    
    def test_motion_sensor_pin_configured(self):
        # Test: Motion sensor pin est configuré
        motion_sensor = MotionSensor(
            self.config,
            screen=None,
            switch_state=self.system_state,
            alarm=None
        )
        self.assertEqual(motion_sensor.sensor_pin, self.config["sensor"]["pir_motion_sensor"])
        print("Motion sensor pin configured: PASS")
    
    def test_motion_state_count_initialized(self):
        # Test: state_count est initialisé à 0
        motion_sensor = MotionSensor(
            self.config,
            screen=None,
            switch_state=self.system_state,
            alarm=None
        )
        self.assertEqual(motion_sensor.state_count, 0)
        print("Motion state_count initialized: PASS")


if __name__ == '__main__':

    print("=====================================")
    print("Test: Motion Sensor")
    print("=====================================")
    
    suite = unittest.TestLoader().loadTestsFromTestCase(TestMotionSensor)
    unittest.TextTestRunner(verbosity=2).run(suite)