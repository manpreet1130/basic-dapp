import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { contractABI, contractAddress } from './constants';


function App() {
	const [walletConnected, setWalletConnected] = useState(false);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [data, setData] = useState(null);
	const [val, setVal] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if(!window.ethereum) {
			console.error("No Metamask detected...");
			return;
		}
	}, []);

	window.ethereum.on("accountsChanged", handleAccountChanged);

	
	function handleAccountChanged(newAccount) {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	async function getProviderOrSigner(getSigner = false) {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
		setProvider(tempProvider);
		if(getSigner) {
			let tempSigner = tempProvider.getSigner();
			setSigner(tempSigner);
		}
	}

	async function handleConnectWallet() {
		try {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts"
			});
			handleAccountChanged(accounts[0]);
			setWalletConnected(true);
		} catch(err) {
			console.error(err);
		}
	}

	function updateEthers(){
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);
		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);
		let tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner);
		setContract(tempContract);
	}

	async function handleGetData() {
		if(!walletConnected) {
			window.alert("Connect wallet first...");
			return;
		}
		let tempData = await contract.getData();
		setData(tempData.toString());
	}

	async function handleSetData(event) {
		event.preventDefault();
		try {
			const tx = await contract.setData(event.target.setText.value);
			console.log("initiated transaction...");
			setLoading(true);
			await tx.wait();
			console.log("transaction complete...");
			setLoading(false);
		} catch(err) {
			console.error(err);
		}
		setVal('');
	}

	return (
		<div className="App">
			<h2> Basic dApp </h2>
			{
				!walletConnected ? <button onClick={handleConnectWallet}> Connect Wallet </button>
								: <h3> Address: {defaultAccount} </h3>	
			}
			<form onSubmit={handleSetData}>
				<input id="setText" placeholder="enter a number" type="text" value={val} onChange={(event) => setVal(event.target.value)}/>
				<button type="submit"> Set Data </button>
			</form>
			{loading && <h3> Loading... </h3>}
			<button onClick={handleGetData}> Get Data </button>
			<br/>
			{data}
		</div>
	);
}

export default App;