'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newStaff, setNewStaff] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientBirthDate, setPatientBirthDate] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Модальные окна
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    fetch('/api/staff')
      .then(response => response.json())
      .then(data => setStaff(data));

    fetch('/api/appointments')
      .then(response => response.json())
      .then(data => setAppointments(data));
  }, []);

  useEffect(() => {
    if (selectedStaff) {
      fetch(`/api/doctors?staffId=${selectedStaff}`)
        .then((response) => response.json())
        .then((data) => setDoctors(data));
    }
  }, [selectedStaff]);

  // Добавить нового сотрудника (профессию)
  const handleAddStaff = () => {
    if (newStaff) {
      fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStaff }),
      })
      .then(() => {
        fetch('/api/staff')
          .then(response => response.json())
          .then(data => setStaff(data));
      })
      setNewStaff('');
      setShowStaffModal(false);
    }
  };

  // Добавить нового врача
  const handleAddDoctor = () => {
    if (doctorName && selectedStaff) {
      fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: doctorName,
          staffId: selectedStaff,
        }),
      })
        .then(() => {
          fetch('/api/doctors')
            .then(response => response.json())
            .then(data => setDoctors(data));
          setDoctorName('');
          setSelectedStaff('');
          setShowDoctorModal(false);
        });
    }
  };

  // Добавить запись на прием
  const handleAddAppointment = () => {
    if (patientName && appointmentDate && appointmentTime && selectedDoctor && patientBirthDate) {
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientBirthDate,
          appointmentDateTime: `${appointmentDate}T${appointmentTime}`,
          doctorId: selectedDoctor,
        }),
      })
        .then(() => {
          fetch('/api/appointments')
            .then(response => response.json())
            .then(data => setAppointments(data));
          setPatientName('');
          setPatientBirthDate('');
          setAppointmentDate('');
          setAppointmentTime('');
          setSelectedDoctor('');
          setShowAppointmentModal(false);
          setIsEditing(false);
        });
    }
  };

  // Редактировать запись на прием
  const handleEditingAppointment = () => {
    if (patientName && appointmentDate && appointmentTime && selectedDoctor && patientBirthDate) {
      fetch(`/api/appointments/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAppointment,
          patientName,
          patientBirthDate,
          appointmentDateTime: `${appointmentDate}T${appointmentTime}`,
          doctorId: selectedDoctor,
        }),
      })
        .then(() => {
          fetch('/api/appointments')
            .then(response => response.json())
            .then(data => setAppointments(data));
          setPatientName('');
          setPatientBirthDate('');
          setAppointmentDate('');
          setAppointmentTime('');
          setSelectedDoctor('');
          setShowAppointmentModal(false);
          setIsEditing(false);
          setSelectedAppointment('');
        });
    }
  };

  // Редактировать запись на прием модалка
  const handleEditAppointment = (id: string) => {
    const appointment = appointments.find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(id);
      setPatientName(appointment.patientName);
      setPatientBirthDate(appointment.patientBirthDate);
      setSelectedDoctor(appointment.doctorId);
      setAppointmentDate(appointment.appointmentDateTime.split(' ')[0]);
      setAppointmentTime(appointment.appointmentDateTime.split(' ')[1]);
      setShowAppointmentModal(true);
      setIsEditing(true);
      setSelectedStaff(appointment.staffId);
    }
  };

  // Удалить запись на прием
  const handleDeleteAppointment = (id: string) => {
    fetch(`/api/appointments/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    });
  };

  return (
    <div className="flex flex-col items-center py-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Админ панель</h1>

      {/* Размещение кнопок в одну строку */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowStaffModal(true)}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Новый специалист
        </button>
        <button
          onClick={() => setShowDoctorModal(true)}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Новый врач
        </button>
        <button
          onClick={() => setShowAppointmentModal(true)}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Записать на прием
        </button>
      </div>

      {/* Модальные окна */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Добавить нового специалиста</h2>
            <input
              type="text"
              value={newStaff}
              onChange={(e) => setNewStaff(e.target.value)}
              placeholder="Введите профессию"
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            />
            <button
              onClick={handleAddStaff}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              Добавить специалиста
            </button>
            <button
              onClick={() => setShowStaffModal(false)}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded mt-4"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showDoctorModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Добавить нового врача</h2>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            >
              <option value="" hidden>Выберите специалиста</option>
              {staff.map((staffMember) => (
                <option key={staffMember.id} value={staffMember.id}>
                  {staffMember.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Введите имя врача"
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            />
            <button
              onClick={handleAddDoctor}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              Добавить врача
            </button>
            <button
              onClick={() => setShowDoctorModal(false)}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded mt-4"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showAppointmentModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Записать на прием</h2>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="ФИО пациента"
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            />
            <input
              type="date"
              value={patientBirthDate}
              onChange={(e) => setPatientBirthDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            />
            <select  className="w-full p-2 rounded bg-gray-700 text-white mb-4" value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
              <option value="" hidden>Выберите специалиста</option>
              {staff.map((staffMember) => (
                <option key={staffMember.id} value={staffMember.id}>
                  {staffMember.name}
                </option>
              ))}
            </select>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            >
              <option value="" hidden>Выберите врача</option>
              {doctors
                .map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
            </select>
            
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            />
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            />
            {isEditing ? <button onClick={handleEditingAppointment} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded">Редактировать</button> : <button
              onClick={handleAddAppointment}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              Записать
            </button>}
            <button
              onClick={() => setShowAppointmentModal(false)}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded mt-4"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Список приемов */}
      <div className="mt-6 w-full">
        {appointments.length > 0 ? (
          <table className="table-auto w-full bg-gray-800 rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Пациент</th>
                <th className="py-2 px-4 text-left">День рождения пациента</th>
                <th className="py-2 px-4 text-left">Врач</th>
                <th className="py-2 px-4 text-left">Специалист</th>
                <th className="py-2 px-4 text-left">Дата</th>
                <th className="py-2 px-4 text-left">Время</th>
                <th className="py-2 px-4 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="py-2 px-4">{appointment.patientName}</td>
                  <td className='py-2 px-4'>{appointment.patientBirthDate}</td>
                  <td className="py-2 px-4">{appointment.doctorName}</td>
                  <td className='py-2 px-4'>{appointment.staffName}</td>
                  <td className="py-2 px-4">{appointment.appointmentDateTime.split(' ')[0]}</td>
                  <td className="py-2 px-4">{appointment.appointmentDateTime.split(' ')[1]}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleEditAppointment(appointment.id)}
                      className="py-1 px-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded ml-2"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет записей на прием</p>
        )}
      </div>
    </div>
  );
}
