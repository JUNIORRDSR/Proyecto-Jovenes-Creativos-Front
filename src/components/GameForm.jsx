import "./GameForm.css";
import { useState } from "react";

function GameForm({ onSubmit, onCancel, editingGame }) {
  const [formData, setFormData] = useState(
    editingGame || {
      name: "",
      genre: "",
      cover: "",
      rating: 0,
      status: "Pendiente",
      hoursPlayed: 0,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editingGame ? "Editar Juego" : "Agregar Juego"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre del Juego</label>
          <input name="name" value={formData.name} onChange={handleChange} required />

          <label>Género</label>
          <input name="genre" value={formData.genre} onChange={handleChange} required />

          <label>URL de Portada</label>
          <input name="cover" value={formData.cover} onChange={handleChange} />

          <label>Puntuación (1-5)</label>
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
          />

          <label>Horas Jugadas</label>
          <input
            name="hoursPlayed"
            type="number"
            min="0"
            value={formData.hoursPlayed}
            onChange={handleChange}
          />

          <label>Estado</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="Jugando">Jugando</option>
            <option value="Completado">Completado</option>
          </select>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="save-btn">
              {editingGame ? "Guardar Cambios" : "Agregar Juego"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameForm;
