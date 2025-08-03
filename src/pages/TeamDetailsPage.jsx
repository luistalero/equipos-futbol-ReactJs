import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { getTeamById } from '../api/teams';
import '../styles/pages/listpage.css'; // Usaremos los mismos estilos para las tarjetas

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
        
        {team.technicalDirector && (
          <>
            <h2>Director Técnico</h2>
            <Card title={`${team.technicalDirector.name} ${team.technicalDirector.lastname}`}>
              <p>Nacionalidad: {team.technicalDirector.nationality}</p>
              <p>Fecha de Nacimiento: {team.technicalDirector.birth_date}</p>
            </Card>
          </>
        )}

        <h2>Jugadores</h2>
        <div className="card-grid">
          {team.players && team.players.length > 0 ? (
            team.players.map(player => (
              <Card key={player.id} title={`${player.name} ${player.lastname}`}>
                <p>Nacionalidad: {player.nationality}</p>
                <p>Posición: {player.position.name}</p>
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