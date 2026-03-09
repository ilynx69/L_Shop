import { Cart } from '../types/index.js';

interface AppState {
    isAuthenticated: boolean;
    userId: string | null;
    cart: Cart | null;
}

let state: AppState = {
    isAuthenticated: false,
    userId: null,
    cart: null
};

const listeners: Array<(state: AppState) => void> = [];

export function getState(): AppState {
    return { ...state };
}

export function setState(newState: Partial<AppState>) {
    state = { ...state, ...newState };
    listeners.forEach(fn => fn(state));
}

export function subscribe(listener: (state: AppState) => void): () => void {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) listeners.splice(index, 1);
    };
}