import { useState, useEffect, useRef } from 'react';
import { Shuffle, X } from 'lucide-react';
import type { Recipe } from '../../domain/model.types';

interface Props {
    recipes:             Recipe[];
    onSelect:            (recipe: Recipe) => void;
    onClose:             () => void;
    preselectedRecipe?:  Recipe | null;
}

const SlotPicker = ({ recipes, onSelect, onClose, preselectedRecipe }: Props) => {
    const [query, setQuery] = useState('');
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
        onSelect(recipes[Math.floor(Math.random() * recipes.length)]);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-2 p-4 border-b">
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar receta..."
                        className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                    />
                    <button onClick={pickRandom} title="Receta aleatoria" className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600">
                        <Shuffle size={16} />
                    </button>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                        <X size={16} />
                    </button>
                </div>

                {/* Lista */}
                <ul className="overflow-y-auto flex-1 p-2">
                    {filtered.length === 0 && (
                        <li className="text-center text-gray-400 py-8 text-sm">Sin resultados</li>
                    )}
                    {filtered.map((r) => (
                        <li key={r.id}>
                            <button
                                onClick={() => onSelect(r)}
                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                <span className="font-medium text-gray-800">{r.name}</span>
                                {r.calorias && (
                                    <span className="ml-2 text-xs text-gray-400">{r.calorias} kcal</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SlotPicker;