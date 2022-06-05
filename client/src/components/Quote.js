import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Quote() {
  const navigate = useNavigate();

  const [quote, setQuote] = useState("");

  const [tempQuote, setTempQuote] = useState("");

  async function populateQuote() {
    const { data } = await axios.get("http://localhost:8000/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }

  async function updateQuote(e) {
    e.preventDefault();
    const { data } = await axios.post(
      "http://localhost:8000/api/quote",
      { quote: tempQuote },
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    if (data.status === "ok") {
      setQuote(tempQuote);

      setTempQuote("");
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        localStorage.removeItem("token");
        window.location.href = "/";
        navigate("/login");
      } else {
        populateQuote();
      }
    }
  }, [navigate]);
  return (
    <div>
      <h1>Quote : {quote || "no quote found"}</h1>
      <form onSubmit={updateQuote}>
        <input
          type="text"
          name="tempQuote"
          value={tempQuote}
          required
          onChange={(e) => setTempQuote(e.target.value)}
        />{" "}
        <br />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
