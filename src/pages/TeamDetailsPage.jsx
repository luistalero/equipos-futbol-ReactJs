import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { getTeamById } from '../api/teams';
import '../styles/pages/listpage.css';
import { Link } from 'react-router-dom'; // Importamos Link para los enlaces

const TeamDetailsPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const data = await getTeamById(id);
        setTeam(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDetails();
  }, [id]);

  if (loading) return <div>Cargando detalles del equipo...</div>;
  if (error) return <div>Error al cargar los detalles del equipo: {error}</div>;
  if (!team) return <div>Equipo no encontrado.</div>;

  return (
    <div className="page-wrapper">
      <Header title={`Detalles de ${team.name}`} />
      <div className="list-container">
        <h2>Información del Equipo</h2>
        <Card title={team.name}>
          <p>Ciudad: {team.city}</p>
          <p>Fundación: {team.foundation_date}</p>
          {team.logo_url && <img src={team.logo_url} alt={team.name} style={{ maxWidth: '100px' }} />}
        </Card>
        
        {/* Mostramos el Director Técnico si existe */}
        {team.technical_director && ( // Corregido: accedemos a 'technical_director'
          <>
            <h2>Director Técnico</h2>
            <Card title={`${team.technical_director.name} ${team.technical_director.lastname}`}>
              {/* Mostramos la foto del DT si existe */}
              {team.technical_director.photo_url && (
                <img src={team.technical_director.photo_url} alt={`Foto de ${team.technical_director.name}`} style={{ maxWidth: '100px' }} />
              )}
              <p>Nacionalidad: {team.technical_director.nationality}</p>
              <p>Fecha de Nacimiento: {team.technical_director.birth_date}</p>
              <Link to={`/technical-directors/${team.technical_director.id}`}>Ver detalles</Link>
            </Card>
          </>
        )}

        <h2>Jugadores</h2>
        <div className="card-grid">
          {team.players && team.players.length > 0 ? (
            team.players.map(player => (
              <Card key={player.id} title={`${player.name} ${player.lastname}`}>
                {/* Mostramos la foto del jugador si existe */}
                {player.photo_url && (
                  <img src={player.photo_url} alt={`Foto de ${player.name}`} style={{ maxWidth: '100px' }} />
                )}
                <p>Nacionalidad: {player.nationality}</p>
                {/* Verificamos que la posición exista antes de acceder al nombre */}
                <p>Posición: {player.position ? player.position.name : 'N/A'}</p>
                <Link to={`/players/${player.id}`}>Ver detalles</Link>
              </Card>
            ))
          ) : (
            <p>No hay jugadores asignados a este equipo.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsPage;