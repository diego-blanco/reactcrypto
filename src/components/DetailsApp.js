import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import './DetailsApp.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class DetailsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCoin: {},
      currentCoinQuoteByUSD: {},
      loadingActive: false
    }
  }

  render() {
    return (
      <LoadingOverlay
        active={this.state.loadingActive}
        spinner
        text='Loading coin details...'
        >
      <div>
        <div className = "container" style={{ width: '550px' }}>
          <div className = "row">
            <div className = "col-9">
              <h3>Details for {this.state.currentCoin.name}</h3>
            </div>
            <div className = "col-3">
              <button className="goHomeButton" onClick={this.onGoHomeButtonClicked}>Go Home</button>
            </div>
          </div>
          <div className = "row">
            <div className = "col-12">
              <table className="blueTable">
                <tbody>
                  <tr>
                    <td>Id</td>
                    <td>{this.state.currentCoin.id}</td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>{this.state.currentCoin.name}</td>
                  </tr>
                  <tr>
                    <td>Symbol</td>
                    <td>{this.state.currentCoin.symbol}</td>
                  </tr>
                  <tr>
                    <td>Is Active</td>
                    <td>{this.state.currentCoin.is_active === 1 ? 'Yes' : (this.state.currentCoin.is_active === 0 ? 'No' : '')}</td>
                  </tr>
                  <tr>
                    <td>Max Supply</td>
                    <td>{this.state.currentCoin.max_supply}</td>
                  </tr>
                  <tr>
                    <td>Circulating supply</td>
                    <td>{this.state.currentCoin.circulating_supply}</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>${this.state.currentCoinQuoteByUSD.price}</td>
                  </tr>
                  <tr>
                    <td>Market Cap</td>
                    <td>${this.state.currentCoinQuoteByUSD.market_cap}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </LoadingOverlay>
    );
  }

  componentDidMount()
  {
    this.setState({loadingActive: true});
    let url = new URL('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest');
    let params = [['id', this.props.requestedCoinID]];
    url.search = new URLSearchParams(params).toString();

    let myHeaders = new Headers();
    myHeaders.append('X-CMC_PRO_API_KEY', `${process.env.REACT_APP_CMC_API_KEY}`);

    const myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default'
    };

    fetch(url, myInit)
      .then(data => data.json())
      .then((jsonResponse) => {
        //console.log(jsonResponse.data);
        this.setState(prevstate => ({
          currentCoin: jsonResponse.data[this.props.requestedCoinID]
        }));
        this.setState(prevstate => ({
          currentCoinQuoteByUSD: jsonResponse.data[this.props.requestedCoinID].quote.USD
        }));
        this.setState({loadingActive: false});
      }).catch(function (error) {
        console.log('request failed', error);
        this.setState({loadingActive: false});
      });
  }

  onGoHomeButtonClicked = () => {
    this.props.displayHomeCallback();
  }
}

export default DetailsApp;
