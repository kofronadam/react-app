import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import AppointmentForm from './modul/rezervovat.tsx'
import Calendar from "./modul/Calendar.tsx";
import Calendar1 from "./modul/Calendar1.tsx";
import MyReservations from "./components/MyReservation.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="moje-rezervace" element={<MyReservations />} />
        <Route path="rezervovat" element={<AppointmentForm />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="calendar1" element={<Calendar1 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
