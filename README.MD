# 🚌 Bus Ticket Reservation System

A web-based Bus Ticket Reservation System developed using **React.js, Bootstrap, Node.js, Express.js, and MongoDB**. The application allows users to search for buses, book tickets, manage bus details, view reservations, and cancel bookings.

## 📌 Project Overview

The Bus Ticket Reservation System simplifies the process of searching for buses and managing ticket reservations through a user-friendly web interface. It provides a frontend for passengers and a backend API for processing bookings and storing information in MongoDB.

## 🚀 Features

- **Dashboard:** View an overview of the bus reservation system.
- **Manage Buses:** Add, view, update, and delete bus details.
- **Search Buses:** Search for buses by source, destination, and travel date.
- **Book Tickets:** Enter passenger details and select the number of seats to book.
- **View Reservations:** Display reservation details and booking status.
- **Cancel Tickets:** Cancel bookings and restore seat availability.
- **Database Integration:** Store bus and reservation details in MongoDB.
- **Responsive Interface:** Use a sidebar-based layout built with React.js and Bootstrap.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Bootstrap | Styling and responsive layout |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Vite | Frontend development server |
| Git and GitHub | Version control and source code hosting |

## 📂 Project Structure

```text
bus-ticket-reservation/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── app.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

*Note: The structure above is illustrative. Adjust the filenames and folders to match your actual project.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB Community Server
- Git (optional, for version control)

### 1. Clone the Repository

```bash
git clone https://github.com/Sairampulagurla/bus-ticket-reservation-system.git
cd bus-ticket-reservation-system
```



### 2. Configure the Backend

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/busReservation
```

Make sure your local MongoDB server is running.

Start the backend:

```bash
npm run dev
```

The backend should run at:

`http://localhost:5000`

### 3. Configure the Frontend

Open a **second terminal** in VS Code and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

Keep both the backend and frontend terminals running while using the application.

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/buses` | Retrieve all buses |
| POST | `/api/buses` | Add a new bus |
| PUT | `/api/buses/:id` | Update bus details |
| DELETE | `/api/buses/:id` | Delete a bus |
| GET | `/api/buses/search?source=&destination=&date=` | Search for buses |
| GET | `/api/reservations` | Retrieve reservations |
| POST | `/api/reservations` | Create a reservation |
| PUT | `/api/reservations/cancel/:id` | Cancel a reservation |

## 🗄️ Database

The application uses MongoDB to store:

- Bus details, including bus number, name, source, destination, departure time, travel date, total seats, and available seats.
- Passenger reservation details, including passenger name, email, phone number, seats booked, and reservation status.

Seat availability is updated when tickets are booked or cancelled.

## 🔒 Security Notes

- Keep `.env` files out of GitHub using `.gitignore`.
- Never upload passwords, private credentials, or database secrets.
- Configure your own environment variables when running the project locally.

## 🔮 Future Enhancements

- Passenger registration and login.
- Role-based access control for passengers and administrators.
- Online payment integration.
- Seat selection and booking confirmation.
- Email or SMS booking notifications.

## 👨‍💻 Author

**Your Name**

GitHub: [Your GitHub Profile](https://github.com/Sairampulagurla)

## 📄 License

This project is intended for educational and learning purposes. Add a suitable open-source license if you want others to reuse and distribute the code.