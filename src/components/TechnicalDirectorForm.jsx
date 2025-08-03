import React, { useState, useEffect } from 'react';
import '../styles/components/form.css';
import { getTeams } from '../api/teams';

const TechnicalDirectorForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    nationality: '',
    birth_date: '',
    coachedTeamId: '',
    ...initialData,
  });

useEffect(() => {
    setFormData(prevData => ({
        name: prevData.name || '',
        lastname: prevData.lastname || '',
        nationality: prevData.nationality || '',
        birth_date: prevData.birth_date || '',
        coachedTeamId: prevData.coachedTeamId || '',
    }));
}, [initialData]);

useEffect(() => {
    const fetchTeams = async () => {
        try {
            const teamsData = await getTeams();
            setTeams(teamsData);
        } catch (err) {
            console.error("Error fetching teams:", err);
        }
    };
    fetchTeams();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
        Equipo a Cargo:
        <select name="coachedTeamId" value={formData.coachedTeamId || ''} onChange={handleChange}>
          <option value="">Ninguno</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </label>
      <div className="form-actions">
        <button type="submit" className="form-button primary">Guardar</button>
        <button type="button" className="form-button secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default TechnicalDirectorForm;