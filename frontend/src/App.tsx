import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const connectBackend = async () => {
      try {
        const response = await api.get("/test");

        console.log("Backend response:", response.data);

        setMessage(response.data.message);
      } catch (error) {
        console.error("Backend connection error:", error);

        setMessage("Backend connection failed");
      }
    };

    connectBackend();
  }, []);

  return (
    <div>
      <h1>MERN Application</h1>

      <p>{message}</p>
    </div>
  );
}

export default App;