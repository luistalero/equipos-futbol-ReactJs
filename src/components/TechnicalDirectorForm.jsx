import React, { useState, useEffect } from 'react';
import { uploadImage } from '../api/upload'; // Importamos la función de subida
import '../styles/components/form.css';
import { getTeams } from '../api/teams';

const TechnicalDirectorForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [teams, setTeams] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    nationality: '',
    birth_date: '',
    teamId: '', 
    photo_url: '',
    ...initialData,
  });

  useEffect(() => {
    const fetchDataAndInitializeForm = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
        setFormData({
          name: initialData.name || '',
          lastname: initialData.lastname || '',
          nationality: initialData.nationality || '',
          birth_date: initialData.birth_date || '',
          teamId: initialData.team ? initialData.team.id : '',
          photo_url: initialData.photo_url || '',
        });
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchDataAndInitializeForm();
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
        finalFormData.photo_url = uploadResponse.imageUrl;
      }
      
      const dataToSend = { ...finalFormData };
      
      await onSubmit(dataToSend);
    } catch (error) {
      alert('Error al guardar el director técnico.');
      console.error('Error saving technical director:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>{initialData && initialData.id ? 'Actualizar Director Técnico' : 'Crear Director Técnico'}</h3>
      <label>
        Nombre:
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
      </label>
      <label>
        Apellido:
        <input type="text" name="lastname" value={formData.lastname || ''} onChange={handleChange} required />
      </label>
      <label>
        Nacionalidad:
        <input type="text" name="nationality" value={formData.nationality || ''} onChange={handleChange} required />
      </label>
      <label>
        Fecha de Nacimiento:
        <input type="date" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} required />
      </label>
      <label>
        Equipo:
        <select name="teamId" value={formData.teamId || ''} onChange={handleChange} required>
          <option value="">Seleccione un equipo</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Foto:
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {formData.photo_url && !file && (
          <img src={formData.photo_url} alt="Foto actual" style={{ width: '100px', marginTop: '10px' }} />
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

export default TechnicalDirectorForm;