import React, {useMemo, useReducer} from 'react';
import { createSensorActions } from "../services/sensorActions";


export const SensorContext = React.createContext(null);
export const SensorActionsContext = React.createContext(null);


export function useSensor() {
    return React.useContext(SensorContext);
}

export function useSensorActions() {
    return React.useContext(SensorActionsContext);
}

const initialState = {
    sensors: [],
    isLoading: true
};



export function sensorReducer (prevState, action) {
    /**
     * @param {Object} prevState
     * @param {Object} action
     * @param {string} action.type
     * @param {string|null} [action.token]
     */

    switch (action.type) {
        case 'SET_SENSORS':
            return {
                ...prevState,
                sensors: action.sensors,
                isLoading: false
            }
        case 'UPDATE_SENSORS_CONDITION':
            return {
                ...prevState,
                sensors: prevState.sensors.map(s =>
                    s._id === action.payload._id ? action.payload : s
                ),
                isLoading: false
            }
        case 'UPDATE_SENSOR_STATUS':
            return {
                ...prevState,
                isLoading: false,
                sensors: prevState.sensors.map(s =>
                    s._id?.toString() === action.payload._id?.toString() ? action.payload : s
                )
            }
        case 'FETCH_SENSORS_ERROR':
            return {
                ...prevState,
                sensors: [],
                isLoading: false
            }
        default:
            return prevState;
    }
}

export function SensorProvider({ children }) {
    const [state, dispatch] = useReducer(sensorReducer, initialState);

    const actions = useMemo(() => createSensorActions(dispatch), [dispatch]);

    return (
        <SensorContext.Provider value={state}>
            <SensorActionsContext.Provider value={actions}>
                {children}
            </SensorActionsContext.Provider>
        </SensorContext.Provider>
    );
}