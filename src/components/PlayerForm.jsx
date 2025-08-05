import React, { useState, useEffect } from 'react';
import { uploadImage } from '../api/upload';
import '../styles/components/form.css';
import { getTeams } from '../api/teams';
import { getPositions } from '../api/positions';

const PlayerForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    birth_date: '',
    nationality: '',
    team_id: '', 
    position_id: '',
    photo_url: '',
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchDataAndInitializeForm = async () => {
      try {
        const teamsData = await getTeams();
        const positionsData = await getPositions();
        setTeams(teamsData);
        setPositions(positionsData);
        setFormData({
          name: initialData.name || '',
          lastname: initialData.lastname || '',
          birth_date: initialData.birth_date || '',
          nationality: initialData.nationality || '',
          team_id: initialData.team_id || '',
          position_id: initialData.position_id || '',
          photo_url: initialData.photo_url || '',
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingOptions(false);
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
        setFormData(prevData => ({ ...prevData, photo_url: uploadResponse.imageUrl }));
      }
      await onSubmit(finalFormData);
    } catch (error) {
      alert('Error al guardar el jugador.');
      console.error('Error saving player:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loadingOptions) {
    return <div>Cargando opciones...</div>;
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>{initialData && initialData.id ? 'Actualizar Jugador' : 'Crear Jugador'}</h3>
      <label>
        Nombre:
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
      </label>
      <label>
        Apellido:
        <input type="text" name="lastname" value={formData.lastname || ''} onChange={handleChange} required />
      </label>
      <label>
        Fecha de Nacimiento:
        <input type="date" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} required />
      </label>
      <label>
        Nacionalidad:
        <input type="text" name="nationality" value={formData.nationality || ''} onChange={handleChange} required />
      </label>
      <label>
        Equipo:
        <select name="team_id" value={formData.team_id || ''} onChange={handleChange} required>
          <option value="">Selecciona un equipo</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </label>
      <label>
        Posición:
        <select name="position_id" value={formData.position_id || ''} onChange={handleChange} required> 
          <option value="">Selecciona una posición</option>
          {positions.map(position => (
            <option key={position.id} value={position.id}>{position.name}</option>
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

export default PlayerForm;