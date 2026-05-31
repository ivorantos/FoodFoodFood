import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import {MealType} from "../domain/model.types";

const C = {
    bg:        '#161616',
    surface:   '#222222',
    surface2:  '#2c2c2c',
    border:    'rgba(255,255,255,0.08)',
    border2:   'rgba(255,255,255,0.13)',
    text:      '#efefef',
    textMuted: '#888',
    accent:    '#FF9500',
    accentDim: 'rgba(255,149,0,0.18)',
    red:       '#ff4444',
};

const DAYS_HEADER = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function toISO(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function buildCalendarDays(year: number, month: number): (string | null)[] {
    const firstDay = new Date(year, month, 1);
    // lunes = 0 ... domingo = 6
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(toISO(new Date(year, month, d)));
    }
    return cells;
}

interface Props {
    recipeName: string;
    onConfirm: (dates: string[], mealType: MealType) => void;
    onClose: () => void;
}

const PlannerDatePicker = ({ recipeName, onConfirm, onClose }: Props) => {
    const today = new Date();
    const [viewYear, setViewYear]   = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selected, setSelected]   = useState<Set<string>>(new Set());
    const [mealType, setMealType]   = useState<MealType>('lunch');

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const cells = buildCalendarDays(viewYear, viewMonth);
    const todayISO = toISO(today);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    const toggleDay = (iso: string) => {
        if (iso < todayISO) return; // no permitir días pasados
        setSelected(prev => {
            const next = new Set(prev);
            next.has(iso) ? next.delete(iso) : next.add(iso);
            return next;
        });
    };

    const handleConfirm = () => {
        if (!selected.size) return;
        onConfirm(Array.from(selected).sort(), mealType);
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: C.bg, border: `1px solid ${C.border2}`,
                    borderRadius: 20, padding: 24, width: 340,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                            <CalendarDays size={15} color={C.accent} />
                            <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                Añadir al Planner
                            </span>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: 0, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {recipeName}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 2 }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Selector comida/cena */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {(['lunch', 'dinner'] as MealType[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setMealType(t)}
                            style={{
                                flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                border: `1px solid ${mealType === t ? C.accent : C.border2}`,
                                background: mealType === t ? C.accentDim : C.surface,
                                color: mealType === t ? C.accent : C.textMuted,
                                transition: 'all 0.15s',
                            }}
                        >
                            {t === 'lunch' ? '☀️ Comida' : '🌙 Cena'}
                        </button>
                    ))}
                </div>

                {/* Navegación mes */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 4 }}>
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                        {MONTHS_ES[viewMonth]} {viewYear}
                    </span>
                    <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 4 }}>
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Cabecera días */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
                    {DAYS_HEADER.map(d => (
                        <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: C.textMuted, paddingBottom: 6 }}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grid días */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
                    {cells.map((iso, i) => {
                        if (!iso) return <div key={`empty-${i}`} />;
                        const isPast    = iso < todayISO;
                        const isToday   = iso === todayISO;
                        const isSel     = selected.has(iso);
                        return (
                            <button
                                key={iso}
                                onClick={() => toggleDay(iso)}
                                disabled={isPast}
                                style={{
                                    aspectRatio: '1',
                                    borderRadius: 8,
                                    border: isToday && !isSel ? `1px solid ${C.accent}` : '1px solid transparent',
                                    background: isSel ? C.accent : 'transparent',
                                    color: isPast ? '#444' : isSel ? '#000' : C.text,
                                    fontSize: 13,
                                    fontWeight: isSel || isToday ? 700 : 400,
                                    cursor: isPast ? 'default' : 'pointer',
                                    transition: 'background 0.1s',
                                }}
                            >
                                {parseInt(iso.slice(8))}
                            </button>
                        );
                    })}
                </div>

                {/* Resumen selección */}
                <div style={{ minHeight: 20, marginTop: 12, fontSize: 12, color: C.textMuted, textAlign: 'center' }}>
                    {selected.size > 0
                        ? `${selected.size} día${selected.size > 1 ? 's' : ''} seleccionado${selected.size > 1 ? 's' : ''}`
                        : 'Toca los días que quieras'}
                </div>

                {/* Botón confirmar */}
                <button
                    onClick={handleConfirm}
                    disabled={selected.size === 0}
                    style={{
                        marginTop: 14, width: '100%', padding: '12px 0',
                        borderRadius: 12, border: 'none', cursor: selected.size ? 'pointer' : 'default',
                        background: selected.size ? C.accent : C.surface2,
                        color: selected.size ? '#000' : '#555',
                        fontSize: 14, fontWeight: 800,
                        transition: 'background 0.15s',
                    }}
                >
                    Asignar
                </button>
            </div>
        </div>
    );
};

export default PlannerDatePicker;