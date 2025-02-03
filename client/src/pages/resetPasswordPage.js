import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isStrongPassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  async function handleSubmit(e) {
    e.preventDefault();

  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    try {
      const response = await fetch(`http://localhost:4050/reset-password/${id}/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 2000); 
      } else {
        setError(data.error);
        setMessage("");
      }
    } catch (err) {
      setError("An error occurred while resetting the password.");
      setMessage("");
    }
  }

  return (
    <div>
      <form className="login" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <input
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {error && <p style={{ color: "red", textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: "green", textAlign: 'center' }}>{message}</p>}
      </form>
    </div>
  );
}
