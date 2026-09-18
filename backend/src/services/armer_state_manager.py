import socketio # synchronisation en temps réel avec le backend en utilisant WebSocket
import logging  # Importer la journalisation

class ArmStateManager:
    # Classe qui gère l'état d'armement et qui synchronise l'état du RPI.GPIO avec le backend via WebSocket
    def __init__(self, building_id, backend_url):
        # Fonction permet de changer le système par le Raspberry, par le backend et par l'application mobile

        # Initialise l'état
        self.building_id = building_id  # # Stocke l'identifiant du bâtiment

        self.sio = socketio.Client()    # Créer le client Websocket

        self.is_armed = False   # Au départ, le système est désarmé
        
        # Quand le backend envoie un ARM
        @self.sio.on('alarm:armed')
        def on_armed(data):
            logging.info(f"📡 Reçu: ARMED du backend")
            self.is_armed = True
        
        # Quand le backend envoie un DISARM
        @self.sio.on('alarm:disarmed')
        def on_disarmed(data):
            logging.info(f"📡 Reçu: DISARMED du backend")
            self.is_armed = False
        
        # Connecter au backend
        self.sio.connect(f"{backend_url}")
    
    def is_system_armed(self):
        # Fonction qui retourne l'état en ce moment
        return self.is_armed