// components/DoctorRegistration.js
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Importing toast notifications

function DoctorRegistration({ contract }) {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");

  const addDoctor = async () => {
    try {
      if (!address || !name || !specialization) {
        toast.error("Please fill in all fields.");
        return;
      }

      if (!contract) {
        toast.error("Smart contract not loaded.");
        return;
      }

      const tx = await contract.addDoctor(address, name, specialization);
      await tx.wait();

      toast.success("Doctor Registered Successfully");

      setAddress("");
      setName("");
      setSpecialization("");
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("Doctor registration failed.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white max-w-2xl mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-2 text-center">Doctor Registration</h2>
      <p className="text-sm text-gray-600 text-center mb-4">(Admin only)</p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Doctor Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={addDoctor}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded w-full"
        >
          Register Doctor
        </button>
      </div>
    </div>
  );
}

export default DoctorRegistration;
