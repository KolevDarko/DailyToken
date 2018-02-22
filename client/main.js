// var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
$(document).ready(function() {
var web3 = window.web3;
var abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "supply",
          "type": "uint256"
        },
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "tokenOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "remaining",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
var TokenContract = web3.eth.contract(abi);
var contractInstance = TokenContract.at('0xa9c8dd3db76a787df23c6b8236ed48e8698548ee');

var owner = '';
var filter = null;
var inTs = {};
var outTs = {};

function getPastTransfers(myAddr){
  inTs = {};
  outTs = {};
  let loadedAll = _.after(2, renderTables)
  contractInstance.Transfer({from: myAddr}, { fromBlock: 0, toBlock: 'latest' }).get(function(error, events){
    if (error)
      console.log('Error in getting outgoing transfers: ' + error);
    else{
      outTs = [];
      events.forEach(function(event){
        outTs[event.transactionHash] = event.args;
      })
      loadedAll();
    }
  });

  contractInstance.Transfer({to: myAddr}, { fromBlock: 0, toBlock: 'latest' }).get(function(error, events){
    if (error)
      console.log('Error in getting incoming transfers: ' + error);
    else{
      inTs = [];
      events.forEach(function(event){
        inTs[event.transactionHash] = event.args;
      })
      loadedAll();
    }
  });
}

function renderTables(){
  let inTbl = $('#inTbl').find('tbody');
  inTbl.html('');
  Object.values(inTs).forEach(function(event){
    let row = createRow(event, 'from');
    inTbl.append(row);
  });
  let outTbl = $('#outTbl').find('tbody');
  outTbl.html('');
  Object.values(outTs).forEach(function(event){
    let row = createRow(event, 'to');
    outTbl.append(row);
  });
}
function createRow(event, field){
    return [
      '<tr>',
        '<td>'+ event[field] +'</td>',
        '<td>'+ event['tokens'] +'</td>',
      '</tr>'
    ].join('');
} 
function updateBalance(myAddr) {
  let balance = checkBalance(myAddr);
  $('#showBalance').html("Your balance is " + balance);   
}

function createEventFilter(myAddr){
  filter = contractInstance.Transfer({});
  console.log("Listening for transfers to and from " + myAddr);
  filter.watch(function(error, result){
    if(!error){
      let eventData = result.args;
      if(eventData.from == myAddr){
        if(!outTs[result.transactionHash]){
          updateBalance(myAddr);
          let outTbl = $('#outTbl').find("tbody");
          outTbl.append(createRow(eventData, 'to'));
          outTs[result.transactionHash] = eventData;
        }
      }
      if(eventData.to == myAddr){
        if(!inTs[result.transactionHash]){
          updateBalance(myAddr);
          let inTbl = $('#inTbl').find("tbody");
          inTbl.append(createRow(eventData, 'from'));  
          inTs[result.transactionHash] = eventData;
        }        
      }
    }else{
      console.log("Got event error");
      console.log(error);
    }
  });
}

// 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
// rec. 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5

function checkBalance(accountAddr, clb){
  contractInstance.balanceOf.call(accountAddr, {from: accountAddr}, clb);  
}

function sendTokens(senderAddr, recipientAddr, amount, clb){
  contractInstance.transfer(recipientAddr, amount, {from: senderAddr}, function() {
    checkBalance(recipientAddr, clb);
  })
}


  $('#checkBalanceBtn').click(function(){    
    owner = $('#ownerAddress').val();
    checkBalance(owner, function(err, rez){
      console.log("async balance rez");
      console.log(rez);
      $('#showBalance').html("Your balance is " + rez.toString());
    });
  });

  $('#sendTokensBtn').click(function(){
    let sender = $('#senderAddress').val();
    let recipient = $('#recipientAddress').val();
    let amount = $('#amount').val();
    sendTokens(sender, recipient, amount, function(err, rez){
      $('#showBalance').html("Your balance is " + rez.toString());
    });
  })

  $("#listenAddress").click(function(){
    let sender =  $("#ownerAddress").val();
    getPastTransfers(sender);
    createEventFilter(sender);
  });

});
