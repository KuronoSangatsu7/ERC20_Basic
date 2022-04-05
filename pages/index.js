import { useState, useEffect } from "react";
import {ethers} from "ethers";
import abi from "../utils/ERC20Basic.json";
import BigNumber from "bignumber.js";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [balance, setBalance] = useState(-1);

  const contractAddress = "0x2Eea3aae265319F0c50380136eFbFa6694B04ceb";
  const contractABI = abi.abi;

  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('We have an authorized account: ', account);
      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet")
    }
  };

  const getConnectedAccount = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }
  
    if (ethereum) {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      handleAccounts(accounts);
    }
  };
  useEffect(() => { getConnectedAccount() }, []);

  const connectAccount = async () => {
    if (!ethereum) {
      alert('MetaMask is required to connect an account');
      return;
    }
  
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    handleAccounts(accounts);
  };

  const getBalance = async () => {
    if (ethereum && connectedAccount) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const sccContract = new ethers.Contract(contractAddress, contractABI, signer);

      const balanceObject = await sccContract.balanceOf(connectedAccount);
      const balance = new BigNumber(balanceObject._hex).toNumber();
      console.log("Your balance:", balance);
      setBalance(balance)
    }
  }
  //useEffect(() => { getBalance() }, [connectedAccount])


  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site</p>
  }

  if (!connectedAccount) {
    return <button onClick={connectAccount}>Connect MetaMask Wallet</button>
  }

  return (
    <div>
      <p>Connected Account: {connectedAccount}</p>
      <button onClick={getBalance}>Get Balance</button>
      <p hidden={balance === -1 ? true : false}>{balance}</p>
    </div>
  );

}