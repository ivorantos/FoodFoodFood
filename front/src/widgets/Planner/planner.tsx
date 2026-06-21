import { useState, useEffect } from 'react';
import {ChevronLeft, ChevronRight, ArrowLeftRight, Pencil, Trash2, RefreshCw} from 'lucide-react';

import { DAYS_ES } from './plannerHelper';
import type {MealType, Recipe, SelectedSlot} from '../../domain/model.types';
import SlotPicker from "./slotPicker";
import { usePlannerContext } from "./plannerContext";
import RecipeDetailModal from "../../components/RecipeDetailModal";
import PlannerDatePicker from "../../components/PlannerDatePicker";

const MEAL_LABEL: Record<MealType, string> = { lunch: 'Comida', dinner: 'Cena' };

const Planner = () => {
  const {
    days, selectedDay, setSelectedDay,
    weekPlan, selectedDayTotals, getDayTotals,
    clearSlot, weekOffset, setWeekOffset,
    assignRecipe, recipes,
    moveSource, startMove, cancelMove, confirmMove
  } = usePlannerContext();

  const [pickerPreselected, setPickerPreselected] = useState<string[]>([]);
  const [pickerSlot, setPickerSlot] = useState<SelectedSlot | null>(null);
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cancelMove(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelMove]);

  const dayIndex = (iso: string) => (new Date(iso).getDay() + 6) % 7;

  const handleSlotClick = (date: string, mealType: MealType) => {
    setPickerSlot({ date, mealType });
  };

  const openMoveItem = (date: string, mealType: MealType, index: number) => {
    startMove(date, mealType, [index]);
  };

  const openMoveSlot = (date: string, mealType: MealType) => {
    const count = (weekPlan[date][mealType].snapshot ?? []).length;
    if (count) startMove(date, mealType, Array.from({ length: count }, (_, i) => i));
  };

  return (
      <div style={{ minHeight: '100vh', background: '#111', color: '#fff' }}>
        <div style={{ padding: '32px 16px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>Plan Semanal</h1>



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

              const cardStyle = isSelected
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
          <div style={{ maxWidth: 1500, margin: '85px auto 0' }}>
            {(['lunch', 'dinner'] as MealType[]).map((mealType) => {
              const slot      = weekPlan[selectedDay][mealType];
              const isMoveSrc = moveSource?.date === selectedDay && moveSource?.mealType === mealType;

              const slotStyle = isMoveSrc
                  ? { background: '#2a1f00', border: '2px solid #FF9500' }
                  : { background: '#111', border: '1px solid rgba(255,255,255,0.08)' };

              return (
                  <div
                      key={mealType}
                      onClick={() => handleSlotClick(selectedDay, mealType)}
                      style={{ borderRadius: 12, padding: '16px 28px 28px', marginBottom: 28, cursor: 'pointer', transition: 'border 0.15s', minHeight: 200, ...slotStyle }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 45 }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{MEAL_LABEL[mealType]}</span>
                      {slot.snapshot && (
                          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>

                            <button onClick={(e) => {
                              e.stopPropagation();
                              openMoveSlot(selectedDay, mealType);
                            }} style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#aaa',
                              background: 'rgba(255,255,255,0.06)',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}>
                              <ArrowLeftRight size={15}/> Mover
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              clearSlot(selectedDay, mealType);
                            }} style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#ff4444',
                              background: 'rgba(255,68,68,0.1)',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}>
                              <Trash2 size={15}/> Quitar
                            </button>
                          </div>
                      )}
                    </div>
                    {slot.snapshot
                        ? <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                          {slot.snapshot.map((s, i) => (
                              <div key={`${s.id}-${i}`}
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     if (s.isCustom) return;
                                     const r = recipes.find(r => r.id === s.id);
                                     if (r) setDetailRecipe(r);
                                   }}
                                   style={{
                                     background: '#1a1a1a',
                                     border: '1px solid rgba(255,255,255,0.1)',
                                     borderRadius: 10,
                                     padding: '14px 20px',
                                     display: 'flex',
                                     alignItems: 'center',
                                     gap: 8,
                                     cursor: s.isCustom ? 'default' : 'pointer',
                                   }}>
                                <div style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  background: '#FF9500',
                                  flexShrink: 0
                                }}/>
                                <span style={{fontSize: 14, fontWeight: 600, color: '#fff'}}>{s.name}</span>
                                <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openMoveItem(selectedDay, mealType, i);
                                    }}
                                    title="Mover o copiar este item"
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#666',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: 6,
                                      marginLeft: 'auto',
                                      paddingLeft: 16,
                                      borderRadius: 6
                                    }}
                                >
                                  <RefreshCw size={16}/>
                                </button>
                              </div>
                          ))}
                        </div>
                        : <p style={{color: '#555', fontSize: 14, fontStyle: 'italic', margin: 0}}>
                          Sin asignar — pulsa para añadir
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
                preselected={weekPlan[pickerSlot.date][pickerSlot.mealType].snapshot ?? []}
                onSelect={(selected) => {
                  assignRecipe(pickerSlot.date, pickerSlot.mealType, selected);
                  setPickerSlot(null);
                }}
                onClose={() => setPickerSlot(null)}
            />
        )}

        {moveSource && (
            <PlannerDatePicker
                recipeName={
                  moveSource.indexes
                      .map(i => (weekPlan[moveSource.date][moveSource.mealType].snapshot ?? [])[i]?.name)
                      .filter(Boolean)
                      .join(', ')
                }
                singleDate
                showCopyToggle
                allowedDates={days}
                onConfirm={(dates, mealType, copy) => confirmMove(dates[0], mealType, copy ?? false)}
                onClose={cancelMove}
            />
        )}

        {detailRecipe && (
            <RecipeDetailModal
                isOpen={true}
                recipe={detailRecipe}
                mode="view"
                onClose={() => setDetailRecipe(null)}
            />
        )}
      </div>
  );
};

export default Planner;