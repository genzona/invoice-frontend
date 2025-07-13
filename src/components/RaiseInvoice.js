import { FaUpload } from "react-icons/fa";
import React, { useState } from "react";
import "../styles/RaiseInvoice.css";
import NavigationIcons from "./NavigationIcons";

const RaiseInvoice = () => {
  const [department, setDepartment] = useState("HR");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!department || !item || !amount || pdfs.length === 0) {
      setError("⚠️ All fields and at least one PDF are required.");
      return;
    }

    const formData = new FormData();
    formData.append("department", department);
    formData.append("item", item);
    formData.append("amount", amount);
    for (let file of pdfs) {
      formData.append("pdfs", file);
    }

    try {
      const res = await fetch("https://tssezl-invoice-system.onrender.com/api/invoices/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Invoice submitted! Ref Code: ${data.referenceCode}`);
        setItem("");
        setAmount("");
        setPdfs([]);
      } else {
        setError(data.error || "❌ Upload failed.");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("❌ Server error during upload.");
    }
  };

  return (
    <div className="login-container">
      <span><FaUpload /> Upload Files</span>   
      <NavigationIcons />
      <img src="/logo.png" alt="Logo" className="logo-top-left" />
      <img src="/tata-logo.png" alt="TATA Logo" className="logo-top-right" />
      <div className="login-box">
        <h2>Raise Invoice</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="custom-select"
            required
          >
            <option value="HR">HR</option>
            <option value="F&A">F&A</option>
            <option value="Procurement">Procurement</option>
            <option value="M&BD">M&BD</option>
            <option value="Projects">Projects</option>
            <option value="IT">IT</option>
            <option value="SHE">SHE</option>
            <option value="CS">CS</option>
          </select>

          <input
            type="text"
            className="item"
            placeholder="Item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />

          <input
            type="number"
            className="amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => setPdfs([...e.target.files])}
            required
          />

          <button type="submit">Submit</button>

          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
    
  );
};

export default RaiseInvoice;
