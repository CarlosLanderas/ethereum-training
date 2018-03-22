import React, { Component } from "react";
import colors from './colors';
import lottery from "./lottery";
import web3 from "./web3";
class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    error: ""
  };

  async componentDidMount() {
    await this.loadData();
  }

  async loadData() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  async getSelectedAccount() {
    return new Promise((res, rej) => {
      web3.eth.getAccounts(function (error, account) {
        res(account[0]);
      });
    });
  }

  clearMessages() {
    this.setState({
      error: '',
      message: ''
    });
  }

  onSubmit = async event => {
    event.preventDefault();
    const account = await this.getSelectedAccount();

    this.setState({ message: "Waiting on transaction..." });

    await lottery.methods.enter().send({
      from: account,
      value: web3.utils.toWei(this.state.value, "ether"),
      gas: '100000',
      gasPrice: '1000000000'
    });

    this.setState({ message: "You have entered the lottery!" });
    await this.loadData();
  };

  onClick = async () => {
    this.clearMessages();
    const account = await this.getSelectedAccount();

    this.setState({ message: "Waiting while a winner is picked ..." });

    const transaction = await lottery.methods.pickWinner().send({
      from: account,
      gas: '100000'
    });

    if (Number(transaction.status) === 1) {
      this.setState({ message: "A winner has been picked!" });
      await this.loadData();
    }
    else {
      this.setState({ error: "Transaction failed" });
    }

  };

  render() {
    return (
      <div>
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{" "}
          <span style={colors.blue}>{this.state.players.length}</span>
          people entered, competing to win{" "}
          <span style={colors.blue}>{web3.utils.fromWei(this.state.balance, "ether")}</span> ether!
        </p>
        <hr />

        {this.state.players.length > 0 ? 
        <span style={colors.blue}>Address that joined lottery:</span> : null}
        

        {this.state.players.map( address => {
          return <p style={colors.purple}><span>{address}</span></p>
        })
        }

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <h1 style={colors.green}>{this.state.message}</h1>
        <h1 style={colors.red}>{this.state.error}</h1>
      </div>
    );
  }
}

export default App;
