import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AppointmentBooking({ contract }) {
  const [doctors, setDoctors] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const sampleDoctorAddresses = [
        "0x1234567890abcdef1234567890abcdef12345678",
        "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
      ];

      const fetchedDoctors = await Promise.all(
        sampleDoctorAddresses.map(async (address) => {
          const doc = await contract.getDoctor(address);
          return {
            name: doc.name,
            specialization: doc.specialization,
            address: address,
          };
        })
      );

      setDoctors(fetchedDoctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    try {
      if (!selectedDoctor || !appointmentDate) {
        toast.warning("Please select a doctor and date");
        return;
      }

      const tx = await contract.bookAppointment(selectedDoctor, appointmentDate);
      await tx.wait();

      toast.success("Appointment booked successfully");
      setSelectedDoctor('');
      setAppointmentDate('');
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Failed to book appointment");
    }
  };

  useEffect(() => {
    if (contract) {
      fetchDoctors();
    }
  }, [contract]);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h3 className="text-xl font-bold text-center text-blue-700 mb-6">Book an Appointment</h3>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading doctors...</p>
        ) : (
          <>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc, index) => (
                <option key={index} value={doc.address}>
                  {doc.name} - {doc.specialization}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={bookAppointment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Book Appointment
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AppointmentBooking;
