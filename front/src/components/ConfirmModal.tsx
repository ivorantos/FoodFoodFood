import React from 'react';

type Props = {
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmModal: React.FC<Props> = ({
                                           isOpen,
                                           title = '¿Estás seguro?',
                                           message = 'Esta acción no se puede deshacer.',
                                           onConfirm,
                                           onCancel,
                                       }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;