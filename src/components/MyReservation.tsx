import { useState } from "react";


// Typ rezervace
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

export default function MyReservations() {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelected(id === selected ? null : id);
  };

  const handleChange = (id: number) => {
    alert(`Žádost o změnu termínu pro rezervaci #${id}`);
    // zde by bylo otevření dialogu/kalendáře pro výběr termínu
  };

  const handleCancel = (id: number) => {
    alert(`Žádost o zrušení rezervace #${id}`);
    // zde by bylo volání na backend ke zrušení
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Moje rezervace</h1>
      <div className="grid gap-4">
        {mockReservations.map((res) => (
          <div
            key={res.id}
            className={`border rounded shadow p-4 cursor-pointer bg-white`}
            onClick={() => handleSelect(res.id)}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{res.procedure}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  res.status === "potvrzeno"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {res.status}
              </span>
            </div>
            {selected === res.id && (
              <div className="mt-2 text-sm transition-all">
                <div>
                  <strong>Klinika:</strong> {res.clinic}
                </div>
                <div>
                  <strong>Lékař:</strong> {res.doctor}
                </div>
                <div>
                  <strong>Datum a čas:</strong>{" "}
                  {new Date(res.datetime).toLocaleString("cs-CZ", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="mt-3 flex gap-3">
                  <button
                    className="px-3 py-1 border bg-blue-100 text-blue-900 rounded hover:bg-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChange(res.id);
                    }}
                  >
                    Změnit termín
                  </button>
                  <button
                    className="px-3 py-1 border bg-red-100 text-red-900 rounded hover:bg-red-200"
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
          <div className="text-gray-500">Nemáte žádné rezervace.</div>
        )}
      </div>
    </div>
  );
}