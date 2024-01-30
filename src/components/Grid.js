
import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { LicenseManager } from 'ag-grid-enterprise';
import Button from './Button/Button';

const licenseKey = process.env.REACT_APP_KEY;

LicenseManager.setLicenseKey(licenseKey);

class Grid extends Component {
  constructor(props) {
    super(props);

    this.gridRef = React.createRef();
    this.defaultColDef = {
      sortable: true,
      editable: true,
      resizable: true,
      cellClassRules: {
        'revenue-cell': (params) => { // color of forecast data in grid
          if (params.data.id === 'Statistical Forecast') {
            return params.value !== null && params.column.userProvidedColDef.headerName !== 'Type';
          }
        },
        'green-cell': (params) => {
          if (params.data.id === 'Actual Sales') { // color of actual sales data in grid
            return params.value !== null && params.column.userProvidedColDef.headerName !== 'Type';
          }
          return false;
        },
        'red-cell': (params) => {
          return params.column.colDef.editable === true;
        },
        'pink-cell': (params) => { // color of overlap cell
          if (
            params.data.id === 'Actual Sales' &&
            this.props.monthOverlapArr.includes(params.column.colId) &&
            params.value !== null
          ) {
            return true;
          }
          return false;
        }
      }
    };
    this.getRowId = (params) => params.data.id;

    // const { train_data, pred_data } = this.props;
    // this.avgSales = [];
    this.colArray = [];

    // // sets the default value of Average Sales on Grid to 10.59
    // if (train_data) {
    //   train_data['dates'].forEach((dateData) => {
    //     const { MonthEndDate } = dateData;
    //     // const dateString = new Date(date).toISOString().split('T')[0];
    //     this.avgSales.push({ [MonthEndDate]: 10.59 });
    //   });
    // }

    // if (pred_data) {
    //   pred_data['dates'].forEach((dateData) => {
    //     const { MonthEndDate } = dateData;
    //     // const dateString = new Date(date).toISOString().split('T')[0];
    //     this.avgSales.push({ [MonthEndDate]: 10.59 });
    //   });
    // }
    this.state = {
      flag: false, // Flag to indicate whether to expand the grid
    };
  }

  componentDidMount() {
    const styleElement = document.createElement('style');
    // to set the width of column cell in grid
    styleElement.innerHTML = `
      .ag-header-cell, .ag-header-group-cell {
        padding-right: 0 !important;
      }
    `;
    document.head.appendChild(styleElement);
  }

  componentWillUnmount() {
    const styleElement = document.querySelector('#ag-grid-styles');
    if (styleElement) {
      document.head.removeChild(styleElement);
    }
  }


  createData(flag) {
    const { train_data, pred_data } = this.props;
    // to set the row Name on grid.
    const columnDefs = [{ headerName: 'Type', valueGetter: 'node.id', pinned: true, width: 140 }]; // Set width for Type column
    const rows = [];
    const actualRow = { id: 'Actual Sales' };
    const predRow = { id: 'Statistical Forecast' };
    // const finalForecastOverride = { id: 'Final Forecast Override' };
    const avgSalesPrice = { id: 'Average Sales Price' };
    const revenue = { id: 'Revenue' };
    const monthlyAccuracy = { id: 'Monthly Accuracy %' };

    let itr = 0;

  
    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      const monthName = new Date(dateString).toLocaleString('default', { month: 'short' });
      const yearShort = year.slice(-2);
      return `${monthName} ${yearShort}`;
    };

    // const totalNumColumns = train_data['dates'].length + pred_data['dates'].length;
    // const startVisibleColumns = Math.min(8, totalNumColumns);
    // const endVisibleColumns = Math.max(totalNumColumns - 6, startVisibleColumns);

    const predLen = pred_data['dates'].length;
    const trainLen = train_data['dates'].length;

    for (let i = 0; i < train_data['dates'].length; i++) {
      if (flag || (i >= Math.max(0, trainLen - 14) && i < trainLen)) {
        const date = train_data['dates'][i]['MonthEndDate'];
        const formattedDate = formatDate(date);
        columnDefs.push({ field: date, headerName: formattedDate, width: 70 }); // Set width for other columns

        let actRowVal = parseFloat(train_data['dates'][i]['VolumeNineLitre'])
        actualRow[date] = actRowVal.toFixed(2);
        predRow[date] = null;
        // finalForecastOverride[date] = null;
        avgSalesPrice[date] = this.props.avgSales[itr][date];
        revenue[date] = (avgSalesPrice[date] * actualRow[date]).toFixed(2);
      }
      itr = itr+1;
    }

    for (let i = 0; i < pred_data['dates'].length; i++) {
      let flag_date = 0
      if (flag || (i >= 0 && i < Math.min(9, predLen))) {
        const date = pred_data['dates'][i]['MonthEndDate'];
        const formattedDate = formatDate(date);
        let actual_volume = 0
        for (let j in columnDefs){
          if (columnDefs[j]['field'] === date){
            actual_volume = actualRow[date]
            flag_date = 1
            break;
          }
        }
        if (flag_date === 0){
          monthlyAccuracy[date] = null
          actualRow[date] = null;
          columnDefs.push({ field: date, headerName: formattedDate, width: 70 }); // Set width for other columns
        }
        
        
        for (let model in pred_data['dates'][i]['models']){
          if (pred_data['dates'][i]['models'][model]['name'] === this.props.bestModel){
            predRow[date] =  parseFloat(pred_data['dates'][i]['models'][model]['VolumeNineLitre']).toFixed(2);
            if (flag_date === 1){
              // let actMonthAcc = (Math.round(pred_data['dates'][i]['models'][model]['VolumeNineLitre'])/actual_volume)*100;

              // let actMonthAcc = parseInt(actual_volume) === 0 ? ((((pred_data['dates'][i]['models'][model]['VolumeNineLitre']) - actual_volume)/1))*100 : ((((pred_data['dates'][i]['models'][model]['VolumeNineLitre']) - actual_volume)/actual_volume))*100;
              let actMonthAcc = parseFloat(100 - (((((pred_data['dates'][i]['models'][model]['VolumeNineLitre']) - actual_volume)) / (Math.abs(actual_volume) + 1e-10))*100));
              if(actMonthAcc < 0) 
              {
                monthlyAccuracy[date] = "(" + Math.abs(actMonthAcc).toFixed(2) + ")";
              } else {
                monthlyAccuracy[date] = Math.abs((actMonthAcc)).toFixed(2)
              }
            }
            break;
          }
        }
        
        // predRow[date] = Math.round(pred_data['dates'][i]['predictions']['forecast']);
        avgSalesPrice[date] = this.props.avgSales[itr][date];
        revenue[date] = (avgSalesPrice[date] * predRow[date]).toFixed(2);
      }
      itr = itr+1;
    }
    
    
    rows.push(actualRow);
    rows.push(predRow);
    // rows.push(finalForecastOverride);
    rows.push(avgSalesPrice);
    rows.push(revenue);
    rows.push(monthlyAccuracy);
  
    return { columnDefs, rowData: rows };
  }
  
  
  exportData = () => {
    this.gridRef.current.api.exportDataAsCsv();
  };


  async onCellValueChanged(event) {
    let train_data = this.props.train_data
    let pred_data = this.props.pred_data
    let meta_data = this.props.meta_data

    if (event.node.id === "Average Sales Price"){
      for (let i=0; i < this.props.avgSales.length; i++){
        let date = Object.keys(this.props.avgSales[i])[0];
        if (event.colDef.field === date){
          this.props.avgSales[i][date] = event.newValue;
          this.props.handlePredEditChange(train_data, pred_data, meta_data)
        }
      }
    }

    if (event.node.id === "Actual Sales"){
      for (let i=0; i< train_data['dates'].length; i++){
        if (event.colDef.field === train_data['dates'][i]['MonthEndDate']){
          train_data['dates'][i]['VolumeNineLitre'] = event.newValue
          this.props.handleTrainEditChange(train_data, pred_data, meta_data)
        }
      }
    }
    else if(event.node.id === "Statistical Forecast"){
      for (let i=0; i< pred_data['dates'].length; i++){
        if (event.colDef.field === pred_data['dates'][i]['MonthEndDate']){
          for (let model in pred_data['dates'][i]['models']){
            if (pred_data['dates'][i]['models'][model]['name'] === this.props.bestModel){
              pred_data['dates'][i]['models'][model]['VolumeNineLitre'] = event.newValue
              break;
            }
          }
          // pred_data['dates'][i]['predictions']['forecast'] = event.newValue
          this.props.handlePredEditChange(train_data, pred_data, meta_data)
        }
      }
    }
  }

  toggleGridExpansion() {
    this.setState((prevState) => ({
      flag: !prevState.flag,
    }));
  }

  render() {
    if (this.props.train_data !== null && this.props.pred_data !== null) {
      const { flag } = this.state;
      const data = this.createData(flag);

      return (
        <div>
          <div className="ag-theme-alpine">
            <Button name="Export CSV" function={this.exportData} />
            <div className="expand-link-container">
              <div className="expand-link">
                <button 
                  type="button"
                  class="btn btn-secondary btn-sm" 
                  style={{ fontSize: '15px' }} 
                  onClick={this.toggleGridExpansion.bind(this)}>
                  {flag ? '<' : '>'}
                </button>
              </div>
            </div>
            <button style={{fontSize: '15px', float: 'right', marginBottom: '2px', marginRight: '2px'}} 
              type="button" class="btn btn-success btn-sm" 
              onClick={this.props.downloadFun}>
                Download All
            </button>
            <div style={{ height: '270px' }}>
              <AgGridReact
                ref={this.gridRef}
                columnDefs={data.columnDefs}
                rowData={data.rowData}
                defaultColDef={this.defaultColDef}
                animateRows={true}
                rowSelection="multiple"
                onCellValueChanged={this.onCellValueChanged.bind(this)}
                getRowId={this.getRowId}
              />
            </div>
          </div>
        </div>
      );
      
    }
    else{
      return null
    }
  }
}

export default Grid;
