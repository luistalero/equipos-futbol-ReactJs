import React, { useState, useEffect, useContext } from 'react';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../api/players';
import Card from '../components/Card';
import Header from '../components/Header';
import ActionButton from '../components/ActionButton';
import PlayerForm from '../components/PlayerForm';
import { AuthContext } from '../components/AuthContext';
import '../styles/pages/listpage.css';
import '../styles/pages/modal.css';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const { isAdmin } = useContext(AuthContext);

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleCreate = () => {
    setEditingPlayer(null);
    setIsModalOpen(true);
  };

  const handleUpdate = (player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleDelete = async (playerId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
      try {
        await deletePlayer(playerId);
        fetchPlayers();
      } catch (err) {
        alert('Error al eliminar el jugador.', err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPlayer) {
        await updatePlayer(editingPlayer.id, formData);
      } else {
        await createPlayer(formData);
      }
      setIsModalOpen(false);
      fetchPlayers();
    } catch (err) {
      alert('Error al guardar el jugador.', err);
    }
  };

  if (loading) return <div>Cargando jugadores...</div>;
  if (error) return <div>Error al cargar los jugadores: {error}</div>;

  return (
    <div className="page-wrapper">
      <Header title="Jugadores" />
      <div className="list-container">
        {isAdmin && (
          <div className="actions-container">
            <ActionButton label="Crear Jugador" onClick={handleCreate} />
          </div>
        )}
        <h2>Jugadores</h2>
        <div className="card-grid">
          {players.length > 0 ? (
            players.map(player => (
              <Card key={player.id} title={`${player.name} ${player.lastname}`}>
                <p>Nacionalidad: {player.nationality}</p>
                <p>Fecha de Nacimiento: {player.birth_date}</p>
                {player.team && <p>Equipo: {player.team.name}</p>}
                {player.position && <p>Posición: {player.position.name}</p>}
                {isAdmin && (
                  <div className="card-actions">
                    <ActionButton label="Editar" onClick={() => handleUpdate(player)} color="secondary" />
                    <ActionButton label="Eliminar" onClick={() => handleDelete(player.id)} color="danger" />
                  </div>
                )}
              </Card>
            ))
          ) : (
            <p>No hay jugadores registrados.</p>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PlayerForm 
              initialData={editingPlayer} 
              onSubmit={handleSubmit} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;