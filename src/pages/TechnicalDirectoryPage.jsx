import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTechnicalDirectors,
  createTechnicalDirector,
  updateTechnicalDirector,
  deleteTechnicalDirector,
} from "../api/technicalDirectors";
import Card from "../components/Card";
import Header from "../components/Header";
import ActionButton from "../components/ActionButton";
import ExcelUploadForm from "../components/ExcelUploadForm";
import TechnicalDirectorForm from "../components/TechnicalDirectorForm";
import { AuthContext } from "../components/AuthContext";
import "../styles/pages/listpage.css";
import "../styles/pages/modal.css";

const TechnicalDirectoryPage = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState(null);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchDirectors = async () => {
    try {
      const data = await getTechnicalDirectors();
      setDirectors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, []);

  const handleCreate = () => {
    setEditingDirector(null);
    setIsModalOpen(true);
  };

  const handleUpdate = (director) => {
    setEditingDirector(director);
    setIsModalOpen(true);
  };

  const handleDelete = async (directorId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este director técnico?"
      )
    ) {
      try {
        await deleteTechnicalDirector(directorId);
        fetchDirectors();
      } catch (err) {
        alert("Error al eliminar el director técnico.", err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingDirector) {
        await updateTechnicalDirector(editingDirector.id, formData);
      } else {
        await createTechnicalDirector(formData);
      }
      setIsModalOpen(false);
      fetchDirectors();
    } catch (err) {
      alert("Error al guardar el director técnico.", err);
    }
  };

  const handleCardClick = (directorId) => {
    navigate(`/technical-directory/${directorId}`);
  };

  const handleExcelUploadSuccess = () => {
    setIsExcelModalOpen(false);
    fetchDirectors();
  };

  if (loading) return <div>Cargando directores técnicos...</div>;
  if (error) return <div>Error al cargar los directores técnicos: {error}</div>;

  return (
    <div className="page-wrapper">
      <Header title="Directores Técnicos" />
      <div className="list-container">
        {isAdmin && (
          <div className="actions-container">
            <ActionButton
              label="Crear Director Técnico"
              onClick={handleCreate}
            />
            <ActionButton
              label="Importar Excel"
              onClick={() => setIsExcelModalOpen(true)}
            />
          </div>
        )}
        <h2>Directores Técnicos</h2>
        <div className="card-grid">
          {directors.length > 0 ? (
            directors.map((director) => (
              <div
                key={director.id}
                onClick={() => handleCardClick(director.id)}
                style={{ cursor: "pointer" }}
              >
                <Card title={`${director.name} ${director.lastname}`}>
                  {director.photo_url && (
                    <img
                      src={director.photo_url}
                      alt={`Foto de ${director.name}`}
                      className="director-image"
                      style={{ maxWidth: "150px" }}
                    />
                  )}
                  <p>Nacionalidad: {director.nationality}</p>
                  <p>Fecha de Nacimiento: {director.birth_date}</p>
                  {director.coachedTeam && (
                    <p>Equipo: {director.coachedTeam.name}</p>
                  )}
                  {isAdmin && (
                    <div
                      className="card-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionButton
                        label="Editar"
                        onClick={() => handleUpdate(director)}
                        color="secondary"
                      />
                      <ActionButton
                        label="Eliminar"
                        onClick={() => handleDelete(director.id)}
                        color="danger"
                      />
                    </div>
                  )}
                </Card>
              </div>
            ))
          ) : (
            <p>No hay directores técnicos registrados.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TechnicalDirectorForm
              initialData={editingDirector}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isExcelModalOpen && (
        <div className="modal-overlay">
          {" "}
          <div className="modal-content">
            {" "}
            <ExcelUploadForm
              entityType="technicalDirectors"
              onUploadSuccess={handleExcelUploadSuccess}
              onCancel={() => setIsExcelModalOpen(false)}
            />{" "}
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default TechnicalDirectoryPage;
