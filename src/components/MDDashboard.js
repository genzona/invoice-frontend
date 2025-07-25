import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import NavigationIcons from "./NavigationIcons";

const MDDashboard = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://tssezl-invoice-system.onrender.com/api/invoices/pending", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setInvoices)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleDecision = async (id, decision) => {
    const token = localStorage.getItem("token");
    await fetch(`https://tssezl-invoice-system.onrender.com/api/invoices/decision/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ decision }),
    });
    setInvoices(invoices.filter((inv) => inv._id !== id));
  };

  return (
    <div className="dashboard-container">
      <NavigationIcons />
      <img src="/logo.png" alt="Company Logo" className="logo-top-left" />
      <img src="/tata-logo.png" alt="Company Logo" className="logo-top-right" />
      <h2>MD Dashboard</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Ref Code</th>
            <th>Department</th>
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
              <td>{inv.department}</td>
              <td>{inv.item}</td>
              <td>{inv.amount}</td>
              <td>
                {inv.pdfs.map((pdf, idx) => (
                  <div key={idx}>
                    <a
                      href={`https://tssezl-invoice-system.onrender.com/uploads/${pdf}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View {idx + 1}
                    </a>
                  </div>
                ))}
              </td>
              <td className="dashboard-buttons">
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

export default MDDashboard;
