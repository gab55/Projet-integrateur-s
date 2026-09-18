import unittest
import time
import RPi.GPIO as GPIO

 
 
class TestGPIOSetup(unittest.TestCase):
    
    def setUp(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
    
    def tearDown(self):
        GPIO.cleanup()
    
    def test_led_red_setup(self):
        GPIO.setup(5, GPIO.OUT)
        GPIO.output(5, GPIO.HIGH)
        self.assertEqual(GPIO.input(5), GPIO.HIGH)
        
        GPIO.output(5, GPIO.LOW)
        self.assertEqual(GPIO.input(5), GPIO.LOW)
        print("Test LED rouge: RÉUSSI AVEC SUCCÈS")
    
    def test_led_green_setup(self):
        GPIO.setup(22, GPIO.OUT)
        GPIO.output(22, GPIO.HIGH)
        self.assertEqual(GPIO.input(22), GPIO.HIGH)
        
        GPIO.output(22, GPIO.LOW)
        self.assertEqual(GPIO.input(22), GPIO.LOW)
        print("Test LED verte: RÉUSSI AVEC SUCCÈS")
    
    def test_buzzer_setup(self):
        GPIO.setup(27, GPIO.OUT)
        GPIO.output(27, GPIO.HIGH)
        self.assertEqual(GPIO.input(27), GPIO.HIGH)
        
        GPIO.output(27, GPIO.LOW)
        self.assertEqual(GPIO.input(27), GPIO.LOW)
        print("Test Buzzer: RÉUSSI AVEC SUCCÈS")


if __name__ == '__main__':
    print("=====================================")
    print("Test: GPIO")
    print("=====================================")
        
    suite = unittest.TestLoader().loadTestsFromTestCase(TestGPIOSetup)
    unittest.TextTestRunner(verbosity=2).run(suite)