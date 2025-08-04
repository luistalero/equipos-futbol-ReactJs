import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import Header from "../components/Header";
import Card from "../components/Card";
import ActionButton from "../components/ActionButton";
import { getTeamById } from "../api/teams";
import "../styles/pages/listpage.css";
import { Link } from "react-router-dom";

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

  const handleExportPdf = () => {
    if (!team) return;

    const doc = new jsPDF();
    let yPos = 20;

    // Título del PDF
    doc.setFontSize(22).text(`Ficha del Equipo: ${team.name}`, 10, yPos);
    yPos += 15;

    // Información del Equipo
    doc.setFontSize(16).text("Información del Equipo:", 10, yPos);
    yPos += 10;
    doc.setFontSize(12).text(`Ciudad: ${team.city}`, 10, yPos);
    yPos += 10;
    if (team.foundation_date) {
      doc.text(`Fundación: ${team.foundation_date}`, 10, yPos);
      yPos += 10;
    }
    yPos += 10;

    // Director Técnico
    doc.setFontSize(16).text("Director Técnico:", 10, yPos);
    yPos += 10;
    // CORRECCIÓN: Usamos team.technicalDirector para que coincida con el backend
    if (team.technicalDirector) {
      const director = team.technicalDirector;
      doc
        .setFontSize(12)
        .text(`Nombre: ${director.name} ${director.lastname}`, 10, yPos);
      yPos += 10;
      doc.text(`Nacionalidad: ${director.nationality}`, 10, yPos);
      yPos += 10;
    } else {
      doc.text("No hay director técnico asignado.", 10, yPos);
      yPos += 10;
    }
    yPos += 10;

    // Jugadores
    doc.setFontSize(16).text("Jugadores:", 10, yPos);
    yPos += 10;
    if (team.players && team.players.length > 0) {
      doc.setFontSize(12);
      team.players.forEach((player) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`- ${player.name} ${player.lastname}`, 10, yPos);
        yPos += 10;
        doc.text(
          `  Posición: ${player.position ? player.position.name : "N/A"}`,
          20,
          yPos
        );
        yPos += 10;
      });
    } else {
      doc.text("No hay jugadores en este equipo.", 10, yPos);
    }

    doc.save(`ficha_equipo_${team.name}.pdf`);
  };

  if (loading) return <div>Cargando detalles del equipo...</div>;
  if (error) return <div>Error al cargar los detalles del equipo: {error}</div>;
  if (!team) return <div>Equipo no encontrado.</div>;

  return (
    <div className="page-wrapper">
      <Header title={`Detalles de ${team.name}`} />
      <div className="list-container">
        <div className="actions-container">
          <ActionButton label="Exportar a PDF" onClick={handleExportPdf} />
        </div>
        <h2>Información del Equipo</h2>
        <Card title={team.name}>
          <div className="info-card">
            {team.logo_url && (
              <img
                src={team.logo_url}
                alt={team.name}
                style={{ maxWidth: "150px" }}
              />
            )}
            <div className="p-card">
              <p>Ciudad: {team.city}</p>
              <p>Fundación: {team.foundation_date}</p>
            </div>
          </div>
        </Card>

        {team.technicalDirector && (
          <>
            <h2>Director Técnico</h2>
            <Card
              title={`${team.technicalDirector.name} ${team.technicalDirector.lastname}`}
            >
              <div className="info-card">
                {team.technicalDirector.photo_url && (
                  <img
                    src={team.technicalDirector.photo_url}
                    alt={`Foto de ${team.technicalDirector.name}`}
                    style={{ maxWidth: "100px" }}
                  />
                )}
                <p>Nacionalidad: {team.technicalDirector.nationality}</p>
                <p>Fecha de Nacimiento: {team.technicalDirector.birth_date}</p>
                {/* <Link to={`/technical-directors/${team.technicalDirector.id}`}>
                  Ver detalles
                </Link> */}
              </div>
            </Card>
          </>
        )}

        <h2>Jugadores</h2>
        <div className="card-grid">
          {team.players && team.players.length > 0 ? (
            team.players.map((player) => (
              <Card key={player.id} title={`${player.name} ${player.lastname}`}>
                {player.photo_url && (
                  <img
                    src={player.photo_url}
                    alt={`Foto de ${player.name}`}
                    style={{ maxWidth: "100px" }}
                  />
                )}
                <p>Nacionalidad: {player.nationality}</p>
                <p>
                  Posición: {player.position ? player.position.name : "N/A"}
                </p>
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
