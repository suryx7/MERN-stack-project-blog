import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleForgotPassword(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:4050/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setMessage(data.message || data.error);
  }

  return (
    <form className="forgot-password register" onSubmit={handleForgotPassword}>
      <h1>Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        required
      />
      <button>Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
}
