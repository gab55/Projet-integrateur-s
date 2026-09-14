import React, {useMemo, useReducer} from 'react';
import { createAlertActions } from "../services/alertActions";

export const AlertContext = React.createContext(null);
export const AlertActionsContext = React.createContext(null);


export function useAlert() {
    return React.useContext(AlertContext);
}

export function useAlertActions() {
    return React.useContext(AlertActionsContext);
}

const initialState = {
    alerts: [],
    isLoading: true
};



export function alertReducer (prevState, action) {
    /**
     * @param {Object} prevState
     * @param {Object} action
     * @param {string} action.type
     * @param {string|null} [action.token]
     */

    switch (action.type) {
        case 'SET_ALERTS':
            return {
                ...prevState,
                alerts: action.alerts,
                isLoading: false
            }
        case 'UPDATE_ALERT_CONDITION':
            return {
                ...prevState,
                alerts: prevState.alerts.map(s =>
                    s._id === action.payload._id ? action.payload : s
                ),
                isLoading: false
            }
        case 'UPDATE_ALERT_STATUS':
            return {
                ...prevState,
                isLoading: false,
                alerts: prevState.alerts.map(s =>
                    s._id?.toString() === action.payload._id?.toString() ? action.payload : s
                )
            };
        case 'FETCH_ALERTS_ERROR':
            return {
                ...prevState,
                list: [],
                isLoading: false
            }
        default:
            return prevState;
    }
}

export function AlertProvider({ children }) {
    const [state, dispatch] = useReducer(alertReducer, initialState);

    const actions = useMemo(() => createAlertActions(dispatch), [dispatch]);

    return (
        <AlertContext.Provider value={state}>
            <AlertActionsContext.Provider value={actions}>
                {children}
            </AlertActionsContext.Provider>
        </AlertContext.Provider>
    );
}
