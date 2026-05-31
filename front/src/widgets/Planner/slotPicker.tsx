import { useState, useEffect, useRef } from 'react';
import { Shuffle, X, ChevronDown, ChevronRight, Check } from 'lucide-react';
import type { Recipe } from '../../domain/model.types';

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

interface Props {
    recipes:            Recipe[];
    onSelect:           (recipes: Recipe[]) => void;  // array
    onClose:            () => void;
    preselectedRecipe?: Recipe | null;
}

const MAX_SELECT = 3;

const SlotPicker = ({ recipes, onSelect, onClose, preselectedRecipe }: Props) => {
    const [query,    setQuery]    = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [selected, setSelected] = useState<string[]>(
        preselectedRecipe ? [preselectedRecipe.id] : []
    );
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const filtered = recipes.filter((r) =>
        r.name.toLowerCase().includes(query.toLowerCase())
    );

    const pickRandom = () => {
        if (!recipes.length) return;
        const r = recipes[Math.floor(Math.random() * recipes.length)];
        onSelect([r]);
        onClose();
    };

    const toggleSelect = (id: string) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : prev.length < MAX_SELECT ? [...prev, id] : prev
        );
    };

    const handleAdd = () => {
        const picked = recipes.filter(r => selected.includes(r.id));
        onSelect(picked);
        onClose();
    };

    const getPreview = (r: Recipe) => {
        const src = r.notes || r.recipe || '';
        return src.length > 110 ? src.slice(0, 110) + '…' : src || 'Sin descripción.';
    };

    return (
        <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
            onClick={onClose}
        >
            <div
                style={{
                    background: C.bg,
                    borderRadius: 18,
                    border: `1px solid ${C.border2}`,
                    boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
                    width: 'min(96vw, 680px)',   // más ancho
                    maxHeight: '48vh',            // ~mitad de alto
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header compacto ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar receta..."
                        style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 8, padding: '6px 10px', color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                    />
                    <button onClick={pickRandom} title="Receta aleatoria" style={{ width: 30, height: 30, borderRadius: 8, background: C.accentDim, border: `1px solid rgba(255,149,0,0.25)`, color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <Shuffle size={14} />
                    </button>
                    <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: C.surface, border: `1px solid ${C.border2}`, color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <X size={14} />
                    </button>
                </div>

                {/* ── Lista ── */}
                <ul style={{ overflowY: 'auto', flex: 1, padding: '6px 8px', margin: 0, listStyle: 'none' }}>
                    {filtered.length === 0 && (
                        <li style={{ textAlign: 'center', color: C.textMuted, padding: '24px 0', fontSize: 13 }}>Sin resultados</li>
                    )}
                    {filtered.map(r => {
                        const isSelected = selected.includes(r.id);
                        const isDisabled = !isSelected && selected.length >= MAX_SELECT;
                        const isExpanded = expanded === r.id;

                        return (
                            <li key={r.id} style={{ marginBottom: 2 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 10, background: isSelected ? C.accentDim : 'transparent', border: isSelected ? `1px solid rgba(255,149,0,0.25)` : '1px solid transparent', transition: 'background 0.15s' }}>
                                    <button
                                        onClick={() => setExpanded(prev => prev === r.id ? null : r.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                                    >
                                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                                        {r.calorias && <span style={{ fontSize: 11, color: C.accent }}>{r.calorias} kcal</span>}
                                    </div>
                                    <button
                                        onClick={() => !isDisabled && toggleSelect(r.id)}
                                        style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSelected ? C.accent : C.border2}`, background: isSelected ? C.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isDisabled ? 'not-allowed' : 'pointer', flexShrink: 0, opacity: isDisabled ? 0.35 : 1, transition: 'all 0.15s' }}
                                    >
                                        {isSelected && <Check size={12} color="#000" strokeWidth={3} />}
                                    </button>
                                </div>
                                {isExpanded && (
                                    <div style={{ margin: '2px 10px 6px 32px', padding: '7px 10px', background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                                        <p style={{ margin: 0, fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>{getPreview(r)}</p>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* ── Pie ── */}
                <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <button
                        onClick={handleAdd}
                        disabled={selected.length === 0}
                        style={{ width: '100%', padding: '10px 0', borderRadius: 10, background: selected.length > 0 ? C.accent : C.surface2, border: 'none', color: selected.length > 0 ? '#000' : C.textMuted, fontWeight: 700, fontSize: 14, cursor: selected.length > 0 ? 'pointer' : 'not-allowed', transition: 'background 0.15s', fontFamily: 'inherit' }}
                    >
                        {selected.length > 0 ? `Añadir (${selected.length})` : 'Selecciona una receta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotPicker;