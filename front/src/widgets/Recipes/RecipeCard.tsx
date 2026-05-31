import { Recipe } from '../../domain/model.types';
import { ModalMode } from '../../domain/app.types';

interface Props {
         recipe: Recipe;
         onOpen: (recipe: Recipe, mode: ModalMode) => void;
         onDelete: (id: string) => void;
        onAssign: (recipe: Recipe) => void;
     }

function hashColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 35%, 45%)`;
}

const RecipeCard = ({ recipe, onOpen, onAssign }: Props) => (    <div
        onClick={() => onOpen(recipe, 'view')}
        style={{ background: '#1a1a1a', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', transition: 'box-shadow 0.18s' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
        {/* Área imagen / placeholder */}
        <div style={{
            height: 160,
            // Foto real de comida aleatoria, recortada en banner y oscurecida para que quede premium
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&h=250&q=80') center/cover no-repeat`,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px 12px 0 0',
            borderBottom: '1px solid #222'
        }}>

            {/* Badge de tipo si existe */}
            {recipe.type && (
                <span style={{
                    position: 'absolute', top: 12, left: 12,
                    background: '#ff9f0a', color: '#000',
                    borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 2
                }}>{recipe.type}</span>
            )}
        </div>


        {/* Body */}
        <div style={{padding: '10px 14px 14px'}}>
            <p style={{fontSize: 12, color: '#888', marginBottom: 4}}>{recipe.season ?? '—'}</p>
            <p style={{fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.25}}>{recipe.name}</p>
            {recipe.calorias && (
                <p style={{fontSize: 12, color: '#FF9500', marginTop: 6}}>{recipe.calorias} kcal</p>
            )}
            <button
                onClick={e => {
                    e.stopPropagation();
                    onAssign(recipe);
                }}
                style={{
                    marginTop: 10, width: '100%', padding: '7px 0',
                    borderRadius: 8, border: '1px solid rgba(255,149,0,0.3)',
                    background: 'rgba(255,149,0,0.08)', color: '#FF9500',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
            >
                + Añadir al Planner
            </button>
        </div>
    </div>
);

export default RecipeCard;