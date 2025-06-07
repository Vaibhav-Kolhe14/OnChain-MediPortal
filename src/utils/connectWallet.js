//My dummy wallet connection file
import { ethers } from "ethers";
import contractABI from '../constants/contractABI.json'

// Replace this with your actual deployed contract address from Remix
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS // exxchnage with your address

// Function to connect wallet and return account address
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this DApp.");
      return null;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("\nselectedaccount :", accounts[0])
    return accounts[0];
  } catch (error) {
    console.error("Wallet connection error:", error);
    return null;
  }
};

// Function to get the contract instance
export const getContract = async () => {
  try {
    if (!window.ethereum) throw new Error("MetaMask is not installed.");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log("\nfrom connectWallet.js Contract", contract)

    return contract;
  } catch (error) {
    console.error("Error getting contract:", error);
    return null;
  }
};
