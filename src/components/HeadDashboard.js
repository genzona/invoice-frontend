import React, { useEffect, useState } from "react";
import NavigationIcons from "./NavigationIcons";
import "../styles/Dashboard.css";
import api from "../api"; // ✅ axios instance with baseURL and token

const HeadDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/invoices/pending");
        setInvoices(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load invoices");
      }
    };

    fetchInvoices();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      await api.post(`/invoices/decision/${id}`, { decision });
      setInvoices(invoices.filter((inv) => inv._id !== id));
    } catch (err) {
      console.error("Decision error:", err);
      alert("Failed to update invoice");
    }
  };

  return (
    <div className="dashboard-container">
      <NavigationIcons />
      <h2>Department Head Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Ref Code</th>
            <th>Item</th>
            <th>Amount</th>
            <th>PDFs</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.referenceCode}</td>
              <td>{inv.item}</td>
              <td>{inv.amount}</td>
              <td>
                {inv.pdfs.map((pdf, idx) => (
                  <a
                    key={idx}
                    href={`https://tssezl-invoice-system.onrender.com/uploads/${pdf}`} // ✅ backend on Render
                    target="_blank"
                    rel="noreferrer"
                  >
                    View {idx + 1}
                  </a>
                ))}
              </td>
              <td>
                <button className="approve-btn" onClick={() => handleDecision(inv._id, "approve")}>
                  Approve
                </button>
                <button className="reject-btn" onClick={() => handleDecision(inv._id, "reject")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeadDashboard;
