import React, { useState, useEffect, useContext } from 'react';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../api/teams';
import Card from '../components/Card';
import Header from '../components/Header';
import ActionButton from '../components/ActionButton';
import TeamForm from '../components/TeamForm';
import { AuthContext } from '../components/AuthContext';
import '../styles/pages/listpage.css';
import '../styles/pages/modal.css';
import { useNavigate } from 'react-router-dom';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCardClick = (teamId) => {
    navigate(`/teams/${teamId}`); // Navegamos a la ruta de detalles del equipo
  };

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const handleUpdate = (team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleDelete = async (teamId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await deleteTeam(teamId);
        fetchTeams(); // Refrescar la lista de equipos
      } catch (err) {
        alert('Error al eliminar el equipo.', err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, formData);
      } else {
        await createTeam(formData);
      }
      setIsModalOpen(false);
      fetchTeams(); // Refrescar la lista de equipos
    } catch (err) {
      alert('Error al guardar el equipo.', err);
    }
  };

  if (loading) return <div>Cargando equipos...</div>;
  if (error) return <div>Error al cargar los equipos: {error}</div>;

  return (
    <div className="page-wrapper">
      <Header title="Equipos" />
      <div className="list-container">
        {isAdmin && (
          <div className="actions-container">
            <ActionButton label="Crear Equipo" onClick={handleCreate} />
          </div>
        )}
        <h2>Equipos de Fútbol</h2>
        <div className="card-grid">
          {teams.length > 0 ? (
            teams.map(team => (
              <div key={team.id} onClick={() => handleCardClick(team.id)} style={{ cursor: 'pointer' }}>
                <Card title={team.name}>
                  {team.logo_url && <img src={team.logo_url} alt={team.name} style={{ width: '50px', height: '50px' }} />}
                  <p>Ciudad: {team.city}</p>
                  <p>Fundación: {team.foundation_date}</p>
                  {isAdmin && (
                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                      <ActionButton label="Editar" onClick={() => handleUpdate(team)} color="secondary" />
                      <ActionButton label="Eliminar" onClick={() => handleDelete(team.id)} color="danger" />
                    </div>
                  )}
                </Card>
              </div>
            ))
          ) : (
            <p>No hay equipos registrados.</p>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TeamForm 
              initialData={editingTeam} 
              onSubmit={handleSubmit} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;