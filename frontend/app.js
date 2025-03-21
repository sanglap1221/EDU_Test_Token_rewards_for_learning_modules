const contractAddress = "0x7C4DDBcb27619883C561AaC082dB37d7CBbfEEdC";
const abi = [ 
    [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_rewardAmount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "TokensRewarded",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "completeModule",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "completedModules",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getUserTokens",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "projectDescription",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "projectTitle",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "rewardAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "userTokens",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

let web3;
let contract;
let account;

document.getElementById("connectWallet").addEventListener("click", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];

        // ✅ Ensure the wallet address is updated properly
        const walletAddressElement = document.getElementById("walletAddress");
        walletAddressElement.innerText = `Connected: ${account}`;

        // ✅ Optional: Show a shortened version of the address
        walletAddressElement.innerText = `Connected: ${account.substring(0, 6)}...${account.slice(-4)}`;

        // ✅ Initialize Contract
        contract = new web3.eth.Contract(abi, contractAddress);

        // ✅ Load data
        loadProjectDetails();
        updateTokenBalance();
        loadModules();
    } else {
        alert("Please install MetaMask!");
    }
});


async function loadProjectDetails() {
    try {
        const desc = await contract.methods.projectDescription().call();
        document.getElementById("projectDesc").innerText = desc;
    } catch (error) {
        console.error("Error fetching project details:", error);
    }
}

async function updateTokenBalance() {
    if (!contract) return;
    try {
        let balance = await contract.methods.getUserTokens(account).call();
        document.getElementById("tokenBalance").innerText = `Tokens: ${balance}`;
    } catch (error) {
        console.error("Error fetching token balance:", error);
    }
}

async function loadModules() {
    const modulesContainer = document.getElementById("modules");
    modulesContainer.innerHTML = "";

    const modules = [
        { id: 1, title: "📖 Blockchain Basics", desc: "Earn tokens by completing this module." },
        { id: 2, title: "🔗 Smart Contracts", desc: "Master Solidity and get rewarded!" },
        { id: 3, title: "📲 DApps Development", desc: "Learn how to build decentralized apps." }
    ];

    for (let module of modules) {
        let completed = await contract.methods.completedModules(account).call();
        let moduleDiv = document.createElement("div");
        moduleDiv.classList.add("module");
        moduleDiv.innerHTML = `
            <h2>${module.title}</h2>
            <button class="completeModule" data-module="${module.id}" ${completed ? "disabled" : ""}>
                ${completed ? "✅ Completed" : "✅ Complete & Claim"}
            </button>
        `;
        modulesContainer.appendChild(moduleDiv);
    }

    document.querySelectorAll(".completeModule").forEach(button => {
        button.addEventListener("click", async () => {
            if (!contract) {
                alert("Connect wallet first!");
                return;
            }

            try {
                await contract.methods.completeModule(account).send({ from: account });
                alert("Module completed! Tokens rewarded.");
                updateTokenBalance();
                loadModules();
            } catch (error) {
                console.error(error);
                alert("Error completing module.");
            }
        });
    });
}
