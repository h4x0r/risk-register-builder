'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRiskRegister } from '@/hooks/useRiskRegister';
import {
  getMatrixPosition,
  getResidualMatrixPosition,
  getCellRiskLevel,
  calculateRiskLevel,
  riskLevelForScore,
  calculateInherentThreat,
  calculateResidualRisk,
} from '@/lib/calculations';
import { t } from '@/lib/i18n';
import { ThreatEntry, RiskLevel } from '@/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type MatrixMode = 'inherent' | 'residual';

interface RiskMatrixProps {
  mode?: MatrixMode;
  onCellClick?: (x: number, y: number) => void;
  selectedCell?: { x: number; y: number } | null;
  entries?: ThreatEntry[];
}

/**
 * Severity is ordered, so the cells are tinted steps of one validated colour each
 * rather than arbitrary hues. color-mix against the card surface means the tints
 * follow the surface into dark mode instead of needing a second hand-tuned set.
 */
const CELL_TINT: Record<RiskLevel, string> = {
  low: 'color-mix(in oklab, var(--risk-low) 14%, var(--card))',
  medium: 'color-mix(in oklab, var(--risk-medium) 16%, var(--card))',
  high: 'color-mix(in oklab, var(--risk-high) 18%, var(--card))',
};

const MARKER_COLOR: Record<RiskLevel, string> = {
  low: 'var(--risk-low)',
  medium: 'var(--risk-medium)',
  high: 'var(--risk-high)',
};

/**
 * Severity is never carried by colour alone: each band also has a letter, so the
 * grid survives colour-blindness, greyscale printing and forced-colours mode.
 */
const BAND_MARK: Record<RiskLevel, string> = { low: 'L', medium: 'M', high: 'H' };

export function RiskMatrix({
  mode = 'inherent',
  onCellClick,
  selectedCell,
  entries: propEntries,
}: RiskMatrixProps) {
  const { entries: storeEntries, language } = useRiskRegister();
  const entries = propEntries ?? storeEntries;

  const positionOf = mode === 'residual' ? getResidualMatrixPosition : getMatrixPosition;
  const levelOf = (entry: ThreatEntry): RiskLevel =>
    mode === 'residual'
      ? calculateRiskLevel(entry)
      : riskLevelForScore(calculateInherentThreat(entry));
  const scoreOf = (entry: ThreatEntry) =>
    mode === 'residual' ? calculateResidualRisk(entry) : calculateInherentThreat(entry);

  const cells = [];
  for (let y = 5; y >= 1; y--) {
    for (let x = 1; x <= 5; x++) {
      const level = getCellRiskLevel(x, y);
      const occupants = entries.filter((entry) => {
        const pos = positionOf(entry);
        return pos.x === x && pos.y === y;
      });
      cells.push({ x, y, level, occupants });
    }
  }

  const name = (entry: ThreatEntry) =>
    language === 'zh-TW' ? entry.name : entry.nameEn || entry.name;

  return (
    <TooltipProvider delayDuration={120}>
      <figure className="m-0 w-full">
        <div className="flex">
          {/* Probability axis */}
          <div className="mr-1.5 flex w-4 shrink-0 items-center justify-center">
            <span
              className="whitespace-nowrap text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {t('probability', language)} →
            </span>
          </div>

          {/* min-0 lets the grid actually take the width the card gives it; without
              it the aspect-square cells collapse to nothing. */}
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-5 gap-[3px]">
              {cells.map((cell) => {
                const isSelected = selectedCell?.x === cell.x && selectedCell?.y === cell.y;
                const shown = cell.occupants.slice(0, 4);
                const overflow = cell.occupants.length - shown.length;

                return (
                  <Tooltip key={`${cell.x}-${cell.y}`}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={`${t('impact', language)} ${cell.x}, ${t('probability', language)} ${cell.y} — ${cell.occupants.length}`}
                        className={cn(
                          'relative aspect-square w-full rounded-[3px] ring-offset-1 ring-offset-card transition-transform',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          onCellClick ? 'cursor-pointer hover:scale-[1.06]' : 'cursor-default',
                          isSelected && 'ring-2 ring-primary'
                        )}
                        style={{ background: CELL_TINT[cell.level] }}
                        onClick={() => onCellClick?.(cell.x, cell.y)}
                      >
                        {/* Band letter: the redundant encoding behind the tint. */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-[3px] top-[1px] font-mono text-[8px] font-semibold opacity-35"
                        >
                          {BAND_MARK[cell.level]}
                        </span>

                        <AnimatePresence>
                          {shown.map((entry, index) => (
                            <motion.span
                              key={entry.id}
                              layout
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 380, damping: 26, delay: index * 0.04 }}
                              className="absolute h-[9px] w-[9px] rounded-full ring-2 ring-card"
                              style={{
                                background: MARKER_COLOR[levelOf(entry)],
                                left: `${24 + (index % 2) * 36}%`,
                                top: `${24 + Math.floor(index / 2) * 36}%`,
                              }}
                            />
                          ))}
                        </AnimatePresence>

                        {overflow > 0 && (
                          <span className="absolute bottom-0 right-[2px] font-mono text-[8px] font-semibold text-foreground/70">
                            +{overflow}
                          </span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-56">
                      <p className="font-mono text-[11px]">
                        {t('impact', language)} {cell.x} · {t('probability', language)} {cell.y}
                      </p>
                      {cell.occupants.length > 0 ? (
                        <ul className="mt-1 space-y-0.5">
                          {cell.occupants.map((entry) => (
                            <li key={entry.id} className="text-xs">
                              {name(entry)}
                              <span className="ml-1 font-mono opacity-70">
                                {scoreOf(entry).toFixed(1)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-0.5 text-xs opacity-70">{t('emptyCell', language)}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Impact axis */}
            <div className="mt-1 text-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t('impact', language)} →
            </div>
          </div>
        </div>
      </figure>
    </TooltipProvider>
  );
}

/** Shared legend. One per matrix pair, since both grids use the same bands. */
export function RiskMatrixLegend({ className }: { className?: string }) {
  const language = useRiskRegister((state) => state.language);
  const levels: RiskLevel[] = ['low', 'medium', 'high'];
  const label: Record<RiskLevel, 'lowRisk' | 'mediumRisk' | 'highRisk'> = {
    low: 'lowRisk',
    medium: 'mediumRisk',
    high: 'highRisk',
  };

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', className)}>
      {levels.map((level) => (
        <li key={level} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-[2px]"
            style={{ background: MARKER_COLOR[level] }}
          />
          <span className="font-mono text-[9px] opacity-60">{BAND_MARK[level]}</span>
          {t(label[level], language)}
        </li>
      ))}
    </ul>
  );
}
