// pages/BillingSuccess.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/contexts/ApiContext";

export default function BillingSuccess() {
  const navigate = useNavigate();
  const { BackendAPI } = useApi();
  const [msg, setMsg] = useState("Finalizing your enrollment...");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (!sessionId) {
      setMsg("Missing session id");
      return;
    }

    (async () => {
      try {
        const studentToken = localStorage.getItem("studentToken");
        const response = await axios.get(
          `${BackendAPI}/subscription/confirm-checkout/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${studentToken}`,
            },
          }
        );
        if (response.data.ok) {
          setMsg("✅ Enrollment successful!");
          navigate("/dashboard");
        } else {
          setMsg("⚠️ Could not confirm payment.");
        }
      } catch (e) {
        console.error(e);
        setMsg("Error confirming payment.");
      }
    })();
  }, [navigate]);

  return <div className="p-8 text-center">{msg}</div>;
}
