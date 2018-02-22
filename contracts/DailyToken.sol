pragma solidity 0.4.19;

contract DailyToken {
    address public owner;
    uint256 public totalSupply;
	mapping(address => uint256) balances;
	mapping (address => mapping (address => uint256)) allowed;
	event Transfer(address indexed from, address indexed to, uint tokens);
  event Approval(address indexed tokenOwner, address indexed spender, uint tokens); 
	
  function DailyToken(uint256 supply, address _owner){
	  totalSupply = supply;
	  owner = _owner;
    balances[owner] = totalSupply;
  }

  function transfer(address _to, uint256 _value) returns (bool) {
    assert(_value <= balances[msg.sender]);
    balances[msg.sender] = balances[msg.sender] - _value;
    uint256 result = balances[_to] + _value;
    assert(result >= balances[_to]);
    balances[_to] = result;
    Transfer(msg.sender, _to, _value);
    return true;
  }
  function balanceOf(address _owner) constant returns (uint256 balance) {
    return balances[_owner];
  }

  function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

function approve(address _spender, uint256 _value) returns (bool) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
    var _allowance = allowed[_from][msg.sender];
    assert(_value <= _allowance);
    allowed[_from][msg.sender] = _allowance - _value;    
    uint256 _result = balances[_to] + _value;
    assert(_result >= balances[_to]);
    balances[_to] = _result;
    assert(_value <= balances[_from]);
    balances[_from] = balances[_from] - _value;
    Transfer(_from, _to, _value);
    return true;
  }
}
