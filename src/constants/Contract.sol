// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HospitalManagement {
    struct Patient {
        string name;
        uint age;
        string gender;
        string ipfsHash;
        address patientAddress;
    }

    struct Doctor {
        string name;
        string specialization;
        address doctorAddress;
    }

    struct Appointment {
        address patient;
        address doctor;
        string appointmentDate;
    }

    struct Bill {
        address patient;
        string description;
        uint amount;
    }

    struct Report {
        address doctor;
        address patient;
        string ipfsHash;
        string description;
        bool isLabReport;
    }

    struct Ambulance {
        uint id;
        string driverName;
        string vehicleNumber;
        string status; // Available, En Route, Completed
        address requestedBy;
    }

    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    Appointment[] public appointments;
    Bill[] public bills;
    Report[] public reports;
    Ambulance[] public ambulances;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier onlyDoctor() {
        require(bytes(doctors[msg.sender].name).length > 0, "Not a doctor");
        _;
    }

    function registerPatient(address _address, string memory _name, uint _age, string memory _gender, string memory _ipfsHash) public onlyDoctor {
        patients[_address] = Patient(_name, _age, _gender, _ipfsHash, _address);
    }

    function addDoctor(address _address, string memory _name, string memory _specialization) public onlyAdmin {
        doctors[_address] = Doctor(_name, _specialization, _address);
    }

    function bookAppointment(address _doctor, string memory _date) public {
        require(bytes(patients[msg.sender].name).length > 0, "Not a patient");
        require(bytes(doctors[_doctor].name).length > 0, "Doctor not found");
        appointments.push(Appointment(msg.sender, _doctor, _date));
    }

    function addBill(address _patient, string memory _description, uint _amount) public onlyDoctor {
        bills.push(Bill(_patient, _description, _amount));
    }

    function uploadReport(address _patient, string memory _ipfsHash, string memory _desc, bool _isLabReport) public onlyDoctor {
        reports.push(Report(msg.sender, _patient, _ipfsHash, _desc, _isLabReport));
    }

    function addAmbulance(string memory _driverName, string memory _vehicleNumber) public onlyAdmin {
        ambulances.push(Ambulance(ambulances.length, _driverName, _vehicleNumber, "Available", address(0)));
    }

    function requestAmbulance(uint _id) public {
        require(bytes(patients[msg.sender].name).length > 0, "Not a patient");
        require(_id < ambulances.length, "Invalid ambulance ID");
        Ambulance storage amb = ambulances[_id];
        require(keccak256(bytes(amb.status)) == keccak256("Available"), "Ambulance not available");
        amb.status = "En Route";
        amb.requestedBy = msg.sender;
    }

    function completeAmbulanceService(uint _id) public onlyAdmin {
        require(_id < ambulances.length, "Invalid ID");
        Ambulance storage amb = ambulances[_id];
        amb.status = "Completed";
    }

    function getAppointments() public view returns (Appointment[] memory) {
        return appointments;
    }

    function getBills() public view returns (Bill[] memory) {
        return bills;
    }

    function getReports() public view returns (Report[] memory) {
        return reports;
    }

    function getAmbulances() public view returns (Ambulance[] memory) {
        return ambulances;
    }

    function getPatient(address _address) public view returns (Patient memory) {
        return patients[_address];
    }

    function getDoctor(address _address) public view returns (Doctor memory) {
        return doctors[_address];
    }
}