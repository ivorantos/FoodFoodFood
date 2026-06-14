import { useState, useEffect, useRef } from 'react';
import { Shuffle, X, Check, Clock, AlertTriangle, HelpCircle } from 'lucide-react';
import type { Recipe, RecipeSnapshot } from '../../domain/model.types';
import { RecipeType } from '../../domain/model.types';

const C = {
    bg:        '#161616',
    surface:   '#222222',
    surface2:  '#2c2c2c',
    border:    'rgba(255,255,255,0.08)',
    border2:   'rgba(255,255,255,0.13)',
    text:      '#efefef',
    textMuted: '#888',
    accent:    '#FF9500',
    accentDim: 'rgba(255,149,0,0.13)',
};

const ALL_TYPES = Object.values(RecipeType);
const TYPES_OFF_BY_DEFAULT = new Set<string>(['SN', 'DS', 'AC']);
const TYPE_LABELS: Record<string, string> = {
    PR: 'Primero', SG: 'Segundo', AC: 'Acomp.',
    PU: 'Plato único', CN: 'Cena', DS: 'Postre', SN: 'Snack',
};

interface Props {
    recipes:      Recipe[];
    onSelect:     (recipes: RecipeSnapshot[]) => void;
    onClose:      () => void;
    preselected?: RecipeSnapshot[];
}

const MAX_SELECT = 3;

const parseMainIngredient = (raw?: string | null): string => {
    if (!raw) return '';
    try {
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.join(' · ') : raw;
    } catch { return raw; }
};

const RecipePopover = ({ recipe }: { recipe: Recipe }) => {
    const mainIng  = parseMainIngredient(recipe.mainIngredient);
    const contexts = recipe.context?.map(c => c.context).join(', ');
    const steps    = recipe.recipe
        ? recipe.recipe.split('\n').filter(s => s.trim()).slice(0, 4)
        : [];
    const totalSteps = recipe.recipe ? recipe.recipe.split('\n').filter(s => s.trim()).length : 0;

    return (
        <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', right: 36, top: 0, zIndex: 10, width: 260, background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.6)', padding: '12px 14px' }}
        >
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{recipe.name}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 8px', marginBottom: 10 }}>
                {recipe.type && (
                    <span style={{ fontSize: 11, color: C.accent, background: 'rgba(255,149,0,0.1)', borderRadius: 4, padding: '1px 5px' }}>
                        {TYPE_LABELS[recipe.type] ?? recipe.type}
                    </span>
                )}
                {contexts && <span style={{ fontSize: 11, color: C.textMuted }}>{contexts}</span>}
                {mainIng   && <span style={{ fontSize: 11, color: C.textMuted }}>{mainIng}</span>}
                {recipe.prepTime != null && (
                    <span style={{ fontSize: 11, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={10} /> {recipe.prepTime} min
                    </span>
                )}
            </div>

            {recipe.requiresPrevDay && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, padding: '3px 7px', background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.2)', borderRadius: 6 }}>
                    <AlertTriangle size={10} color={C.accent} />
                    <span style={{ fontSize: 11, color: C.accent }}>Preparar el día anterior</span>
                </div>
            )}

            {steps.length > 0 && (
                <div style={{ marginBottom: recipe.ingredients ? 8 : 0 }}>
                    <p style={{ margin: '0 0 5px', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pasos</p>
                    {steps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: C.accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>
                                {step.length > 80 ? step.slice(0, 80) + '…' : step}
                            </span>
                        </div>
                    ))}
                    {totalSteps > 4 && (
                        <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>
                            + {totalSteps - 4} pasos más…
                        </p>
                    )}
                </div>
            )}

            {recipe.ingredients && (
                <div>
                    <p style={{ margin: '0 0 4px', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ingredientes</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.textMuted, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                        {recipe.ingredients.length > 120 ? recipe.ingredients.slice(0, 120) + '…' : recipe.ingredients}
                    </p>
                </div>
            )}
        </div>
    );
};

const SlotPicker = ({ recipes, onSelect, onClose, preselected = [] }: Props) => {
    const [query,       setQuery]       = useState('');
    const [customText,  setCustomText]  = useState('');
    const [activeTypes, setActiveTypes] = useState<Set<string>>(
        new Set(ALL_TYPES.filter(t => !TYPES_OFF_BY_DEFAULT.has(t)))
    );
    const [basket,     setBasket]     = useState<RecipeSnapshot[]>(preselected);
    const [popoverId,  setPopoverId]  = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (popoverId) setPopoverId(null); else onClose(); } };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose, popoverId]);

    const filtered = recipes.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) &&
        (r.type == null || activeTypes.has(r.type))
    );

    const basketIds = new Set(basket.filter(b => !b.isCustom).map(b => b.id));
    const isFull    = basket.length >= MAX_SELECT;

    const toggleRecipe = (r: Recipe) => {
        if (basketIds.has(r.id)) {
            setBasket(prev => prev.filter(b => b.id !== r.id));
        } else if (!isFull) {
            setBasket(prev => [...prev, { id: r.id, name: r.name, imageUrl: null, isCustom: false }]);
        }
    };

    const addCustom = () => {
        const trimmed = customText.trim();
        if (!trimmed || isFull) return;
        setBasket(prev => [...prev, { id: crypto.randomUUID(), name: trimmed, imageUrl: null, isCustom: true }]);
        setCustomText('');
    };

    const removeFromBasket = (id: string) => setBasket(prev => prev.filter(b => b.id !== id));

    const pickRandom = () => {
        if (isFull) return;
        const available = filtered.filter(r => !basketIds.has(r.id));
        if (!available.length) return;
        const r = available[Math.floor(Math.random() * available.length)];
        setBasket(prev => [...prev, { id: r.id, name: r.name, imageUrl: null, isCustom: false }]);
    };

    const handleAdd = () => {
        if (!basket.length) return;
        onSelect(basket);
        onClose();
    };

    const toggleType = (t: string) => {
        setActiveTypes(prev => {
            const next = new Set(prev);
            next.has(t) ? next.delete(t) : next.add(t);
            return next;
        });
    };

    return (
        <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
            onClick={onClose}
        >
            <div
                style={{ background: C.bg, borderRadius: 18, border: `1px solid ${C.border2}`, boxShadow: '0 32px 80px rgba(0,0,0,0.7)', width: 'min(96vw, 680px)', maxHeight: '56vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar receta..."
                        style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 8, padding: '6px 10px', color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                    />
                    <button onClick={pickRandom} disabled={isFull} title="Receta aleatoria" style={{ width: 30, height: 30, borderRadius: 8, background: C.accentDim, border: `1px solid rgba(255,149,0,0.25)`, color: isFull ? C.textMuted : C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isFull ? 'not-allowed' : 'pointer', flexShrink: 0, opacity: isFull ? 0.4 : 1 }}>
                        <Shuffle size={14} />
                    </button>
                    <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: C.surface, border: `1px solid ${C.border2}`, color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <X size={14} />
                    </button>
                </div>

                {/* ── Filtros tipo ── */}
                <div style={{ display: 'flex', gap: 5, padding: '7px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0, flexWrap: 'wrap' }}>
                    {ALL_TYPES.map(t => {
                        const on = activeTypes.has(t);
                        return (
                            <button key={t} onClick={() => toggleType(t)} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: `1px solid ${on ? C.accent : C.border2}`, background: on ? C.accentDim : 'transparent', color: on ? C.accent : C.textMuted, cursor: 'pointer', fontFamily: 'inherit' }}>
                                {TYPE_LABELS[t]}
                            </button>
                        );
                    })}
                </div>

                {/* ── Texto libre ── */}
                <div style={{ display: 'flex', gap: 6, padding: '8px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <input
                        value={customText}
                        onChange={e => setCustomText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') addCustom(); }}
                        placeholder={isFull ? 'Slot lleno (máx. 3)' : 'Añadir texto libre...'}
                        disabled={isFull}
                        style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 8, padding: '6px 10px', color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit', opacity: isFull ? 0.5 : 1 }}
                    />
                    <button
                        onClick={addCustom}
                        disabled={!customText.trim() || isFull}
                        style={{ padding: '6px 12px', borderRadius: 8, background: customText.trim() && !isFull ? C.accent : C.surface2, border: 'none', color: customText.trim() && !isFull ? '#000' : C.textMuted, fontWeight: 700, fontSize: 13, cursor: customText.trim() && !isFull ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
                    >
                        + Añadir
                    </button>
                </div>

                {/* ── Basket ── */}
                {basket.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, padding: '7px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: C.textMuted, marginRight: 2 }}>{basket.length}/{MAX_SELECT}</span>
                        {basket.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 4, background: item.isCustom ? C.surface2 : C.accentDim, border: `1px solid ${item.isCustom ? C.border2 : 'rgba(255,149,0,0.3)'}`, borderRadius: 6, padding: '3px 8px' }}>
                                <span style={{ fontSize: 12, color: item.isCustom ? C.textMuted : C.accent, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                                <button onClick={() => removeFromBasket(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 0, display: 'flex', alignItems: 'center' }}>
                                    <X size={11} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Lista ── */}
                <ul style={{ overflowY: 'auto', flex: 1, padding: '6px 8px', margin: 0, listStyle: 'none' }}>
                    {filtered.length === 0 && (
                        <li style={{ textAlign: 'center', color: C.textMuted, padding: '24px 0', fontSize: 13 }}>Sin resultados</li>
                    )}
                    {filtered.map(r => {
                        const isSelected = basketIds.has(r.id);
                        const isDisabled = !isSelected && isFull;
                        const isPopped   = popoverId === r.id;
                        const mainIng    = parseMainIngredient(r.mainIngredient);
                        const contexts   = r.context?.map(c => c.context).join(', ');

                        return (
                            <li key={r.id} style={{ marginBottom: 4, position: 'relative' }}>
                                <div
                                    onClick={() => !isDisabled && toggleRecipe(r)}
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 10px', borderRadius: 10, background: isSelected ? C.accentDim : C.surface, border: isSelected ? `1px solid rgba(255,149,0,0.3)` : `1px solid ${C.border}`, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.45 : 1, transition: 'background 0.12s' }}
                                >
                                    {/* Checkbox */}
                                    <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${isSelected ? C.accent : C.border2}`, background: isSelected ? C.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                        {isSelected && <Check size={11} color="#000" strokeWidth={3} />}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: isDisabled ? C.textMuted : C.text, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {r.name}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '3px 8px', marginTop: 4 }}>
                                            {mainIng && <span style={{ fontSize: 11, color: C.textMuted }}>{mainIng}</span>}
                                            {r.type && (
                                                <span style={{ fontSize: 11, color: C.accent, background: 'rgba(255,149,0,0.1)', borderRadius: 4, padding: '1px 5px' }}>
                                                    {TYPE_LABELS[r.type] ?? r.type}
                                                </span>
                                            )}
                                            {contexts && <span style={{ fontSize: 11, color: C.textMuted }}>{contexts}</span>}
                                            {r.prepTime != null && (
                                                <span style={{ fontSize: 11, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <Clock size={10} /> {r.prepTime} min
                                                </span>
                                            )}
                                        </div>
                                        {r.requiresPrevDay && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5, padding: '3px 7px', background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.2)', borderRadius: 6, width: 'fit-content' }}>
                                                <AlertTriangle size={10} color={C.accent} />
                                                <span style={{ fontSize: 11, color: C.accent }}>Preparar el día anterior</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón ? */}
                                    <button
                                        onClick={e => { e.stopPropagation(); setPopoverId(isPopped ? null : r.id); }}
                                        style={{ width: 22, height: 22, borderRadius: 6, background: isPopped ? C.accentDim : 'transparent', border: `1px solid ${isPopped ? C.accent : C.border2}`, color: isPopped ? C.accent : C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}
                                    >
                                        <HelpCircle size={12} />
                                    </button>
                                </div>

                                {isPopped && <RecipePopover recipe={r} />}
                            </li>
                        );
                    })}
                </ul>

                {/* ── Pie ── */}
                <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <button
                        onClick={handleAdd}
                        disabled={basket.length === 0}
                        style={{ width: '100%', padding: '10px 0', borderRadius: 10, background: basket.length > 0 ? C.accent : C.surface2, border: 'none', color: basket.length > 0 ? '#000' : C.textMuted, fontWeight: 700, fontSize: 14, cursor: basket.length > 0 ? 'pointer' : 'not-allowed', transition: 'background 0.15s', fontFamily: 'inherit' }}
                    >
                        {basket.length > 0 ? `Confirmar (${basket.length})` : 'Selecciona algo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotPicker;