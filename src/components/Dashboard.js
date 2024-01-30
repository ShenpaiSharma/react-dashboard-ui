///api/mlops/train/?brand=Baileys Original
import React, { Component } from 'react';
import Grid from './Grid';
import Models from './Models';
import axios from 'axios';
import TimeSeriesChart from './timeSeriesChart';
// import CascDropDown from './CascDropDown/CascDropDown';
import Backdrop from '@mui/material/Backdrop';
import Filter from './Filter';
import { saveAs } from 'file-saver';
import { CircularProgress } from '@mui/material';
// import { month } from 'ag-charts-community/dist/cjs/es5/util/time';

class Dashboard extends Component {
  initial_pred_data = null
  constructor(props) {
    super(props);
    this.state = {
      train_data: "null",
      pred_data: "null",
      isMounted: false,
      chartData: "null",
      defBrandObj: null,
      metadata: {},
      isLoading: true,
      currentFilter: this.props.brand,
      avgSales: [],
      monthacc: []
    };
    this.handleTrainEditChange = this.handleTrainEditChange.bind(this);
  
    this.options = []
    this.overlapArr = []
    this.brandObj = {}
    this.defBrandObj = null
  }

  componentDidMount() {
    if (!this.state.isMounted){
      this.getBrandOptions()
      this.set_initial_data()
      // let train_data = this.get_train_data(this.props.brand)
      // let pred_data = this.get_pred_data(this.props.brand)
      // this.generate_chart_data(train_data,pred_data)
    }
  }
  
  handleFilter = (currentFilter) => {
    this.set_filter_data(currentFilter)
  }

  async set_initial_data(){ // fetcheds the data when page is laoded
    const baseApiURL = this.props.baseApiURL; // Use the prop for the base API URL

    let train_url = `${baseApiURL}/training/?key=${this.props.brand.replaceAll(' ', '%20').replaceAll('&', '%26')}`;
    let pred_url = `${baseApiURL}/predictions/?key=${this.props.brand.replaceAll(' ','%20').replaceAll('&', '%26')}`;
    let metadata_url = `${baseApiURL}/metadata/?key=${this.props.brand.replaceAll(' ','%20').replaceAll('&', '%26')}`;

    let train_data = await axios.get(train_url);
    let pred_data =  await axios.get(pred_url);
    let metadata =  await axios.get(metadata_url);


    let nonZeroIndex = 0;
    for (let i = 0; i < train_data.data['dates'].length; i++) {
      if (Math.round(train_data.data['dates'][i]["VolumeNineLitre"]) !== 0) {
        nonZeroIndex = i;
        break;
      }
    }
    let new_data = train_data;
    new_data.data['dates'] = new_data.data['dates'].slice(nonZeroIndex);
    train_data.data['dates'] = new_data.data['dates'];

    let avgSales = [];
    // sets the default value of Average Sales on Grid to 10.59
    if (train_data.data) {
      train_data.data['dates'].forEach((dateData) => {
        const { MonthEndDate } = dateData;
        // const dateString = new Date(date).toISOString().split('T')[0];
        avgSales.push({ [MonthEndDate]: 10.59 });
      });
    }

    if (pred_data.data) {
      pred_data.data['dates'].forEach((dateData) => {
        const { MonthEndDate } = dateData;
        // const dateString = new Date(date).toISOString().split('T')[0];
        avgSales.push({ [MonthEndDate]: 10.59 });
      });
    }

    let chartData = this.generate_chart_data(train_data.data,pred_data.data,metadata.data)

    this.setState({
      train_data: train_data.data,
      pred_data: pred_data.data,
      chartData: chartData,
      metadata: metadata.data,
      currentFilter: this.props.brand,
      avgSales: avgSales
    });
    // Math.round(train_data['dates'][i]['VolumeNineLitre'])
  }

  async set_filter_data(currentFilter){ // call the api and when filter for brand changes
    const baseApiURL = this.props.baseApiURL; // Use the prop for the base API URL

    let train_url = `${baseApiURL}/training/?key=${currentFilter.replaceAll(' ', '%20').replaceAll('&', '%26')}`;
    let pred_url = `${baseApiURL}/predictions/?key=${currentFilter.replaceAll(' ','%20').replaceAll('&', '%26')}`;
    let metadata_url = `${baseApiURL}/metadata/?key=${currentFilter.replaceAll(' ','%20').replaceAll('&', '%26')}`;

    let train_data = await axios.get(train_url);
    let pred_data =  await axios.get(pred_url);
    let metadata =  await axios.get(metadata_url);

    let nonZeroIndex = 0;
    for (let i = 0; i < train_data.data['dates'].length; i++) {
      if (Math.round(train_data.data['dates'][i]["VolumeNineLitre"]) !== 0) {
        nonZeroIndex = i;
        break;
      }
    }
    let new_data = train_data;
    new_data.data['dates'] = new_data.data['dates'].slice(nonZeroIndex);
    train_data.data['dates'] = new_data.data['dates'];

    let avgSales = [];
    // sets the default value of Average Sales on Grid to 10.59
    if (train_data.data) {
      train_data.data['dates'].forEach((dateData) => {
        const { MonthEndDate } = dateData;
        // const dateString = new Date(date).toISOString().split('T')[0];
        avgSales.push({ [MonthEndDate]: 10.59 });
      });
    }

    if (pred_data.data) {
      pred_data.data['dates'].forEach((dateData) => {
        const { MonthEndDate } = dateData;
        // const dateString = new Date(date).toISOString().split('T')[0];
        avgSales.push({ [MonthEndDate]: 10.59 });
      });
    }

    let chartData = this.generate_chart_data(train_data.data,pred_data.data,metadata.data)


    this.setState({
      train_data: train_data.data,
      pred_data: pred_data.data,
      metadata: metadata.data,
      chartData: chartData,
      currentFilter: currentFilter,
      avgSales: avgSales
    });
  }

  downloadAll(train_data, pred_data, brandName, brandVariantName, stateName, sizeVal) {
    // converts data in required json format for download all func.
    let data = []
    // let currentYear, nextYear, startMonth, endMonth;
    if (typeof pred_data !== 'undefined' && pred_data['dates']) {
      for (let i = 0; i < pred_data['dates'].length; i++) {
          let template_pred = {}

          template_pred['MonthEndDate'] = pred_data['dates'][i]['MonthEndDate']
          template_pred['Brand'] = brandName;
          template_pred['Brand Variant'] = brandVariantName;
          template_pred['size'] = sizeVal;
          template_pred['state'] = stateName;

          template_pred['forecast'] =  Math.round(pred_data['dates'][i]['models'][0]['VolumeNineLitre']);
          
          // for (let model in pred_data['dates'][i]['models']){
          //   template_pred['forecast'] =  Math.round(pred_data['dates'][i]['models'][model]['VolumeNineLitre']);
          // }
          data.push(template_pred)
      }
    }
    
    return data;
  }

  fun = async () => {
    try {
      const baseApiURL = this.props.baseApiURL; // Use the prop for the base API URL
      // Fetch the CSV data from the API
      const response = await axios.get(`${baseApiURL}/download/`, {
        responseType: 'blob',
      });
  
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });

      saveAs(blob, 'data.csv');
    } catch (error) {
      console.error('Error occurred while downloading data:', error);
    }
  }

  jsonToCsv = (json) => {
  const headers = Object.keys(json[0]);
  const csvRows = [];

  // Add the headers as the first row
  csvRows.push(headers.join(','));

  // Convert each JSON object to a CSV row
  for (const item of json) {
    const values = headers.map((header) => item[header]);
    csvRows.push(values.join(','));
  }

  // Join the CSV rows into a single string
  return csvRows.join('\n');
};

generate_chart_data(train_data, pred_data, meta_data) { // generated the chart data when page is loaded.
  this.overlapArr = []
  let monthacc = []
  try {
    let data = []
    for (let i = 0; i < train_data['dates'].length; i++) {
      let template_train = {}
      template_train['MonthEndDate'] = train_data['dates'][i]['MonthEndDate'];
      template_train['VolumeNineLitre'] = Math.round(train_data['dates'][i]['VolumeNineLitre']);
      
      data.push(template_train)
    }
    for (let i = 0; i < pred_data['dates'].length; i++) {
      let flag_date = 0
      for (let j in data){ // this contains overlapping value between pred and train data
        if (data[j]['MonthEndDate'] === pred_data['dates'][i]['MonthEndDate']){
          this.overlapArr.push(data[j]['MonthEndDate']);
          let actual = data[j]['VolumeNineLitre'];
          if(i === 0) { // setting the first value of overlap value into actual sales to join th line between them
            data[j]['VolumeNineLitre'] = actual;
          } else {
            data[j]['VolumeNineLitre'] = null;
          }
          data[j]['actual'] = actual;
          for (let model in pred_data['dates'][i]['models']){
            data[j][pred_data['dates'][i]['models'][model]['name']] =  Math.round(pred_data['dates'][i]['models'][model]['VolumeNineLitre']);
            // pred_acc = Math.max(pred_acc, data[j][pred_data['dates'][i]['models'][model]['name']])
          }
          let pred_acc = data[j][meta_data.bestModel];
          let monthaccVal = parseFloat((Math.abs(((pred_acc) - actual)) / (Math.abs(actual) + 1e-10))*100);
          monthacc.push(parseFloat(monthaccVal));
          flag_date = 1
          break;
        }
      }
      if (flag_date === 0){
        let template_pred = {}
        template_pred['actual'] = null;
        template_pred['MonthEndDate'] = pred_data['dates'][i]['MonthEndDate']
        
        for (let model in pred_data['dates'][i]['models']){
          template_pred[pred_data['dates'][i]['models'][model]['name']] =  Math.round(pred_data['dates'][i]['models'][model]['VolumeNineLitre']);
        }
        data.push(template_pred)
      } 
    }
    this.setState({monthacc: monthacc})
    return(data)
  } catch (error) {
    this.setState({
      loading: false,
      error: 'Error occurred while fetching data.',
    });
  }
}

  update_line_chart(train_data, pred_data, meta_data) { // when grid cell value is changed this func is called
    let data = []
    let monthacc = []
    try {
      for (let i = 0; i < train_data['dates'].length; i++) {
          let template_train = {}
          template_train['MonthEndDate'] = train_data['dates'][i]['MonthEndDate'];
          template_train['VolumeNineLitre'] = Math.round(train_data['dates'][i]['VolumeNineLitre']);
          
          data.push(template_train)
      }
      for (let i = 0; i < pred_data['dates'].length; i++) {
          let flag_date = 0
          for (let j in data){
            if (data[j]['MonthEndDate'] === pred_data['dates'][i]['MonthEndDate']){
              let actual = data[j]['VolumeNineLitre'];
              if(i === 0) {
                data[j]['VolumeNineLitre'] = actual;
              } else {
                data[j]['VolumeNineLitre'] = null;
              }
              data[j]['actual'] = actual;
              for (let model in pred_data['dates'][i]['models']){
                data[j][pred_data['dates'][i]['models'][model]['name']] =  Math.round(pred_data['dates'][i]['models'][model]['VolumeNineLitre']);
                // pred_acc = Math.max(pred_acc, data[j][pred_data['dates'][i]['models'][model]['name']])
              }
              let pred_acc = data[j][meta_data.bestModel];
              // let monthaccVal = parseInt(actual) === 0 ? (Math.abs(((pred_acc) - actual)/1)*100).toFixed(2) : (Math.abs(((pred_acc) - actual)/actual)*100).toFixed(2)
              let monthaccVal = parseFloat((Math.abs(((pred_acc) - actual)) / (Math.abs(actual) + 1e-10))*100);
              monthacc.push(parseFloat(monthaccVal));
              flag_date = 1
              break;
            }
          }
          if (flag_date === 0){
            let template_pred = {}
            template_pred['actual'] = null;
            template_pred['MonthEndDate'] = pred_data['dates'][i]['MonthEndDate']
            
            for (let model in pred_data['dates'][i]['models']){
              template_pred[pred_data['dates'][i]['models'][model]['name']] =  Math.round(pred_data['dates'][i]['models'][model]['VolumeNineLitre']);
            }
            data.push(template_pred)
          } 
      }
      this.setState({monthacc: monthacc})
    } catch (error) {
      this.setState({
        loading: false,
        error: 'Error occurred while fetching data.',
      });
    }
    this.setState({chartData: data})
  }
  
  get_line_chart(){
    if (this.state.chartData !== "null"){
     return (<TimeSeriesChart chartData={this.state.chartData} bestModel={this.state.metadata['bestModel']} metadata={this.state.metadata}/>)
    }
    else{
        return (<h2>Loading</h2>)
    }
  }

  async handleTrainEditChange(train_data, pred_data, meta_data) {
    // when actual sales data from grid changes then this func is called to update the train data in chart.
    this.setState({train_data: train_data})

    this.update_line_chart(train_data, pred_data, meta_data);
  }
  handlePredEditChange = (train_data, pred_data, meta_data) => {
    // when Sales Forecast data from grid changes then this func is called to update the pred data in chart.
    this.setState({pred_data: pred_data});
    this.update_line_chart(train_data, pred_data, meta_data);
  }

  getBrandOptions(){
    // sets the name of all brand in filter when page is loaded
    let brands = this.props.brands['brands']
    let options = []
    for (let i=0; i<brands.length; i++) {
      let option = { value: brands[i], label: brands[i] }
      options.push(option)
    }
    this.options=options

    const convertedData = {
      brands: this.props.brands['brands'].map((state) => ({ value: state, label: state })),
      subStates: this.props.brands.subStates.map((state) => ({ value: state, label: state })),
      brandVariants: [{ value: "ALL", label: "ALL" }],
      channel: [{ value: "ALL", label: "ALL" }],
      sizes: [{ value: "ALL", label: "ALL" }]
    };
    this.setState({defBrandObj: convertedData})
  
  }

  render() {

    if ((this.props.brands !== "null") && (this.state.train_data !== "null") && (this.state.pred_data !== "null") && (this.state.isLoading) &&  (this.state.defBrandObj !== null) ){ 
      return (
          <div className="container">
            <div style={{ float: 'left', paddingRight: '18px', paddingLeft: '18px', width: '220px', marginLeft: '-45px', paddingTop: '0px'}}>
              <div>
                <Filter 
                  filterObj={this.state.defBrandObj}
                  setFilterData={this.handleFilter}
                  baseApiURL={this.props.baseApiURL}
                />
              </div>
              <div style={{ paddingTop: "35px"}}>
                <Models metadata={this.state.metadata} monthacc={this.state.monthacc}/>
              </div>
            </div>
            <div>
              <div style={{ paddingTop: '0px' }}>
                <Grid train_data={this.state.train_data} 
                  pred_data={this.state.pred_data} 
                  meta_data={this.state.metadata}
                  handleTrainEditChange={this.handleTrainEditChange} 
                  handlePredEditChange={this.handlePredEditChange} 
                  bestModel={this.state.metadata['bestModel']}
                  monthOverlapArr={this.overlapArr}
                  downloadFun = {this.fun}
                  avgSales = {this.state.avgSales}
                />
              </div>
              <br />
              <div style={{ height: '308px', marginLeft: '175px', border: '1px solid #ccc', marginTop: '-10px' }}>
                {this.get_line_chart()}
              </div>
            </div>
          </div>

          )
    }
    else{ // when model is training then the page will show loading buffer
        return (
          <div>
            <h1>Loading...</h1>
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          </div>
        )
    }
    
  }
}

export default Dashboard;