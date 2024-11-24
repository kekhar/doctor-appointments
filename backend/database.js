import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database("./doctor-appointments.db", (err) => {
  if (err) {
    console.error("Ошибка при подключении к базе данных:", err.message);
  } else {
    console.log("База данных подключена.");
  }
});

// Создание таблиц, если их нет
db.serialize(() => {
  // Создаем таблицу staff (сотрудники)
  db.run(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Создаем таблицу doctors (врачи) с уникальным ограничением на staffId + name
  db.run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staffId INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY (staffId) REFERENCES staff(id),
      CONSTRAINT unique_doctor UNIQUE (staffId, name)
    )
  `);

  // Создаем таблицу appointments (приемы)
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientName TEXT NOT NULL,
      patientBirthDate TEXT NOT NULL,
      doctorId INTEGER NOT NULL,
      appointmentDateTime TEXT NOT NULL
    )
  `);

  // Добавление данных в таблицу staff
  const staffData = ["Хирург", "Терапевт", "Кардиолог"];
  staffData.forEach((name) => {
    db.run("INSERT OR IGNORE INTO staff (name) VALUES (?)", [name], (err) => {
      if (err) {
        console.error(`Ошибка при добавлении сотрудника (${name}):`, err.message);
      }
    });
  });

  // Добавление данных в таблицу doctors
  const doctorData = [
    [1, "Иванов И.И."],
    [1, "Петров П.П."],
    [1, "Смирнов С.С."],
    [2, "Попова И.А."],
    [3, "Кузнецова М.В."],
  ];

  doctorData.forEach(([staffId, name]) => {
    db.run(
      "INSERT OR IGNORE INTO doctors (staffId, name) VALUES (?, ?)",
      [staffId, name],
      (err) => {
        if (err) {
          console.error(`Ошибка при добавлении врача (${name}):`, err.message);
        }
      }
    );
  });
});

export default db;
