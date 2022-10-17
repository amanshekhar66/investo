const path = require('path');

const fs = require('fs');
const solc = require('solc');

const LotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');/*dirname is a constant defined by node and it 
always get set to the current work directory*/
const source = fs.readFileSync(LotteryPath, 'utf8');//to read in the contents of the file

module.exports = solc.compile(source, 1).contracts[':Lottery'];
/* We used module.exports so that we can use this compiled js file with other contracts as well*/
