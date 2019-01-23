import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Axios from 'axios';
import { REQUEST, SUCCESS } from '../utils/action-type-util';

export const ACTION_TYPES = {
    FETCH_WEATHER_FORECASTS: 'WEATHER_FORECASTS/FETCH',
};

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface WeatherForecastsState {
    isLoading: boolean;
    startDateIndex?: number;
    forecasts: WeatherForecast[];
}

export interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.


// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestWeatherForecasts: (startDateIndex: number) => (dispatch, getState) => {
        if (startDateIndex === getState().weatherForecasts.startDateIndex) {
            return;
        }
            const task = Axios.get(`api/SampleData/WeatherForecasts?startDateIndex=${ startDateIndex }`);
            addTask(task);
            dispatch ({ 
                type: ACTION_TYPES.FETCH_WEATHER_FORECASTS, 
                meta: {
                    startDateIndex: startDateIndex,
                },
                payload: task
            });
    }
};

const unloadedState: WeatherForecastsState = { forecasts: [], isLoading: false };

export const reducer: Reducer<WeatherForecastsState> = (state: WeatherForecastsState = unloadedState, incomingAction) => {
    const action = incomingAction;// as KnownAction;
    switch (action.type) {
        case REQUEST(ACTION_TYPES.FETCH_WEATHER_FORECASTS):
            return {
                startDateIndex: action.meta.startDateIndex,
                forecasts: state.forecasts,
                isLoading: true
            };
        case SUCCESS(ACTION_TYPES.FETCH_WEATHER_FORECASTS):
            if (action.meta.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.meta.startDateIndex,
                    forecasts: action.payload.data,
                    isLoading: false
                };
            }
            break;
    }

    return state || unloadedState;
};
