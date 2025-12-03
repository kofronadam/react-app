import { useNavigate } from "react-router-dom";

function rezervace() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/moje-rezervace");
  };

  return <button className="button" onClick={handleClick}>Rezervace moe</button>;
}

export default rezervace;