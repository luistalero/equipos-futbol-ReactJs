import React from 'react';

const SuspensionModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50 shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">Cuenta suspendida</h2>
        <p className="text-gray-700 mb-6">Tu cuenta ha sido suspendida. Por favor, contacta con el soporte para más información.</p>
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default SuspensionModal;
