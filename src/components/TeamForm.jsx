import React, { useState, useEffect } from 'react';
import { uploadImage } from '../api/upload'; // Importamos la nueva función
import '../styles/components/form.css';

const TeamForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    foundation_date: '',
    logo_url: '',
    ...initialData,
  });

  const [file, setFile] = useState(null); 
  const [uploading, setUploading] = useState(false); 

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      name: prevData.name || '',
      city: prevData.city || '',
      foundation_date: prevData.foundation_date || '',
      logo_url: prevData.logo_url || '',
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalFormData = { ...formData };
      if (file) {
        const uploadResponse = await uploadImage(file);
        finalFormData.logo_url = uploadResponse.imageUrl;
      }

      await onSubmit(finalFormData);
    } catch (error) {
      alert('Error al subir la imagen. Inténtalo de nuevo.');
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>{initialData && initialData.id ? 'Actualizar Equipo' : 'Crear Equipo'}</h3>
      <label>
        Nombre:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Ciudad:
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </label>
      <label>
        Fecha de Fundación:
        <input type="date" name="foundation_date" value={formData.foundation_date} onChange={handleChange} required />
      </label>
      <label>
        Logo:
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {formData.logo_url && !file && (
          <img src={formData.logo_url} alt="Logo actual" style={{ width: '100px', marginTop: '10px' }} />
        )}
      </label>
      <div className="form-actions">
        <button type="submit" className="form-button primary" disabled={uploading}>
          {uploading ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="form-button secondary" onClick={onCancel} disabled={uploading}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default TeamForm;