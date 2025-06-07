import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function BillManagement({ contract }) {
  const [patient, setPatient] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddBill = async () => {
    try {
      if (!patient || !description || !amount) {
        toast.error("Please fill in all fields.");
        return;
      }

      const tx = await contract.addBill(patient, description, amount);
      await tx.wait();

      toast.success("Bill added successfully");

      setPatient('');
      setDescription('');
      setAmount('');
      fetchBills();
    } catch (error) {
      console.error("Error adding bill:", error);
      toast.error("Failed to add bill");
    }
  };

  const fetchBills = async () => {
    try {
      const fetchedBills = await contract.getBills();
      setBills(fetchedBills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchBills();
    }
  }, [contract]);

  return (
    <div className="p-6 border rounded-lg shadow bg-white max-w-2xl mx-auto mb-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Bill Management</h2>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Patient Address"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={handleAddBill}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full"
        >
          Add Bill
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">All Bills</h3>
        {loading ? (
          <p className="text-gray-500">Loading bills...</p>
        ) : bills.length === 0 ? (
          <p className="text-gray-500 italic">No bills added yet.</p>
        ) : (
          <ul className="space-y-3">
            {bills.map((bill, index) => (
              <li key={index} className="border p-3 rounded-lg shadow-sm bg-gray-50">
                <p><span className="font-medium">Patient:</span> {bill.patient}</p>
                <p><span className="font-medium">Description:</span> {bill.description}</p>
                <p><span className="font-medium">Amount:</span> {bill.amount.toString()} ETH</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BillManagement;
