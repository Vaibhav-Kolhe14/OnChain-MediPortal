import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 

function ReportUpload({ contract }) {

  const [patient, setPatient] = useState("");
  const [reportHash, setReportHash] = useState("");
  const [reports, setReports] = useState([]);

  const handleUpload = async () => {
    try {
      const tx = await contract.uploadReport(patient, reportHash);
      await tx.wait();
      toast.success("Report uploaded successfully!");
      fetchReports(); 
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    }
  };

  const fetchReports = async () => {
    try {
      const fetched = await contract.getReports();
      setReports(fetched);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Report Upload</h2>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Patient Address"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Report IPFS Hash"
          value={reportHash}
          onChange={(e) => setReportHash(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Upload Report
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">All Reports</h3>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports available yet. Upload a report to get started.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map((report, index) => (
              <li key={index} className="border border-gray-200 p-4 rounded-lg shadow-md">
                <p><strong>Patient:</strong> {report.patient}</p>
                <p>
                  <strong>IPFS Link:</strong>{" "}
                  <a
                    href={`https://ipfs.io/ipfs/${report.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {report.ipfsHash}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ReportUpload;
