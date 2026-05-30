import { Edit2, Trash2, ChefHat } from 'lucide-react';
import { Recipe } from '../../domain/model.types';
import {ModalMode} from "../../domain/app.types";

interface Props {
    recipe: Recipe;
    onOpen: (recipe: Recipe, mode: ModalMode) => void;
    onDelete: (id: string) => void;
}

const RecipeCard = ({ recipe, onOpen, onDelete }: Props) => (
    <div onClick={() => onOpen(recipe, 'view')} className="cursor-pointer bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
<div className="flex justify-between items-start mb-2">
<h3 className="font-semibold text-lg text-gray-800">{recipe.name}</h3>
    <div className="flex gap-1">
    {recipe.robot && <ChefHat className="w-4 h-4 text-blue-500" />}
    <button onClick={(e) => { e.stopPropagation(); onOpen(recipe, 'edit'); }} className="text-blue-500 hover:text-blue-700">
<Edit2 className="w-4 h-4" />
    </button>
    <button onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }} className="text-red-500 hover:text-red-700">
<Trash2 className="w-4 h-4" />
    </button>
    </div>
    </div>
    <p className="text-gray-600 text-sm mb-2">{recipe.notes}</p>
    <div className="mb-2">
<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">{recipe.type}</span>
    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">{recipe.season}</span>
    </div>
    <p className="text-xs text-gray-500"><strong>Ingredientes:</strong> {recipe.ingredients}</p>
</div>
);

export default RecipeCard;