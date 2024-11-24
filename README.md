# Проект записи на прием к врачу

Этот проект представляет собой систему для записи на прием к врачу с использованием стека технологий **Next.js**, **Node.js (Express)** и **SQLite3**. В нем реализована возможность выбора сотрудника (специальности), врача и даты/времени приема. Также есть возможность редактировать и удалять записи.

## Структура проекта

Проект разделен на две части:
1. **Фронтенд** — приложение на **Next.js**.
2. **Бэкенд** — сервер на **Node.js с использованием Express** и базы данных **SQLite3**.

## Требования

Для работы с проектом на вашем компьютере должны быть установлены следующие технологии:

- **Node.js** — для работы как фронтенда, так и бэкенда.
  - Рекомендуемая версия: **16.x.x** или выше.
  - Для установки Node.js, посетите [официальный сайт Node.js](https://nodejs.org) и следуйте инструкциям по установке.

## Технологии

- **Next.js** (фронтенд)
- **React** (фронтенд)
- **TailwindCSS** (стилизация)
- **Node.js** (бэкенд)
- **Express** (бэкенд)
- **SQLite3** (база данных)

## Установка

Для запуска проекта вам нужно будет установить все зависимости как для фронтенда, так и для бэкенда.

### 1. Клонируйте репозиторий

```bash
git clone <https://github.com/kekhar/doctor-appointments.git>
```

### 2. Установите зависимости
Перейдите в папку с проектом и установите зависимости:
```bash
cd doctor-appointments
npm install
```

### 3. Запустите проект
Чтобы запустить проект в режиме разработки, используйте следующую команду, которая запускает как фронтенд, так и бэкенд:
```bash
npm run dev
```
После этого фронтенд будет доступен по адресу http://localhost:3000, а бэкенд — на порту 5000.

#### Структура файлов
- src/ — фронтенд часть на Next.js.
- backend/ — бэкенд часть на Node.js с Express.
- doctor-appointments.db — файл базы данных SQLite3.

#### Структура базы данных
Проект использует базу данных SQLite3 с тремя таблицами:
1. staff — таблица сотрудников (специальностей):
    - id: Идентификатор сотрудника.
    - name: Название специальности (например, "Хирург", "Терапевт").
2. doctors — таблица врачей:
    - id: Идентификатор врача.
    - staffId: Идентификатор специальности (связь с таблицей staff).
    - name: ФИО врача.
3. appointments — таблица записей на прием:
    - id: Идентификатор записи.
    - patientName: ФИО пациента.
    - patientBirthDate: Дата рождения пациента.
    - doctorId: Идентификатор врача (связь с таблицей doctors).
    - appointmentDateTime: Дата и время приема.

### 4. API
#### Получение списка сотрудников
```bash
GET /api/staff
```
Возвращает список сотрудников (специальностей).
#### Получение врачей для выбранного сотрудника
```bash
GET /api/doctors?staffId=<id>
```
Возвращает список врачей для выбранной специальности.
#### Получение всех записей на прием
```bash
GET /api/appointments
```
Возвращает список всех записей на прием.
#### Создание записи на прием
```bash
POST /api/appointments
```
Создает новую запись на прием. Ожидает в теле запроса:
```json
{
  "patientName": "ФИО пациента",
  "patientBirthDate": "Дата рождения пациента",
  "doctorId": "ID врача",
  "appointmentDateTime": "Дата и время приема"
}
```
#### Редактирование записи
```bash
PUT /api/appointments
```
Редактирует существующую запись на прием. Ожидает в теле запроса:
```json
{
  "id": "ID записи",
  "patientName": "ФИО пациента",
  "patientBirthDate": "Дата рождения пациента",
  "doctorId": "ID врача",
  "appointmentDateTime": "Дата и время приема"
}
```
#### Удаление записи
```bash
DELETE /api/appointments/:id
```
Удаляет запись на прием по указанному id.










