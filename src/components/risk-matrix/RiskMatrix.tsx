'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import { getMatrixPosition, getCellRiskLevel, getEntriesAtCell } from '@/lib/calculations';
import { t } from '@/lib/i18n';
import { ThreatEntry, RiskLevel } from '@/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RiskMatrixProps {
  onCellClick?: (x: number, y: number) => void;
  selectedCell?: { x: number; y: number } | null;
}

const CELL_COLORS: Record<RiskLevel, string> = {
  low: 'bg-green-200 hover:bg-green-300',
  medium: 'bg-yellow-200 hover:bg-yellow-300',
  high: 'bg-red-200 hover:bg-red-300',
};

const MARKER_COLORS: Record<RiskLevel, string> = {
  low: 'bg-green-600',
  medium: 'bg-yellow-600',
  high: 'bg-red-600',
};

export function RiskMatrix({ onCellClick, selectedCell }: RiskMatrixProps) {
  const { entries, language } = useRiskRegister();

  // Create 5x5 grid (x: impact 1-5, y: probability 1-5)
  const grid = [];
  for (let y = 5; y >= 1; y--) {
    const row = [];
    for (let x = 1; x <= 5; x++) {
      const cellLevel = getCellRiskLevel(x, y);
      const entriesInCell = getEntriesAtCell(entries, x, y);
      row.push({ x, y, level: cellLevel, entries: entriesInCell });
    }
    grid.push(row);
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-end justify-center gap-1 text-xs text-muted-foreground">
          <span className="w-8" />
          <span className="flex-1 text-center">
            {t('low', language)} ←── {t('impact', language)} ──→ {t('high', language)}
          </span>
        </div>

        <div className="flex">
          {/* Y-axis label */}
          <div className="flex w-8 flex-col items-center justify-center text-xs text-muted-foreground">
            <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
              {t('low', language)} ←── {t('probability', language)} ──→ {t('high', language)}
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-5 gap-1">
            {grid.flat().map((cell) => {
              const isSelected =
                selectedCell?.x === cell.x && selectedCell?.y === cell.y;

              return (
                <Tooltip key={`${cell.x}-${cell.y}`}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        'relative h-12 w-12 rounded transition-all',
                        CELL_COLORS[cell.level],
                        isSelected && 'ring-2 ring-primary ring-offset-2',
                        onCellClick && 'cursor-pointer'
                      )}
                      onClick={() => onCellClick?.(cell.x, cell.y)}
                    >
                      <AnimatePresence>
                        {cell.entries.map((entry, index) => (
                          <motion.div
                            key={entry.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                              'absolute h-4 w-4 rounded-full border-2 border-white shadow-sm',
                              MARKER_COLORS[cell.level]
                            )}
                            style={{
                              top: `${20 + (index % 3) * 12}%`,
                              left: `${20 + Math.floor(index / 3) * 25}%`,
                            }}
                          />
                        ))}
                      </AnimatePresence>
                      {cell.entries.length > 3 && (
                        <span className="absolute bottom-0 right-0 rounded-tl bg-black/50 px-1 text-xs text-white">
                          +{cell.entries.length - 3}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">
                        {t('probability', language)}: {cell.y}, {t('impact', language)}: {cell.x}
                      </p>
                      {cell.entries.length > 0 && (
                        <ul className="mt-1 list-inside list-disc">
                          {cell.entries.map((entry) => (
                            <li key={entry.id}>
                              {language === 'zh-TW' ? entry.name : (entry.nameEn || entry.name)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
