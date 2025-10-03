{/* Confirmar eliminación */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Eliminar receta?</h3>
            <p className="text-gray-600 mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                Cancelar
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}