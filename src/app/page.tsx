"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [staff, setStaff] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientBirthDate, setPatientBirthDate] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");

  useEffect(() => {
    // Загружаем список специальности с сервера
    fetch("/api/staff")
      .then((response) => response.json())
      .then((data) => setStaff(data));
  }, []);

  useEffect(() => {
    if (selectedStaff) {
      // Загружаем врачей для выбранного сотрудника
      fetch(`/api/doctors?staffId=${selectedStaff}`)
        .then((response) => response.json())
        .then((data) => setDoctors(data));
    }
  }, [selectedStaff]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Отправка данных формы на сервер
    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName,
        patientBirthDate,
        doctorId: selectedDoctor,
        appointmentDateTime,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Запись создана:", data);
        // Очистить форму после успешной отправки
        setPatientName("");
        setPatientBirthDate("");
        setAppointmentDateTime("");
        setSelectedStaff("");
        setSelectedDoctor("");
        setDoctors([]);
      })
      .catch((error) => console.error("Ошибка при отправке:", error));
  };

  return (
    <div className="flex flex-col items-center py-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Записаться на прием</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-gray-800 rounded shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-1">ФИО пациента:</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Введите ФИО"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Дата рождения:</label>
          <input
            type="date"
            value={patientBirthDate}
            onChange={(e) => setPatientBirthDate(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Выберите сотрудника:</label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            {!selectedStaff && <option value="">Выберите сотрудника</option>}
            {staff.map((staffMember) => (
              <option key={staffMember.id} value={staffMember.id}>
                {staffMember.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">ФИО врача:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
            disabled={!selectedStaff}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            {!selectedDoctor && <option value="">ФИО врача</option>}
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Дата и время приема:</label>
          <input
            type="datetime-local"
            value={appointmentDateTime}
            onChange={(e) => setAppointmentDateTime(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
