'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { RiskRegisterStore, ThreatEntry } from '@/types';
import { THREAT_PRESETS, DEFAULT_ENTRY_VALUES } from '@/lib/constants';

export const useRiskRegister = create<RiskRegisterStore>()(
  persist(
    (set, get) => ({
      // State
      entries: [],
      viewMode: 'wizard',
      language: 'zh-TW',
      currentStep: 1,
      selectedPresets: [],

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

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      setLanguage: (lang) => {
        set({ language: lang });
      },

      setStep: (step) => {
        set({ currentStep: step });
      },

      togglePreset: (presetId: string) => {
        set((state) => {
          const isSelected = state.selectedPresets.includes(presetId);
          return {
            selectedPresets: isSelected
              ? state.selectedPresets.filter((id) => id !== presetId)
              : [...state.selectedPresets, presetId],
          };
        });
      },

      clearSelectedPresets: () => {
        set({ selectedPresets: [] });
      },

      createEntriesFromPresets: () => {
        const { selectedPresets, entries } = get();
        const existingIds = entries.map((e) => e.id);

        const newEntries: ThreatEntry[] = [];

        for (const presetId of selectedPresets) {
          if (existingIds.includes(presetId)) continue;

          const preset = THREAT_PRESETS.find((p) => p.id === presetId);
          if (!preset) continue;

          newEntries.push({
            id: presetId,
            name: preset.nameZh,
            nameEn: preset.nameEn,
            category: preset.category,
            ...DEFAULT_ENTRY_VALUES,
          });
        }

        set((state) => ({
          entries: [...state.entries, ...newEntries],
          selectedPresets: [],
        }));
      },

      reset: () => {
        set({
          entries: [],
          viewMode: 'wizard',
          currentStep: 1,
          selectedPresets: [],
        });
      },
    }),
    {
      name: 'risk-register-storage',
      partialize: (state) => ({
        entries: state.entries,
        viewMode: state.viewMode,
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
