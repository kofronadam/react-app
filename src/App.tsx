import { Outlet, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="header">
      {/* Navigační lišta */}
      <nav className="bg-white shadow-sm p-4 flex items-center gap-4">
        <button
          className="button:hover"
          onClick={() => navigate("/rezervovat")}
        >
          Rezervace
        </button>
        <button
          className="button:hover"
          onClick={() => navigate("/sprava-rezervace")}
        >
          Správa rezervace
        </button>
        {/* Přidejte další odkazy dle potřeby */}
      </nav>
      {/* Obsah podle aktuální cesty */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}