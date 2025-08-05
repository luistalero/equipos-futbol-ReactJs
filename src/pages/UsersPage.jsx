import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/users"; 
import Card from "../components/Card";
import Header from "../components/Header";
import ActionButton from "../components/ActionButton";
import ExcelUploadForm from "../components/ExcelUploadForm"; 
import UserForm from "../components/UserForm";
import { AuthContext } from "../components/AuthContext";
import "../styles/pages/listpage.css";
import "../styles/pages/modal.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleUpdate = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err) {
        alert("Error al eliminar el usuario.", err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert("Error al guardar el usuario.", err);
    }
  };

  const handleCardClick = (userId) => {
    navigate(`/users/${userId}`);
  };
  
  // Función para manejar la carga exitosa de un archivo Excel
  const handleExcelUploadSuccess = () => {
    setIsExcelModalOpen(false);
    fetchUsers();
  };


  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error al cargar los usuarios: {error}</div>;

  return (
    <div className="page-wrapper">
      <Header title="Usuarios" />
      <div className="list-container">
        {isAdmin && (
          <div className="actions-container">
            <ActionButton label="Crear Usuario" onClick={handleCreate} />
            <ActionButton
              label="Importar Excel"
              onClick={() => setIsExcelModalOpen(true)}
            />
          </div>
        )}
        <h2>Usuarios</h2>
        <div className="card-grid">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleCardClick(user.id)}
                style={{ cursor: "pointer" }}
              >
                <Card title={`${user.name} ${user.lastname}`}>
                  <p>Username: {user.username}</p>
                  <p>Email: {user.email}</p>
                  <p>Rol: {user.role}</p>
                  {isAdmin && (
                    <div
                      className="card-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ActionButton
                        label="Editar"
                        onClick={() => handleUpdate(user)}
                        color="secondary"
                      />
                      <ActionButton
                        label="Eliminar"
                        onClick={() => handleDelete(user.id)}
                        color="danger"
                      />
                    </div>
                  )}
                </Card>
              </div>
            ))
          ) : (
            <p>No hay usuarios registrados.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserForm
              initialData={editingUser}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isExcelModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExcelUploadForm
              entityType="users"
              onUploadSuccess={handleExcelUploadSuccess}
              onCancel={() => setIsExcelModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;