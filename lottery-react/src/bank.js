const Promise = require('bluebird');
const prompt = require('prompt');
const Web3 = require('web3');
const provider = new Web3.providers.WebsocketProvider("ws://bc27sz6h4s7y.westeurope.cloudapp.azure.com:8546");
const web3 = new Web3(provider);
console.log(web3.version);

const abi = [{ "constant": true, "inputs": [], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256", "value": "100000000000000000" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getContractBalance", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "payTo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }];
const address = "0x5001E0852Fe95856A38675d18f3571C34B708169";
const contract = new web3.eth.Contract(abi, address);

const startup = async () => {    

    Promise.promisifyAll(prompt);
    await prompt.start();
    const { password } = await prompt.getAsync(
        { name: "password", hidden: true }
    );
    const unlockResult = await web3.eth.personal.unlockAccount("0x1dCC286F48caaa1C84a1bEA1EE64e3f8F6Dc9a00", password, 5000);
    console.log(`Unlock: ${unlockResult}`);
    
    console.log(await contract.getPastEvents("Transfer"));
    var accounts = await web3.eth.personal.getAccounts();

    console.log(accounts);
    var account = accounts[0];
    console.log(await getAccountBalance(account));

    const result = await contract.methods.payTo(accounts[1], "120").send({
        from: accounts[0],
        gas: '100000'
    });

    const lockResult = await web3.eth.personal.lockAccount(accounts[0]);
    console.log(`Locking account: ${lockResult}`);

    console.log("Transaction: " + result.transactionHash);
    console.log(`Account 0  now has: ${await getAccountBalance(accounts[0])}`);
    console.log(`Transfered account now has: ${await getAccountBalance(accounts[1])}`);

};

var getAccountBalance = async (account) => {
    const balance = await contract.methods.getBalance().call({
        from: account
    });
    return balance;
}

startup();