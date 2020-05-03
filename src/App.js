import React, { Component } from 'react';
import HomeApp from './components/HomeApp.js'
import DetailsApp from './components/DetailsApp.js'
import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Home',
      currentCoinID: 1
    }
  }

  render() {
    if(this.state.view === 'Details'){
      return (
        <DetailsApp displayHomeCallback = {this.displayHome} requestedCoinID = {this.state.currentCoinID}/>
      );
    }
    else {
      return (
        <HomeApp displayDetailsCallback = {this.displayDetails}/>
      );
    }
  }

  displayDetails = (coinID) => {
    this.setState({view: 'Details', currentCoinID: coinID});
  }

  displayHome = () => {
    this.setState({view: 'Home'});
  }
}

export default App;
