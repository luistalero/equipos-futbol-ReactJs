import React, { useState, useEffect } from "react";
import ActionButton from "./ActionButton";
import "../styles/pages/modal.css";

const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "", 
  });
  const [passwordRequired, setPasswordRequired] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        lastname: initialData.lastname || "",
        username: initialData.username || "",
        email: initialData.email || "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData) {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.password === "") {
        delete dataToSubmit.password;
      }
      onSubmit(dataToSubmit);
    } else {
      onSubmit(formData);
    }
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
          <ActionButton type="submit" label="Guardar" />
          <ActionButton type="button" label="Cancelar" onClick={onCancel} color="secondary" />
        </div>
      </form>
    </div>
  );
};

export default UserForm;