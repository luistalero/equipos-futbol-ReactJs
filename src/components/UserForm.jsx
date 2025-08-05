import React, { useState, useEffect } from "react";
import ActionButton from "./ActionButton";
import "../styles/pages/modal.css";
import { uploadImage } from '../api/upload';

const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    photo_url: "",
    password: "",
    role: "",
  });
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        lastname: initialData.lastname || "",
        username: initialData.username || "",
        email: initialData.email || "",
        photo_url: initialData.photo_url || "",
        password: "",
        role: initialData.role || "",
      });
      setPasswordRequired(false);
    } else {
      setPasswordRequired(true);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalFormData = { ...formData };
      if (file) {
        const uploadResponse = await uploadImage(file);
        finalFormData.photo_url = uploadResponse.imageUrl;
      }
      if (initialData) {
        if (finalFormData.password === "") {
          delete finalFormData.password;
        }
        await onSubmit(finalFormData);
      } else {
        await onSubmit(finalFormData);
      }

    } catch (error) {
      alert('Error al procesar la solicitud. Inténtalo de nuevo.');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="form-container">
      <h3>{initialData ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Apellido:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            Foto:
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {formData.photo_url && !file && (
              <img src={formData.photo_url} alt="Foto actual" style={{ width: '100px', marginTop: '10px' }} />
            )}
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Contraseña: {initialData && <span>(dejar vacío para no cambiar)</span>}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={passwordRequired}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un rol</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="form-button primary" disabled={uploading}>
            {uploading ? 'Guardando...' : 'Guardar'}
          </button>
          <ActionButton type="button" label="Cancelar" onClick={onCancel} color="secondary" />
        </div>
      </form>
    </div>
  );
};

export default UserForm;