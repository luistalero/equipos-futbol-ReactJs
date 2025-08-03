import React, { useState, useEffect } from 'react';
import '../styles/components/form.css';

const TeamForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    foundation_date: '',
    logo_url: '',
    ...initialData,
  });

  useEffect(() => {
    setFormData(prevData => ({
      name: prevData.name || '',
      city: prevData.city || '',
      foundation_date: prevData.foundation_date || '',
      logo_url: prevData.logo_url || '',
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>{initialData && initialData.id ? 'Actualizar Equipo' : 'Crear Equipo'}</h3>
      <label>
        Nombre:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Ciudad:
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </label>
      <label>
        Fecha de Fundación:
        <input type="date" name="foundation_date" value={formData.foundation_date} onChange={handleChange} required />
      </label>
      <label>
        URL del Logo:
        <input type="text" name="logo_url" value={formData.logo_url} onChange={handleChange} />
      </label>
      <div className="form-actions">
        <button type="submit" className="form-button primary">Guardar</button>
        <button type="button" className="form-button secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default TeamForm;