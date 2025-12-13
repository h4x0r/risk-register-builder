'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { RiskRegisterStore, ThreatEntry } from '@/types';
import { DEFAULT_ENTRY_VALUES } from '@/lib/constants';

export const useRiskRegister = create<RiskRegisterStore>()(
  persist(
    (set) => ({
      // State
      entries: [],
      language: 'zh-TW',

      // Actions
      addEntry: (entry: ThreatEntry) => {
        set((state) => ({
          entries: [...state.entries, entry],
        }));
      },

      updateEntry: (id: string, updates: Partial<ThreatEntry>) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
      },

      removeEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      setLanguage: (lang) => {
        set({ language: lang });
      },

      reset: () => {
        set({
          entries: [],
        });
      },
    }),
    {
      name: 'risk-register-storage',
      partialize: (state) => ({
        entries: state.entries,
        language: state.language,
      }),
    }
  )
);

// Helper to add a custom threat
export function createCustomEntry(name: string, nameEn?: string): ThreatEntry {
  return {
    id: uuidv4(),
    name,
    nameEn,
    category: 'custom',
    ...DEFAULT_ENTRY_VALUES,
  };
}
