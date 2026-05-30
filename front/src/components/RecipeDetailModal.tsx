import React, { useState, useEffect, useRef } from 'react';
import { X, Edit3, Trash2, ChefHat, Flame, Dumbbell, Zap, Droplets } from 'lucide-react';
import { Recipe, RecipeType, Season } from '../domain/model.types';
import { getEmptyRecipe } from '../utils';

// ─── tipos ────────────────────────────────────────────────────
type Mode = 'view' | 'edit' | 'create';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe;
  onDelete?: (id: string) => void;
  onSave?: (recipe: Recipe, isNew: boolean) => void;
  mode?: Mode;
};

// ─── paleta ───────────────────────────────────────────────────
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
  red:       '#ff4444',
};

// ─── helpers ──────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  PR: 'Primero', SG: 'Segundo', AC: 'Acompañamiento',
  PU: 'Plato único', CN: 'Cena', DS: 'Postre', SN: 'Snack',
};

// ─── sub-componentes ──────────────────────────────────────────
const MacroCard = ({ icon, label, value, unit, color }: {
  icon: React.ReactNode; label: string;
  value?: number | null; unit: string; color: string;
}) => (
    <div style={{
      background: C.surface2, borderRadius: 12, padding: '12px 8px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      border: `1px solid ${C.border2}`,
    }}>
      <div style={{ color }}>{icon}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>
        {value ?? '—'}
        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 2 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
    </div>
);

// ─── componente principal ─────────────────────────────────────
const RecipeDetailModal: React.FC<Props> = ({
                                              isOpen, onClose, recipe, onDelete, onSave, mode = 'view',
                                            }) => {
  const [formData, setFormData] = useState<Recipe>(recipe ?? getEmptyRecipe());
  const [isEditing, setIsEditing] = useState(mode !== 'view');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // animación entrada / salida
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (recipe) setFormData(recipe);
    else setFormData(getEmptyRecipe());
    setIsEditing(mode !== 'view');
    setShowDeleteConfirm(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [recipe, mode]);

  // bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted) return null;

  const update = (field: keyof Recipe, value: any) =>
      setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    onSave?.(formData, mode === 'create');
    if (mode === 'create') onClose();
    else setIsEditing(false);
  };

  const handleCancel = () => {
    if (mode === 'create') { onClose(); return; }
    if (recipe) setFormData(recipe);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (recipe?.id) { onDelete?.(recipe.id); onClose(); }
  };

  const data = isEditing ? formData : (recipe ?? formData);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: C.surface2, border: `1px solid ${C.border2}`,
    borderRadius: 10, padding: '10px 12px', color: C.text, fontSize: 15,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
      <>
        {/* Overlay */}
        <div
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
              WebkitBackdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.25s ease, backdrop-filter 0.25s ease',
            }}
        />

        {/* Sheet */}
        <div
            style={{
              position: 'fixed', left: '50%', top: '50%', zIndex: 201,
              transform: visible
                  ? 'translate(-50%, -50%)'
                  : 'translate(-50%, -47%)',
              opacity: visible ? 1 : 0,
              transition: 'transform 0.22s ease, opacity 0.2s ease',
              width: 'min(96vw, 940px)',
              maxHeight: '94vh',
              display: 'flex',
              flexDirection: 'column',
              background: C.bg,
              borderRadius: 20,
              border: `1px solid ${C.border2}`,
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
        >
          {/* ── TopBar del modal ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 18px',
            borderBottom: `1px solid ${C.border}`,
            background: C.bg,
            flexShrink: 0,
          }}>
            {/* título / input nombre */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {isEditing ? (
                  <input
                      value={formData.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder="Nombre de la receta"
                      style={{
                        ...inputStyle,
                        fontSize: 17, fontWeight: 700, padding: '6px 0',
                        background: 'transparent', border: 'none',
                        borderBottom: `2px solid ${C.accent}`, borderRadius: 0,
                      }}
                  />
              ) : (
                  <div style={{
                    fontSize: 17, fontWeight: 700, color: C.text,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {data.name || 'Nueva receta'}
                  </div>
              )}
            </div>

            {/* acciones */}
            {!isEditing && mode !== 'create' && (
                <>
                  <button onClick={() => setIsEditing(true)} style={{
                    width: 34, height: 34, borderRadius: '50%', background: C.surface,
                    border: `1px solid ${C.border2}`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: C.accent, flexShrink: 0,
                  }}>
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(true)} style={{
                    width: 34, height: 34, borderRadius: '50%', background: C.surface,
                    border: `1px solid ${C.border2}`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: C.red, flexShrink: 0,
                  }}>
                    <Trash2 size={15} />
                  </button>
                </>
            )}
            {isEditing && (
                <>
                  <button onClick={handleCancel} style={{
                    padding: '6px 13px', borderRadius: 8, background: C.surface2,
                    border: `1px solid ${C.border2}`, color: C.textMuted,
                    cursor: 'pointer', fontSize: 13, flexShrink: 0,
                  }}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} style={{
                    padding: '6px 13px', borderRadius: 8, background: C.accent,
                    border: 'none', color: '#000', fontWeight: 700,
                    cursor: 'pointer', fontSize: 13, flexShrink: 0,
                  }}>
                    Guardar
                  </button>
                </>
            )}
            <button onClick={onClose} style={{
              width: 34, height: 34, borderRadius: '50%', background: C.surface,
              border: `1px solid ${C.border2}`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: C.textMuted, flexShrink: 0,
            }}>
              <X size={16} />
            </button>
          </div>

          {/* ── Contenido scrollable ── */}
          <div ref={scrollRef} style={{ overflowY: 'auto', flex: 1, padding: '20px 22px 32px' }}>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {data.type && (
                  <span style={{
                    padding: '4px 11px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: C.accentDim, color: C.accent, border: `1px solid rgba(255,149,0,0.25)`,
                  }}>
                {TYPE_LABELS[data.type] ?? data.type}
              </span>
              )}
              {data.season && (
                  <span style={{
                    padding: '4px 11px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: C.surface2, color: C.textMuted, border: `1px solid ${C.border2}`,
                  }}>
                {data.season}
              </span>
              )}
              {data.robot && (
                  <span style={{
                    padding: '4px 11px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: 'rgba(59,130,246,0.13)', color: '#60a5fa',
                    border: '1px solid rgba(59,130,246,0.22)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                <ChefHat size={11} /> Robot
              </span>
              )}
            </div>

            {/* Macros */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                Información nutricional
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                <MacroCard icon={<Flame size={16} />} label="Calorías" value={data.calorias} unit="kcal" color="#f97316" />
                <MacroCard icon={<Dumbbell size={16} />} label="Proteínas" value={data.proteinas} unit="g" color="#60a5fa" />
                <MacroCard icon={<Zap size={16} />} label="Carbos" value={data.carbohidratos} unit="g" color="#facc15" />
                <MacroCard icon={<Droplets size={16} />} label="Grasas" value={data.grasas} unit="g" color="#f87171" />
              </div>
              {isEditing && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 8 }}>
                    {(['calorias', 'proteinas', 'carbohidratos', 'grasas'] as const).map(f => (
                        <input
                            key={f}
                            type="number"
                            placeholder={f}
                            value={formData[f] ?? ''}
                            onChange={e => update(f, e.target.value === '' ? null : Number(e.target.value))}
                            style={{ ...inputStyle, fontSize: 13, padding: '7px 8px', textAlign: 'center' }}
                        />
                    ))}
                  </div>
              )}
            </div>

            <div style={{ height: 1, background: C.border, marginBottom: 22 }} />

            {/* Ingredientes */}
            <Section label="Ingredientes">
              {isEditing ? (
                  <textarea
                      rows={5} value={formData.ingredients}
                      onChange={e => update('ingredients', e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical' }}
                  />
              ) : (
                  <div style={{ background: C.surface, borderRadius: 14, padding: '14px 16px', border: `1px solid ${C.border2}` }}>
                    {data.ingredients.split('\n').filter(Boolean).map((line, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 7 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent, flexShrink: 0, marginTop: 8 }} />
                          <span style={{ fontSize: 15, color: C.text, lineHeight: 1.5 }}>{line}</span>
                        </div>
                    ))}
                    {!data.ingredients && <span style={{ color: C.textMuted, fontSize: 15 }}>—</span>}
                  </div>
              )}
            </Section>

            {/* Preparación */}
            <Section label="Preparación">
              {isEditing ? (
                  <textarea
                      rows={6} value={formData.recipe}
                      onChange={e => update('recipe', e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical' }}
                  />
              ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {data.recipe.split('\n').filter(Boolean).map((step, i) => (
                        <div key={i} style={{
                          background: C.surface, borderRadius: 12, padding: '12px 14px',
                          border: `1px solid ${C.border2}`,
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Paso {i + 1}
                          </div>
                          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6, margin: 0 }}>{step}</p>
                        </div>
                    ))}
                    {!data.recipe && <span style={{ color: C.textMuted, fontSize: 15 }}>—</span>}
                  </div>
              )}
            </Section>

            {/* Notas */}
            {(data.notes || isEditing) && (
                <Section label="Notas">
                  {isEditing ? (
                      <textarea
                          rows={3} value={formData.notes ?? ''}
                          onChange={e => update('notes', e.target.value)}
                          style={{ ...inputStyle, resize: 'vertical' }}
                      />
                  ) : (
                      <p style={{
                        fontSize: 15, color: C.textMuted, lineHeight: 1.65,
                        background: C.surface, borderRadius: 12, padding: '12px 14px',
                        border: `1px solid ${C.border}`, margin: 0,
                      }}>
                        {data.notes}
                      </p>
                  )}
                </Section>
            )}

            {/* Tipo + Temporada (solo edit) */}
            {isEditing && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Section label="Tipo">
                    <select value={formData.type ?? ''} onChange={e => update('type', e.target.value || null)}
                            style={{ ...inputStyle }}>
                      <option value="">— Sin tipo —</option>
                      {Object.entries(RecipeType).map(([k, v]) => (
                          <option key={k} value={v}>{TYPE_LABELS[v] ?? v}</option>
                      ))}
                    </select>
                  </Section>
                  <Section label="Temporada">
                    <select value={formData.season ?? ''} onChange={e => update('season', e.target.value || null)}
                            style={{ ...inputStyle }}>
                      <option value="">— Sin temporada —</option>
                      {Object.values(Season).map(v => (
                          <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </Section>
                </div>
            )}
          </div>
        </div>

        {/* ── Confirm borrado ── */}
        {showDeleteConfirm && (
            <div
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 300,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
              <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: C.surface, borderRadius: 18, padding: 24,
                    width: 'min(88vw, 380px)', border: `1px solid ${C.border2}`,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  }}
              >
                <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>¿Borrar receta?</div>
                <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 22 }}>Esta acción no se puede deshacer.</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowDeleteConfirm(false)} style={{
                    flex: 1, padding: 12, borderRadius: 12, background: C.surface2,
                    border: `1px solid ${C.border2}`, color: C.text, cursor: 'pointer', fontSize: 14,
                  }}>
                    Cancelar
                  </button>
                  <button onClick={handleDelete} style={{
                    flex: 1, padding: 12, borderRadius: 12, background: C.red,
                    border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14,
                  }}>
                    Borrar
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

// ─── helper layout ────────────────────────────────────────────
const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: '#888',
        textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9,
      }}>
        {label}
      </div>
      {children}
    </div>
);

export default RecipeDetailModal;