import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import CurrencyRenderer from './currencyRenderer.js';
import './HomeApp.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class HomeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [{
        headerName: "ID", field: "id", hide: true
      }, {
        headerName: "Name", field: "name", sortable: true, filter: true
      }, {
        headerName: "Symbol", field: "symbol", sortable: true, filter: true
      }, {
        headerName: "Market Cap", field: "quote.USD.market_cap", cellRenderer: 'currencyRenderer', sortable: true, filter: true
      }, {
        headerName: "Price", field: "quote.USD.price", cellRenderer: 'currencyRenderer', sortable: true, filter: true
      }],
      frameworkComponents: {
        currencyRenderer: CurrencyRenderer
      },
      defaultColDef: { sortable: true },
      rowSelection: 'single',
      orderBy: 'asc',
      sortBy: 'name'
    }
  }

  render() {
    return (
      <div>
        <div className = "container" style={{ width: '879px' }}>
          <div className = "row">
            <div className = "col-3">Coin Market Info</div>
            <div className = "col-3"></div>
            <div className = "col-3">
              <label htmlFor="orderBy">Order by:&nbsp;</label>
              <select id="orderBy" onChange={(ev) => this.onChangeOrderBy(ev)} value={this.state.orderBy}>
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
            </div>
            <div className = "col-3">
            <label htmlFor="SortBy">Sort by:&nbsp;</label>
              <select id="SortBy" onChange={(ev) => this.onChangeSortBy(ev)} value={this.state.sortBy}>
                <option value="name">Name</option>
                <option value="symbol">Symbol</option>
                <option value="quote.USD.market_cap">Market Cap</option>
                <option value="quote.USD.price">Price</option>
              </select>
            </div>
          </div>
          <div className = "row">
            <div
              className="ag-theme-alpine"
              style={{
              height: '700px',
              width: '100%' }}
            >
              <AgGridReact
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                frameworkComponents={this.state.frameworkComponents}
                onGridReady={this.onGridReady}
                onSortChanged={this.onSortChanged}
                rowSelection={this.state.rowSelection}
                onSelectionChanged={this.onSelectionChanged.bind(this)}
                pagination={true}
                paginationPageSize={25}>
              </AgGridReact>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onGridReady = (gridParams) => {
    this.gridApi = gridParams.api;
    this.gridColumnApi = gridParams.columnApi;

    let url = new URL('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
    let params = [['start', '1'], ['limit', '200']]
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
        //console.table(jsonResponse.data);
        this.setState(state => ({
          rowData: jsonResponse.data
        }));
      }).catch(function (error) {
        console.log('request failed', error);
      });
  }

  onSortChanged = () => {
    let sortRes = this.gridApi.getSortModel();
    this.setState({orderBy: sortRes[0].sort});
    this.setState({sortBy: sortRes[0].colId});
    this.gridApi.paginationGoToPage(0);
  }

  onChangeOrderBy = (event) => {
    var sort = [
      {
        colId: this.state.sortBy,
        sort: event.target.value
      }
    ];
    this.gridApi.setSortModel(sort);
  }

  onChangeSortBy = (event) => {
    var sort = [
      {
        colId: event.target.value,
        sort: this.state.orderBy
      }
    ];
    this.gridApi.setSortModel(sort);
  }

  onSelectionChanged = () => {
    var selectedRows = this.gridApi.getSelectedRows();
    if(selectedRows.length === 1){
      //alert(selectedRows[0].name);
      this.props.displayDetailsCallback(selectedRows[0].id);
    }
  };
}

export default HomeApp;
