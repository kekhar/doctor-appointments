import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // Импортируем fileURLToPath
import db from './database.js'; // Подключаем базу данных

const app = express();
const port = 5000;

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Middleware для обработки JSON данных в теле запроса
app.use(express.json());

// Получение списка сотрудников
app.get('/api/staff', (req, res) => {
  db.all('SELECT * FROM staff', (err, rows) => {
    if (err) {
      console.error('Ошибка при получении сотрудников:', err.message);
      return res.status(500).json({ error: 'Ошибка при получении сотрудников' });
    }
    return res.json(rows);
  });
});

// Получение врачей по выбранному сотруднику
app.get('/api/doctors', (req, res) => {
  const { staffId } = req.query;
  if (!staffId) {
    db.all('SELECT * FROM doctors ', (err, rows) => {
      if (err) {
        console.error('Ошибка при получении врачей:', err.message);
        return res.status(500).json({ error: 'Ошибка при получении врачей' });
      }
      console.log(rows);
      return res.json(rows);
    });
  } else {
    db.all('SELECT * FROM doctors WHERE staffId = ?', [staffId], (err, rows) => {
      if (err) {
        console.error('Ошибка при получении врачей:', err.message);
        return res.status(500).json({ error: 'Ошибка при получении врачей' });
      }
      return res.json(rows);
    });
  }
});

// Получение всех записей на прием
app.get('/api/appointments', (req, res) => {
  db.all('SELECT appointments.*, doctors.name AS doctorName, staff.name AS staffName, staff.id AS staffId, doctors.id AS doctorId FROM appointments JOIN doctors ON appointments.doctorId = doctors.id JOIN staff ON doctors.staffId = staff.id', (err, rows) => {
    if (err) {
      console.error('Ошибка при получении записей:', err.message);
      return res.status(500).json({ error: 'Ошибка при получении записей' });
    }
    return res.json(rows);
  });
});

// Создание записи на прием
app.post('/api/appointments', (req, res) => {
  const { patientName, patientBirthDate, doctorId, appointmentDateTime } = req.body;

  const [appointmentDate, appointmentTime] = appointmentDateTime.split("T");

  db.run(
    'INSERT INTO appointments (patientName, patientBirthDate, doctorId, appointmentDateTime) VALUES (?, ?, ?, ?)',
    [patientName, patientBirthDate, doctorId, `${appointmentDate} ${appointmentTime}`],
    function (err) {
      if (err) {
        console.error('Ошибка при создании записи:', err.message);
        return res.status(500).json({ error: 'Ошибка при создании записи' });
      }
      return res.status(201).json({ id: this.lastID, patientName, patientBirthDate, doctorId, appointmentDateTime });
    }
  );
});

// Редактирование записи
app.put('/api/appointments/', (req, res) => {
  const { id, patientName, patientBirthDate, doctorId, appointmentDateTime } = req.body;

  const [appointmentDate, appointmentTime] = appointmentDateTime.split("T");

  db.run(
    'UPDATE appointments SET patientName = ?, patientBirthDate = ?, doctorId = ?, appointmentDateTime = ? WHERE id = ?',
    [patientName, patientBirthDate, doctorId, `${appointmentDate} ${appointmentTime}`, id],
    function (err) {
      if (err) {
        console.error('Ошибка при обновлении записи:', err.message);
        return res.status(500).json({ error: 'Ошибка при обновлении записи' });
      }
      return res.status(200).json({ message: 'Запись обновлена' });
    }
  );
});

// Удаление записи
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM appointments WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при удалении записи' });
    }
    return res.status(200).json({ message: 'Запись удалена' });
  });
});

app.post('/api/staff', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO staff (name) VALUES (?)', [name], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при создании сотрудника' });
    }
    return res.status(200).json({ name });
  });
});

app.post('/api/doctors', (req, res) => {
  const { name, staffId } = req.body;
  db.run('INSERT INTO doctors (name, staffId) VALUES (?, ?)', [name, staffId], (err) => {
    if (err) {
      console.error('Ошибка при создании врача:', err.message);
      return res.status(500).json({ error: 'Ошибка при создании врача' });
    }
    return res.status(200).json({ name, staffId });
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
