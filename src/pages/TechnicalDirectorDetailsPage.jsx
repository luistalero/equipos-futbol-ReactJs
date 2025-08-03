import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import { getTechnicalDirectorById } from '../api/technicalDirectors';
import '../styles/pages/listpage.css';

const TechnicalDirectorDetailsPage = () => {
  const { id } = useParams();
  const [director, setDirector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDirectorDetails = async () => {
      try {
        const data = await getTechnicalDirectorById(id);
        setDirector(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectorDetails();
  }, [id]);

  if (loading) return <div>Cargando detalles del director técnico...</div>;
  if (error) return <div>Error al cargar los detalles del director técnico: {error}</div>;
  if (!director) return <div>Director técnico no encontrado.</div>;

  return (
    <div className="page-wrapper">
      <Header title={`Detalles de ${director.name} ${director.lastname}`} />
      <div className="list-container">
        <h2>Información del Director Técnico</h2>
        <Card title={`${director.name} ${director.lastname}`}>
        {director.photo_url && (
            <img src={director.photo_url} alt={`Foto de ${director.name}`} className="details-image" />
          )}
          <p>Nacionalidad: {director.nationality}</p>
          <p>Fecha de Nacimiento: {director.birth_date}</p>
        </Card>
        
        {director.coachedTeam && (
          <>
            <h2>Equipo a Cargo</h2>
            <Card title={director.coachedTeam.name}>
              <p>Ciudad: {director.coachedTeam.city}</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default TechnicalDirectorDetailsPage;