const assert = require('assert');
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants');
const  ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode} = require('../compile');


let lottery;
let accounts;
beforeEach(async () => {
accounts = await web3.eth.getAccounts();

lottery = await new web3.eth.Contract(JSON.parse(interface))
   .deploy({ data: bytecode})
   .send({ from: accounts[0], gas:'1000000'});// its all a one statement and that's why the ';' is end of send statement
});

describe('Lottery Contract', () =>{
    it('deploys a contract', () =>{
        assert.ok(lottery.options.address);// her the lottery is not the contract but the variable we declare above
    });
    it('allows one account to enter', async () =>{
        await lottery.methods.enter().send({// we are testing our enter fnc from our contract
            from: accounts[0], value: web3.utils.toWei('0.02', 'ether')// utils fnc is used to convert ether into Wei
        });
        const players = await lottery.methods.getPlayers().call({//we our testing our getPlayers fnc from the contract
            from: accounts[0]
        });
        
        assert.equal(accounts[0], players[0]);
            assert.equal(1, players.length);/*In assert.equal the first argument should be the known one and the second one
            should be the one we want to test*/
    });
    it('allows multiple accounts to enter', async () =>{
        await lottery.methods.enter().send({// we are testing our enter fnc from our contract
            from: accounts[0], value: web3.utils.toWei('0.02', 'ether')// utils fnc is used to convert ether into Wei
        });
        await lottery.methods.enter().send({// we are testing our enter fnc from our contract
            from: accounts[1], value: web3.utils.toWei('0.02', 'ether')// utils fnc is used to convert ether into Wei
        });
        await lottery.methods.enter().send({// we are testing our enter fnc from our contract
            from: accounts[2], value: web3.utils.toWei('0.02', 'ether')// utils fnc is used to convert ether into Wei
        });
        const players = await lottery.methods.getPlayers().call({//we our testing our getPlayers fnc from the contract
            from: accounts[0]
        });
        
        assert.equal(accounts[0], players[0]);
        
        assert.equal(accounts[1], players[1]);
        
        assert.equal(accounts[2], players[2]);
            assert.equal(3, players.length);/*In asser.equal the first argument should be the known one and the second one
            should be the one we want to test*/
    });
    it('requires a minimum amount of ether', async () => {
        try{/*it is used to catch an error and so if the  statements in the try block dont have any error they gets executed normally 
            but if they have some error , catch block will be triggered*/
        await lottery.methods.entry().send({
            from: accounts[0],
            value: 0
        
        });
assert(false);// it will fail the program no matter what if for some reason the statement in try block gets executed 
    } catch (err) {// the code is working because we have  asserted the error in catch statement
        assert(err);// it is used to check whether the statement is true or false
    }
    });
    it('only manager can call the pickWinner fnc', async () => {
        try{
await lottery.methods.pickWinner().send({
    from: accounts[1]
});
assert(false);
        } catch(err) {
            assert(err);
        }
    });
    it('sends money to the winner and reset the players array', async () =>{
await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei('1', 'ether')
});
const initialBalance = await web3.eth.getBalance(accounts[0]);/*this fnc will get us the amount of ether in form of wei assigned to the
 given address of the contract or account and in this case its accounts[0]*/
await lottery.methods.pickWinner().send({
    from: accounts[0]
});
const finalBalance = await web3.eth.getBalance(accounts[0]);
const diff = finalBalance - initialBalance;
console.log(diff);
assert(diff > web3.utils.toWei('0.8', 'ether'));
const players = await lottery.methods.getPlayers().call({//we our testing our getPlayers fnc from the contract
    from: accounts[0]});
assert.equal(0, players.length);// it ensures that players list has been restored to zero
    });
});