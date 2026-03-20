# Electric Meter App - Testing Links

## Estado de contenedores
```bash
docker-compose ps
docker-compose logs -f backend
```

## Frontend
- [Aplicación principal](http://localhost:3000)

## Backend API
- [Lista de usuarios](http://localhost:5000/api/users)
- [Lecturas Usuario 1](http://localhost:5000/api/readings/1)
- [Lecturas Usuario 2](http://localhost:5000/api/readings/2)
- [Lectura específica (ejemplo)](http://localhost:5000/api/readings/1/2024-01-15)

## Base de Datos (MySQL)
```bash
# Acceso directo
docker exec -it electric_meter_db mysql -u app_user -papp_password

# Ver todas las lecturas con nombres de usuario
SELECT 
    u.username,
    mr.reading_date,
    mr.reading_value 
FROM meter_readings mr
JOIN users u ON mr.user_id = u.id
ORDER BY mr.reading_date DESC;
```

## Comandos útiles
```bash
# Ver logs
docker-compose logs -f

# Detener app
docker-compose down

# Reconstruir backend
docker-compose up --build -d backend
```

## Checklist de pruebas
- [ ] Ver usuarios en http://localhost:5000/api/users
- [ ] Crear lectura en UI http://localhost:3000
- [ ] Confirmar en API http://localhost:5000/api/readings/1
- [ ] Confirmar en DB con docker exec



## Tips adicionales para tu flujo:

### 1. **VS Code + Markdown**
Puedes abrir el Markdown en VS Code y usar:
- `Ctrl+Click` en los links para abrirlos directamente en el navegador
- `Ctrl+Shift+V` para ver una vista previa formateada

### 2. **Extensión recomendada**
Si quieres llevar esto al siguiente nivel, instala la extensión "**REST Client**" en VS Code. Te permite crear un archivo `.http` o `.rest` y ejecutar peticiones directamente desde el editor:

```http
### Listar usuarios
GET http://localhost:5000/api/users

### Ver lecturas usuario 8
GET http://localhost:5000/api/readings/6

### Crear lectura
POST http://localhost:5000/api/readings
Content-Type: application/json

{
    "userId": 1,
    "readingDate": "2024-03-17",
    "readingValue": 123.45
}
```

### 3. **Combinar con el terminal integrado**
En VS Code, puedes tener:
- El Markdown con links clickeables
- Un panel dividido con terminal para `docker-compose logs -f`
- Otra terminal para comandos SQL rápidos

### Prod
~- [ ] Confirmar en API http://localhost:5432~
