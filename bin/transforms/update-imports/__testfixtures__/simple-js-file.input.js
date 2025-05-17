import { getInitialStates } from '@dytesdk/ui-kit';
import { create } from 'zustand';

export const useStatesStore = create((set) => ({
  states: getInitialStates(),
  setStates: (states) => set({ states }),
}));

export const useCustomStatesStore = create((set) => ({
  states: {},
  setCustomStates: (states) => set({ states }),
}));
