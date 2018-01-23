const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'method turn ordinary work nut shiver bargain shoe slush first bachelor obey',
    'https://rinkeby.infura.io/LtjZFi6C8XO0qkthtI7p'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Starting to deploy from account', accounts[0]);

    const contract = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode, arguments: ['initial'] })
      .send({ from: accounts[0], gas: '1000000'});
    console.log('Contract deployed to', contract.options.address);
};

deploy();