import React, { useState } from 'react';
import '../styles/components/form.css'; // Reutilizamos los estilos del formulario
import { importTeamsExcel, importPlayersExcel, importTechnicalDirectorsExcel, importPositionsExcel } from '../api/excelUpload';

const ExcelUploadForm = ({ entityType, onUploadSuccess, onCancel }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo Excel para subir.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      let uploadFunction;
      switch (entityType) {
        case 'teams':
          uploadFunction = importTeamsExcel;
          break;
        case 'players':
          uploadFunction = importPlayersExcel;
          break;
        case 'technicalDirectors':
          uploadFunction = importTechnicalDirectorsExcel;
          break;
        case 'positions':
          uploadFunction = importPositionsExcel;
          break;
        default:
          throw new Error('Tipo de entidad no válido para la carga de Excel.');
      }
      
      await uploadFunction(file);
      onUploadSuccess(); // Llama a la función del componente padre para cerrar el modal y refrescar la lista
      alert('Archivo Excel importado exitosamente.');
    } catch (err) {
      setError(`Error al importar el archivo: ${err.message}`);
      console.error('Error uploading Excel file:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleUpload}>
      <h3>Importar {entityType.charAt(0).toUpperCase() + entityType.slice(1)} desde Excel</h3>
      <label>
        Archivo Excel:
        <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" required />
      </label>
      {error && <p className="error-message">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="form-button primary" disabled={uploading}>
          {uploading ? 'Importando...' : 'Importar'}
        </button>
        <button type="button" className="form-button secondary" onClick={onCancel} disabled={uploading}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ExcelUploadForm;