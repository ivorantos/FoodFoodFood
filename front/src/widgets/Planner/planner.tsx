import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeftRight, Pencil, Trash2 } from 'lucide-react';

import { DAYS_ES } from './plannerHelper';
import type { MealType, SelectedSlot } from '../../domain/model.types';
import SlotPicker from "./slotPicker";
import { usePlannerContext } from "./plannerContext";

const MEAL_LABEL: Record<MealType, string> = { lunch: 'Comida', dinner: 'Cena' };

const Planner = () => {
  const {
    days, selectedDay, setSelectedDay,
    weekPlan, selectedDayTotals, getDayTotals,
    clearSlot, weekOffset, setWeekOffset,
    assignRecipe, recipes,
    swapSource, startSwap, cancelSwap, confirmSwap
  } = usePlannerContext();

  const [pickerPreselected, setPickerPreselected] = useState<string[]>([]);
  const [pickerSlot, setPickerSlot] = useState<SelectedSlot | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cancelSwap(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelSwap]);

  const dayIndex = (iso: string) => (new Date(iso).getDay() + 6) % 7;

  const handleSlotClick = (date: string, mealType: MealType) => {
    const slot = weekPlan[date][mealType];
    if (swapSource) {
      if (swapSource.date === date && swapSource.mealType === mealType) {
        cancelSwap();
      } else {
        confirmSwap(date, mealType);
      }
      return;
    }
    if (!slot.snapshot) {
      setPickerSlot({ date, mealType });
    }
  };

  return (
      <div style={{ minHeight: '100vh', background: '#111', color: '#fff' }}>
        <div style={{ padding: '32px 16px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>Plan Semanal</h1>

            {swapSource && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2a1f00', color: '#FF9500', padding: '6px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
                  <ArrowLeftRight size={14} />
                  Elige destino o pulsa Esc para cancelar
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setWeekOffset(weekOffset - 1)} style={{ padding: 8, borderRadius: 8, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setWeekOffset(0)} style={{ padding: '6px 12px', borderRadius: 8, background: '#FF9500', color: '#000', fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none' }}>
                Hoy
              </button>
              <button onClick={() => setWeekOffset(weekOffset + 1)} style={{ padding: 8, borderRadius: 8, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Carrusel días */}
          <div style={{ display: 'flex', gap: 8, width: '100%', marginBottom: 32 }}>
            {days.map((iso) => {
              const totals     = getDayTotals(iso);
              const isSelected = selectedDay === iso;
              const isSwapSrc  = swapSource?.date === iso;

              const cardStyle = isSwapSrc
                  ? { background: '#2a1f00', border: '2px solid #FF9500' }
                  : isSelected
                      ? { background: '#FF9500', border: '2px solid transparent' }
                      : { background: '#1a1a1a', border: '2px solid rgba(255,255,255,0.06)' };

              const textColor     = isSelected ? '#000' : '#fff';
              const subTextColor  = isSelected ? 'rgba(0,0,0,0.6)' : '#aaa';

              return (
                  <div
                      key={iso}
                      onClick={() => setSelectedDay(iso)}
                      style={{ flex: 1, cursor: 'pointer', transform: isSelected ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.15s' }}
                  >
                    <div style={{ borderRadius: 8, padding: 16, height: 128, boxSizing: 'border-box', ...cardStyle }}>
                      <div style={{ fontSize: 13, fontWeight: 500, textAlign: 'center', marginBottom: 4, color: textColor }}>{DAYS_ES[dayIndex(iso)]}</div>
                      <div style={{ fontSize: 11, textAlign: 'center', marginBottom: 8, color: subTextColor }}>
                        {new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </div>
                      <div style={{ fontSize: 13, textAlign: 'center', fontWeight: 600, color: textColor }}>{totals.calorias} kcal</div>
                      <div style={{ fontSize: 11, textAlign: 'center', marginTop: 8, color: subTextColor }}>
                        {[weekPlan[iso].lunch, weekPlan[iso].dinner].filter((s) => s.snapshot).length}/2
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>

          {/* Detalle día */}
          <div style={{ background: '#1a1a1a',
            borderRadius: 12,
            padding: '36px 48px',
            marginBottom: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            maxWidth: 900,
            margin: '0 auto 24px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{DAYS_ES[dayIndex(selectedDay)]}</h2>
                <p style={{ color: '#aaa', fontSize: 13, margin: '4px 0 0' }}>{selectedDay}</p>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#FF9500' }}>{selectedDayTotals.calorias} kcal</div>
            </div>

            {/* Macros */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#111', borderRadius: 8, padding: 8, textAlign: 'center', flex: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ff6b6b' }}>{selectedDayTotals.proteinas}g</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>Proteínas</div>
              </div>
              <div style={{ background: '#111', borderRadius: 8, padding: 8, textAlign: 'center', flex: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#FF9500' }}>{selectedDayTotals.carbohidratos}g</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>Carbohidratos</div>
              </div>
              <div style={{ background: '#111', borderRadius: 8, padding: 8, textAlign: 'center', flex: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#6bcb77' }}>{selectedDayTotals.grasas}g</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>Grasas</div>
              </div>
            </div>

            {/* Slots */}
            {(['lunch', 'dinner'] as MealType[]).map((mealType) => {
              const slot      = weekPlan[selectedDay][mealType];
              const isSwapSrc = swapSource?.date === selectedDay && swapSource?.mealType === mealType;
              const isSwapDst = !!swapSource && !(swapSource.date === selectedDay && swapSource.mealType === mealType);

              const slotStyle = isSwapSrc
                  ? { background: '#2a1f00', border: '2px solid #FF9500' }
                  : isSwapDst
                      ? { background: '#0d1a2a', border: '2px solid rgba(255,149,0,0.4)' }
                      : { background: '#111', border: '1px solid rgba(255,255,255,0.08)' };

              return (
                  <div
                      key={mealType}
                      onClick={() => handleSlotClick(selectedDay, mealType)}
                      style={{
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 16,
                        cursor: 'pointer',
                        transition: 'border 0.15s',
                        minHeight: 100, ...slotStyle
                      }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 12
                    }}>
                      <span style={{fontWeight: 600, color: '#fff'}}>{MEAL_LABEL[mealType]}</span>
                      {slot.snapshot && !swapSource && (
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              const ids = weekPlan[selectedDay][mealType].snapshot?.map(s => s.id) ?? [];
                              setPickerPreselected(ids);
                              setPickerSlot({date: selectedDay, mealType});
                            }} style={{
                              fontSize: 12,
                              color: '#FF9500',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}>
                              <Pencil size={12}/> Cambiar
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              startSwap({date: selectedDay, mealType});
                            }} style={{
                              fontSize: 12,
                              color: '#aaa',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              marginLeft: 8
                            }}>
                              <ArrowLeftRight size={12}/> Mover
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              clearSlot(selectedDay, mealType);
                            }} style={{
                              fontSize: 12,
                              color: '#ff4444',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              marginLeft: 8
                            }}>
                              <Trash2 size={12}/> Quitar
                            </button>
                          </div>
                      )}
                    </div>
                    {slot.snapshot
                        ? <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                          {slot.snapshot.map((s) => (
                              <div key={s.id} style={{
                                background: '#1a1a1a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10,
                                padding: '8px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                              }}>
                                <div style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  background: '#FF9500',
                                  flexShrink: 0
                                }}/>
                                <span style={{fontSize: 14, fontWeight: 600, color: '#fff'}}>{s.name}</span>
                              </div>
                          ))}
                        </div>
                        : <p style={{color: '#555', fontSize: 14, fontStyle: 'italic', margin: 0}}>
                          {swapSource ? 'Pulsa aquí para mover aquí' : 'Sin asignar — pulsa para añadir'}
                        </p>
                    }
                  </div>
              );
            })}
          </div>

        </div>

        {pickerSlot && (
            <SlotPicker
                recipes={recipes}
                preselectedIds={pickerPreselected}
                onSelect={(selected) => {
                  assignRecipe(pickerSlot.date, pickerSlot.mealType, selected);
                  setPickerSlot(null);
                  setPickerPreselected([]);
                }}
                onClose={() => {
                  setPickerSlot(null);
                  setPickerPreselected([]);
                }}
            />
        )}
      </div>
  );
};

export default Planner;