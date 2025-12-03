import { useNavigate } from "react-router-dom";

function Message() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/rezervovat");
  };

  return <button className="button" onClick={handleClick}>Rezervace Termínu</button>;
}

export default Message;