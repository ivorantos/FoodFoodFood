import React, { useEffect, useState } from "react";
import { X, Edit3, Trash2, Flame, Clock, Leaf } from "lucide-react";
import { Recipe, RecipeType, Season } from "../domain/model.types";
import { getEmptyRecipe } from "../utils";

type Mode = 'view' | 'edit' | 'create';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe;
  onDelete?: (id: string) => void;
  onSave?: (recipe: Recipe, isNew: boolean) => void;
  mode?: Mode;
};

const getTypeColor = (type: string) => {
  const colors = {
    PR: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    SG: 'bg-blue-100 text-blue-800 border-blue-200',
    AC: 'bg-purple-100 text-purple-800 border-purple-200',
    PU: 'bg-orange-100 text-orange-800 border-orange-200',
    CN: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    DS: 'bg-pink-100 text-pink-800 border-pink-200',
    SN: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const MacroCard = ({  icon, label, value,unit,color,}: {icon: React.ReactNode;label: string;value?: number | null;unit: string;color: string;}) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-sm">
    <div className="flex items-center gap-2 mb-1">
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-600 uppercase">{label}</span>
    </div>
    <div className="text-xl font-bold text-gray-900">
      {value ?? "—"} <span className="text-sm font-normal text-gray-500">{unit}</span>
    </div>
  </div>
);

const RecipeDetailModal: React.FC<Props> = ({ isOpen,onClose,recipe,onDelete, onSave, mode = "view" }) => {

  const [formData, setFormData] = useState<Recipe>(recipe ?? getEmptyRecipe());

  const [isEditing, setIsEditing] = useState(mode !== "view");
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
  recipe ? setFormData(recipe): setFormData(getEmptyRecipe());
  setIsEditing(mode !== "view");
}, [recipe, mode]);

  const updateField = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.(formData, mode === "create");
    if (mode === "create") onClose();
    else setIsEditing(false);
  };

  const handleCancel = () => {
    if (mode === "create") onClose();
    else {
      setFormData(recipe!);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (recipe?.id) {
      onDelete?.(recipe.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isView = !isEditing;

  return (
      <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}>
        <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="absolute top-4 right-4 flex gap-2">
            {/* botones modo crear / editar */}
            {isEditing ? (
              <>
                <button onClick={handleSave} title="Guardar" className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md">
                  ✓
                </button>
                <button onClick={handleCancel} title="Cancelar" className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg shadow-md">
                  <X size={16} />
                </button>
              </>
            ) : (
              <>{/* boton editar */}
                <button onClick={() => setIsEditing(true)} title="Editar" className="bg-white/90 text-orange-500 hover:text-orange-600 p-2 rounded-lg shadow-md">
                  <Edit3 size={16} />
                </button>
                {/* boton cerrar */}
                <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg">
                  <X size={16} />
                </button>
              </>
            )}
          </div>

          <div>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="text-2xl font-bold bg-transparent border-b border-white/50 placeholder-white/60 w-full focus:outline-none"
                placeholder="Nombre de la receta"
              />
            ) : (
              <h2 className="text-2xl font-bold">{formData.name}</h2>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* Macros */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Información Nutricional
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MacroCard icon={<Flame size={16} className="text-orange-600" />} label="Calorías" value={formData.calorias} unit="kcal" color="bg-orange-100" />
              <MacroCard icon={<div className="w-4 h-4 bg-blue-600 rounded-full" />} label="Proteínas" value={formData.proteinas} unit="g" color="bg-blue-100" />
              <MacroCard icon={<div className="w-4 h-4 bg-green-600 rounded-full" />} label="Carbohidratos" value={formData.carbohidratos} unit="g" color="bg-green-100" />
              <MacroCard icon={<div className="w-4 h-4 bg-yellow-600 rounded-full" />} label="Grasas" value={formData.grasas} unit="g" color="bg-yellow-100" />
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" /> Ingredientes
            </h3>
            {isEditing ? (
              <textarea
                value={formData.ingredients}
                onChange={(e) => updateField("ingredients", e.target.value)}
                className="w-full p-3 bg-white/80 rounded-xl border border-gray-200"
              />
            ) : (
              <p className="text-gray-700">{formData.ingredients}</p>
            )}
          </div>

          {/* Preparación */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> Preparación
            </h3>
            {isEditing ? (
              <textarea
                value={formData.recipe}
                onChange={(e) => updateField("recipe", e.target.value)}
                className="w-full p-3 bg-white/80 rounded-xl border border-gray-200"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{formData.recipe}</p>
            )}
          </div>

          {/* Notas */}
          {(formData.notes || isEditing) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Notas</h3>
              {isEditing ? (
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="w-full p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900"
                />
              ) : (
                <p className="text-amber-800">{formData.notes}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;