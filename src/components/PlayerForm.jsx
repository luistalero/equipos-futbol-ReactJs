import React, { useState, useEffect } from 'react';
import '../styles/components/form.css';
import { getTeams } from '../api/teams';
import { getPositions } from '../api/positions';

const PlayerForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    birth_date: '',
    nationality: '',
    teamId: '',
    positionId: '',
    ...initialData,
  });

useEffect(() => {
    setFormData(prevData => ({
        name: prevData.name || '',
        lastname: prevData.lastname || '',
        birth_date: prevData.birth_date || '',
        nationality: prevData.nationality || '',
        teamId: prevData.teamId || '',
        positionId: prevData.positionId || '',
    }));
}, [initialData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsData = await getTeams();
        const positionsData = await getPositions();
        setTeams(teamsData);
        setPositions(positionsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
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
        <select name="teamId" value={formData.teamId || ''} onChange={handleChange} required>
          <option value="">Selecciona un equipo</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </label>
      <label>
        Posición:
        <select name="positionId" value={formData.positionId || ''} onChange={handleChange} required>
          <option value="">Selecciona una posición</option>
          {positions.map(position => (
            <option key={position.id} value={position.id}>{position.name}</option>
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

export default PlayerForm;