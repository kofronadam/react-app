import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManReservation.css";

type Reservation = {
  id: number;
  clinic: string;
  procedure: string;
  doctor: string;
  datetime: string;    // ISO string
  status: "potvrzeno" | "čeká na schválení změny" | string;
};

const mockReservations: Reservation[] = [
  {
    id: 1,
    clinic: "Klinika Slunce",
    procedure: "Preventivní prohlídka",
    doctor: "MUDr. Jan Novák",
    datetime: "2025-12-11T10:30",
    status: "potvrzeno",
  },
  {
    id: 2,
    clinic: "Zdraví centrum",
    procedure: "Očkování proti chřipce",
    doctor: "MUDr. Eva Sedláčková",
    datetime: "2025-12-15T14:00",
    status: "čeká na schválení změny",
  }
];

export default function ManReservations() {
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSelect = (id: number) => {
    setSelected(id === selected ? null : id);
  };

  const handleChange = (id: number) => {
    alert(`Žádost o změnu termínu pro rezervaci #${id}`);
  };

  const handleCancel = (id: number) => {
    alert(`Žádost o zrušení rezervace #${id}`);
  };

  return (
    <div className="myres-root">
      <div className="myres-container">
        <div className="myres-title-row">
          <h1 className="myres-title">Moje rezervace</h1>
          <button
            className="myres-nav-btn"
            onClick={() => navigate("/rezervovat")}
            aria-label="Rezervovat"
          >
            Rezervovat
          </button>
          
        </div>

        <div className="myres-list">
          {mockReservations.map((res) => (
            <div
              key={res.id}
              className={`myres-card ${selected === res.id ? "myres-card--active" : ""}`}
              onClick={() => handleSelect(res.id)}
            >
              <div className="myres-header">
                <span className="myres-procedure">{res.procedure}</span>
                <span
                  className={`myres-status ${
                    res.status === "potvrzeno"
                      ? "myres-status--ok"
                      : "myres-status--pending"
                  }`}>
                  {res.status}
                </span>
              </div>
              {selected === res.id && (
                <div className="myres-details">
                  <div><span className="myres-label">Klinika:</span> {res.clinic}</div>
                  <div><span className="myres-label">Lékař:</span> {res.doctor}</div>
                  <div>
                    <span className="myres-label">Datum a čas:</span>{" "}
                    {new Date(res.datetime).toLocaleString("cs-CZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="myres-actions">
                    <button
                      className="myres-btn myres-btn--change"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChange(res.id);
                      }}
                    >
                      Změnit termín
                    </button>
                    <button
                      className="myres-btn myres-btn--cancel"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(res.id);
                      }}
                    >
                      Zrušit rezervaci
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {mockReservations.length === 0 && (
            <div className="myres-empty">
              Nemáte žádné rezervace.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}