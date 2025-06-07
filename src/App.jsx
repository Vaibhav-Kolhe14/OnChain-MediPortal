import { useState, useEffect } from 'react';
import { connectWallet, getContract } from './utils/connectWallet';
import { ToastContainer, toast } from 'react-toastify';
import PatientRegistration from "./components/PatientRegistration";
import DoctorRegistration from "./components/DoctorRegistration";
import AppointmentBooking from "./components/AppointmentBooking";
import BillManagement from "./components/BillManagement";
import ReportUpload from "./components/ReportUpload";
import AmbulanceService from "./components/AmbulanceService";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const init = async () => {
      const userAccount = await connectWallet();
      setAccount(userAccount);
      const contractInstance = await getContract();
      setContract(contractInstance);
    };
    init();
  }, []);

  useEffect(() => {
    const determineRole = async () => {
      if (contract && account) {
        try {
          console.log("Checking role for:", account);
          const admin = await contract.admin();
          console.log("Admin address from contract:", admin);
          const doctor = await contract.getDoctor(account);
          const patient = await contract.getPatient(account);

          if (account.toLowerCase() === admin.toLowerCase()) {
            setUserRole("admin");
          } else if (doctor.name) {
            setUserRole("doctor");
          } else if (patient.name) {
            setUserRole("patient");
          } else {
            setUserRole("");
          }
        } catch (err) {
          console.error("Role check error:", err);
        }
      }
    };
    determineRole();
  }, [contract, account]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Hospital Management DApp</h1>
        
        <div className="mb-6 text-center">
          <span className="text-gray-700 font-medium">Connected Wallet:</span>{" "}
          <span className="text-gray-900">{account || "Not connected"}</span>
        </div>

        {userRole === "admin" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-green-700">Admin Dashboard</h2>
            <DoctorRegistration contract={contract} />
            <AmbulanceService contract={contract} account={account} />
          </>
        )}

        {userRole === "doctor" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Doctor Dashboard</h2>
            <PatientRegistration contract={contract} />
            <BillManagement contract={contract} />
            <ReportUpload contract={contract} />
          </>
        )}

        {userRole === "patient" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-pink-700">Patient Dashboard</h2>
            <AppointmentBooking contract={contract} />
            <AmbulanceService contract={contract} account={account} />
          </>
        )}

        {userRole === "" && (
          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800 mt-6">
            You are not registered yet. Please contact the admin to get registered as a doctor or patient.
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={true} />
    </div>
  );
}

export default App;
