const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
debugger;
//We compile our solidity source file contract
//and require it's ABI and bytecode
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = "Initial";

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
   
    // Use one account to deploy contract bytecode
    inbox = await new web3.eth.Contract(JSON.parse(interface))
     .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
     .send({ from: accounts[0], gas: '1000000'});

     inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        const UPDATED_MESSAGE = "Updated";
        await inbox.methods
               .setMessage(UPDATED_MESSAGE)
               .send({ from : accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, UPDATED_MESSAGE);
    });
});