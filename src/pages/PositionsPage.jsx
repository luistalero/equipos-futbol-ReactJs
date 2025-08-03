import React, { useState, useEffect, useContext } from "react";
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
} from "../api/positions";
import Card from "../components/Card";
import Header from "../components/Header";
import ActionButton from "../components/ActionButton";
import ExcelUploadForm from "../components/ExcelUploadForm";
import PositionForm from "../components/PositionForm";
import { AuthContext } from "../components/AuthContext";
import "../styles/pages/listpage.css";
import "../styles/pages/modal.css";

const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const { isAdmin } = useContext(AuthContext);

  const fetchPositions = async () => {
    try {
      const data = await getPositions();
      setPositions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleCreate = () => {
    setEditingPosition(null);
    setIsModalOpen(true);
  };

  const handleUpdate = (position) => {
    setEditingPosition(position);
    setIsModalOpen(true);
  };

  const handleDelete = async (positionId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta posición?")
    ) {
      try {
        await deletePosition(positionId);
        fetchPositions();
      } catch (err) {
        alert("Error al eliminar la posición.", err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPosition) {
        await updatePosition(editingPosition.id, formData);
      } else {
        await createPosition(formData);
      }
      setIsModalOpen(false);
      fetchPositions();
    } catch (err) {
      alert("Error al guardar la posición.", err);
    }
  };

  const handleExcelUploadSuccess = () => {
    setIsExcelModalOpen(false);
    fetchPositions(); // Refrescar la lista después de la carga
  };

  if (loading) return <div>Cargando posiciones...</div>;
  if (error) return <div>Error al cargar las posiciones: {error}</div>;

  return (
    <div className="page-wrapper">
      <Header title="Posiciones" />
      <div className="list-container">
        {isAdmin && (
          <div className="actions-container">
            <ActionButton label="Crear Posición" onClick={handleCreate} />
            <ActionButton
              label="Importar Excel"
              onClick={() => setIsExcelModalOpen(true)}
            />
          </div>
        )}
        <h2>Posiciones</h2>
        <div className="card-grid">
          {positions.length > 0 ? (
            positions.map((position) => (
              <Card key={position.id} title={position.name}>
                {isAdmin && (
                  <div className="card-actions">
                    <ActionButton
                      label="Editar"
                      onClick={() => handleUpdate(position)}
                      color="secondary"
                    />
                    <ActionButton
                      label="Eliminar"
                      onClick={() => handleDelete(position.id)}
                      color="danger"
                    />
                  </div>
                )}
              </Card>
            ))
          ) : (
            <p>No hay posiciones registradas.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PositionForm
              initialData={editingPosition}
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
              entityType="positions"
              onUploadSuccess={handleExcelUploadSuccess}
              onCancel={() => setIsExcelModalOpen(false)}
            />{" "}
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default PositionsPage;
