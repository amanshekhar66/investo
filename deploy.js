const HDWalletProvider = require('truffle-hdwallet-provider'); //it will import the truufle wallet provider to our deploy script
const Web3 = require('web3');//to make the constructor Web3 
const { interface, bytecode } = require('./compile');// we use only one . with compile bacause we are now in the same level of compile.js

/*We are creating an instance of our wallet provider and specifying two things:
1. memonic string that will unlock our account
2. infura api for sepolia test network*/
const provider = new HDWalletProvider(
    'avoid chunk tilt slow depend affair shift execute angry spike skate episode', 
    'https://sepolia.infura.io/v3/9a05e6f7277d48d7b94fa9174ffec7b2'
);

const web3 =new Web3(provider);/*create instance of it (web3) and passing provider to it so that the web3 couldi nteract with our
Sepolia test network*/

/* We have to do two things here, firstly to make call the accoount at sepolia and secondly to deploy our contract through infura
api. We want to use async in both the cases but cant do directly and so we use create this fnc deploy and thats why we immidiately 
called deploy fnc*/
const deploy = async () => {
const accounts = await web3.eth.getAccounts();

console.log('Attempting to deploy from account', accounts[0]);
const result = await new web3.eth.Contract(JSON.parse(interface))
.deploy({ data: '0x' + bytecode })
.send ({ gas: '1000000', from: accounts[0] });

console.log('Contract deployed to', result.options.address);
};
deploy();