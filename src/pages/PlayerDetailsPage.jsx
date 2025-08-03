import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { getPlayerById } from '../api/players';
import '../styles/pages/listpage.css';

const PlayerDetailsPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const data = await getPlayerById(id);
        setPlayer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerDetails();
  }, [id]);

  if (loading) return <div>Cargando detalles del jugador...</div>;
  if (error) return <div>Error al cargar los detalles del jugador: {error}</div>;
  if (!player) return <div>Jugador no encontrado.</div>;

  return (
    <div className="page-wrapper">
      <Header title={`Detalles de ${player.name} ${player.lastname}`} />
      <div className="list-container">
        <h2>Información del Jugador</h2>
        <Card title={`${player.name} ${player.lastname}`}>
          <p>Nacionalidad: {player.nationality}</p>
          {player.photo_url && (
            <img src={player.photo_url} alt={`Foto de ${player.name}`} className="details-image" />
          )}
          <p>Fecha de Nacimiento: {player.birth_date}</p>
          {player.photo_url && <img src={player.photo_url} alt={player.name} style={{ maxWidth: '100px' }} />}
        </Card>
        
        {player.team && (
          <>
            <h2>Equipo</h2>
            <Card title={player.team.name}>
              <p>Ciudad: {player.team.city}</p>
            </Card>
          </>
        )}

        {player.position && (
          <>
            <h2>Posición</h2>
            <Card title={player.position.name} />
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerDetailsPage;