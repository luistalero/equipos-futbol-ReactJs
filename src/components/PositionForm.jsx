import React, { useState, useEffect } from 'react';
import '../styles/components/form.css';

const PositionForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    ...initialData,
  });

  useEffect(() => {
    setFormData(prevData => ({
      name: prevData.name || '',
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
      <h3>{initialData && initialData.id ? 'Actualizar Posición' : 'Crear Posición'}</h3>
      <label>
        Nombre de la posición:
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
      </label>
      <div className="form-actions">
        <button type="submit" className="form-button primary">Guardar</button>
        <button type="button" className="form-button secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default PositionForm;