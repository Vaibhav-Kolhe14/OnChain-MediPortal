import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 

function AmbulanceService({ contract, account }) {

  const [driverName, setDriverName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [ambulances, setAmbulances] = useState([]);
  const [requestId, setRequestId] = useState("");

  const handleAddAmbulance = async () => {
    try {
      if (!contract) throw new Error("Contract not loaded");
      if (!driverName || !vehicleNumber) {
        alert("Please fill in both driver name and vehicle number.");
        return;
      }

      const tx = await contract.addAmbulance(driverName, vehicleNumber);
      await tx.wait();
      toast.success("Ambulance added successfully!");

      setDriverName("");
      setVehicleNumber("");
      fetchAmbulances();
    } catch (error) {
      console.error(error);
      toast.error("Adding ambulance failed. Please try again.");
    }
  };

  const handleRequestAmbulance = async () => {
    try {
      if (!contract) throw new Error("Contract not loaded");
      if (!requestId) {
        alert("Please enter a valid ambulance ID to request.");
        return;
      }

      const tx = await contract.requestAmbulance(requestId);
      await tx.wait();
      toast.success("Ambulance requested successfully!");

      setRequestId("");
      fetchAmbulances();
    } catch (error) {
      console.error(error);
      toast.error("Request failed. Please try again.");
    }
  };

  const fetchAmbulances = async () => {
    try {
      if (!contract) return;
      const result = await contract.getAmbulances();
      setAmbulances(result);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch ambulances.");
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, [contract]);

  return (
    <div className="p-4 border rounded-lg shadow bg-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">Ambulance Service</h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        Connected Wallet: <span className="font-mono">{account}</span>
      </p>

      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Driver Name"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={handleAddAmbulance}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full"
        >
          Add Ambulance
        </button>
      </div>

      <div className="space-y-2 mb-6">
        <input
          type="number"
          placeholder="Ambulance ID to Request"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={handleRequestAmbulance}
          className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded w-full"
        >
          Request Ambulance
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Available Ambulances</h3>
        {ambulances.length === 0 ? (
          <p className="text-gray-500">No ambulances available.</p>
        ) : (
          <ul className="space-y-2">
            {ambulances.map((a, i) => (
              <li key={i} className="border p-2 rounded bg-gray-50">
                <p><strong>ID:</strong> {a.id?.toString()}</p>
                <p><strong>Driver:</strong> {a.driverName}</p>
                <p><strong>Vehicle:</strong> {a.vehicleNumber}</p>
                <p><strong>Status:</strong> {a.status}</p>
                <p><strong>Requested By:</strong> {a.requestedBy}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AmbulanceService;
