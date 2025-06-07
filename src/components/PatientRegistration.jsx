import React, { useState } from 'react';
import { toast } from 'react-toastify'; 

function PatientRegistration({ contract }) {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");

  const registerPatient = async () => {
    try {
      if (!address || !name || !age || !gender || !ipfsHash) {
        toast.error("Please fill in all fields."); 
        return;
      }

      const tx = await contract.registerPatient(address, name, parseInt(age), gender, ipfsHash);
      await tx.wait();

      toast.success("Patient Registered Successfully"); 

      // Reset fields
      setAddress("");
      setName("");
      setAge("");
      setGender("");
      setIpfsHash("");
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("Patient registration failed"); 
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Register Patient</h3>

      <div className="space-y-4">
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Patient Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="IPFS Hash (medical file)"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
        />
      </div>

      <button
        onClick={registerPatient}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
      >
        Register
      </button>
    </div>
  );
}

export default PatientRegistration;
