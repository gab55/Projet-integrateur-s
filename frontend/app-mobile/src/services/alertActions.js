import api from '../api/apiClient';


export const createAlertActions= (dispatch) => {
    const actions = {
        alertList: async () => {
            try {
                const response = await api.get('/alerts');

                dispatch({ type: 'SET_ALERTS', alerts: response.data });

                return response.data;
            } catch (error) {
                console.error('Error fetching alert data:', error);
                dispatch({ type: 'FETCH_ALERTS_ERROR' });
            }
        },
        alertDetail: async (alarmId) => {
            try {
                const response = await api.get(`/alerts/${alarmId}`);

                return response.data;
            } catch (error) {
                console.error('Error fetching alert detail:', error);
            }
        },
        newAlert: async (data) => {
            /**
             * Add new alert
             * @param {Object} data - The user data for sensor.
             * @param Nip
             **/
            try {
                const response = await api.post(`/alerts/start`, {data});
                return response.data;

            } catch (error) {
                console.error('Error creating new alert:', error);
            }
        },
        modifyAlert: async ({alarmId, modifications}) => {
            /**
             * modify Sensor
             * @param {string} sensorId - the id of the sensor
             * @param {Object} modifications - the modifications to apply to the sensor
             **/
            try {
                const response = await api.post(`/alerts/${alarmId}/modify`, modifications);

                return response.data;
            } catch (error) {
                console.error('Erreur lors de la modification de l\'alarme:', error.message);
                throw error;
            }
        },
        resolveAlert: async ({alarmId , nip}) => {
            /**
             * resolve Alarm
             * @param {string} alarmId - the id of the alert
             **/
            try {
                const response = await api.post(`/alerts/${alarmId}/resolve`, {nip});
                return response.data;
            } catch (error) {
                console.error('Erreur lors de la résolution de l\'alarme:', error.message);
                throw error;
            }
        },
        statusAlert: async ({alarmId}) => {
            try {
                const response = await api.get(`/alerts/${alarmId}/status`);
                return response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération du statut de l\'alarme:', error.message);
                throw error;
            }
        }
    }
    return actions;
}