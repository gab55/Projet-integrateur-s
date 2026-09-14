import api from '../api/apiClient';


export const createSensorActions= (dispatch) => {
    const actions = {
        sensorList: async () => {
            try {
                const response = await api.get('/sensors');


                dispatch({ type: 'SET_SENSORS', sensors: response.data });

                return response.data;
            } catch (error) {
                console.error('Error fetching sensor data:', error);
                dispatch({ type: 'FETCH_SENSORS_ERROR' });
            }
        },
        sensorHistory: async (sensorId) => {
            try {
                const response = await api.get(`/sensors/${sensorId}/history`);
                return response.data;
            } catch (error) {
                console.error('Error fetching sensor history:', error);
                return []
            }
        },
        sensorStatus: async (sensorId) => {
            try {
                const response = await api.get(`/sensors/${sensorId}/status`);
                dispatch({ type: 'UPDATE_SENSOR_STATUS', payload: response.data.sensor });

                return response.data;
            } catch (error) {
                console.error('Error fetching sensor status:', error);
            }
        },
        armSensor: async (sensorId, pin) => {
            try {
                const response = await api.post(`/sensors/${sensorId}/arm`, { code: pin });
                dispatch({ type: 'UPDATE_SENSOR_STATUS', payload: response.data.sensor });

                return response.data;
            } catch (error) {
                console.error('Error arming sensor:', error);
            }
        },
        disarmSensor: async (sensorId, pin) => {
            try {
                const response = await api.post(`/sensors/${sensorId}/disarm`, { code: pin });
                dispatch({ type: 'UPDATE_SENSOR_STATUS', payload: response.data.sensor });

                return response.data;
            } catch (error) {
                console.error('Error disarming sensor:', error);
            }
        },

        sensorDetail: async (sensorId) => {
            try {
                const response = await api.get(`/sensors/${sensorId}/info`);

                return response.data;
            } catch (error) {
                console.error('Error fetching sensor detail:', error);
            }
        },
        newSensor: async (data) => {
            /**
             * Add new sensor
             * @param {Object} data - The user data for sensor.
             **/
            try {
                const response = await api.post(`/sensors/newSensor`, {data});
                return response.data;

            } catch (error) {
                console.error('Error creating new sensor:', error);
            }
        },
        modifySensor: async ({sensorId, modifications}) => {
            /**
             * modify Sensor
             * @param {string} sensorId - the id of the sensor
             * @param {Object} modifications - the modifications to apply to the sensor
             **/
            try {
                const response = await api.post(`/sensors/${sensorId}/modify`, modifications);

                return response.data;
            } catch (error) {
                console.error('Erreur lors de la modification du capteur:', error.message);
                throw error;
            }
        },
        removeSensor: async (sensorId) => {
            /**
             * remove Sensor
             * @param {string} sensorId - the id of the sensor
             **/
            try {
                const response = await api.post(`/sensors/${sensorId}/remove`, {});
                return response.data;
            } catch (error) {
                console.error('Erreur lors de la suppression du capteur:', error.message);
                throw error;
            }
        },
    }
    return actions;
}