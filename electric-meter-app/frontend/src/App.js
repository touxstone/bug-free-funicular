import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0]);
  const [readingValue, setReadingValue] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      showMessage('Error al cargar usuarios', 'error');
    }
  };

  const handleUserChange = async (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    setReadingValue('');
    setIsEditing(false);
    
    if (userId && readingDate) {
      checkExistingReading(userId, readingDate);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setReadingDate(date);
    setReadingValue('');
    setIsEditing(false);
    
    if (selectedUser && date) {
      checkExistingReading(selectedUser, date);
    }
  };

  const checkExistingReading = async (userId, date) => {
    try {
      const response = await axios.get(`${API_URL}/api/readings/${userId}/${date}`);
      if (response.data) {
        setReadingValue(response.data.reading_value);
        setIsEditing(true);
        showMessage('Editando lectura existente', 'info');
      }
    } catch (error) {
      // No existe lectura previa
      setIsEditing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser || !readingDate || !readingValue) {
      showMessage('Por favor complete todos los campos', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/readings`, {
        userId: selectedUser,
        readingDate: readingDate,
        readingValue: readingValue
      });

      showMessage(response.data.message, 'success');
      setReadingValue('');
      setIsEditing(false);
    } catch (error) {
      showMessage('Error al guardar la lectura', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Registro de Lecturas Eléctricas</h1>
      
      {message.text && (
        <div style={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Usuario:</label>
          <select 
            value={selectedUser} 
            onChange={handleUserChange}
            style={styles.select}
          >
            <option value="">Seleccione un usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha:</label>
          <input
            type="date"
            value={readingDate}
            onChange={handleDateChange}
            style={styles.input}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Lectura (kWh):</label>
          <input
            type="number"
            step="0.01"
            value={readingValue}
            onChange={(e) => setReadingValue(e.target.value)}
            style={styles.input}
            placeholder="Ingrese la lectura"
          />
        </div>

        <button type="submit" style={styles.button}>
          {isEditing ? 'Actualizar Lectura' : 'Guardar Lectura'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px'
  },
  form: {
    backgroundColor: '#f5f5f5',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    backgroundColor: 'white'
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center'
  }
};

export default App;