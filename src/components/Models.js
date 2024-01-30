///api/mlops/train/?brand=Baileys Original
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';

class Models extends Component {

  constructor(props) {
    super(props);
    this.state ={
      currentTab : "forecast"
    }
  }

  handleOptionChange = (event) => {
    this.props.onChange(event)
  }

  handleTabChange = (event) => {
    this.setState({
      currentTab: event.toString()
    })
  }

  get_tab_data(){
    if (this.state.currentTab === "models"){
      const modelRows = this.props.metadata['models'].map((item, index) => (
        <tr key={index}>
          <td style={{ fontSize: 12, paddingLeft: "10px", paddingTop: "10px", fontWeight: "bold" }}>
            {item.model.substring(0, 20)}
          </td>
          <td style={{ fontSize: 12, paddingLeft: "10px", paddingTop: "10px" }}>
            {Math.abs((1 - parseFloat(item.smape))*100) > 100 ? '' : Math.abs((1 - parseFloat(item.smape))*100).toFixed(2) + '%'}
          </td>
        </tr>
      ));
      return (
        <Table striped="columns" style={{ fontSize: 9, padding: "10px" }}>
        <tbody style={{ padding: "10px" }}>
          <tr>
            <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px", fontWeight: "bold"}}>Models (Rank Wise)</td>
            <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px", fontWeight: "bold"}}>Accuracy</td>
          </tr>
          {modelRows}
        </tbody>
      </Table>
      )
    }
    else{
      return this.get_forecast_data()
    }
  }

  get_forecast_data(){
    return (
      <Table striped="columns" style={{fontSize: 12, padding: "10px"}}>
        <tbody style={{padding: "10px"}}>
        <tr>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px", fontWeight: "bold"}}>Last 3M Accuracy</td>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px"}}>{(100 - (this.props.monthacc.slice(-3).reduce((sum, num) => sum + num, 0) / 3)).toFixed(2)}%</td>
        </tr>
        {/* <tr>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px", fontWeight: "bold"}}>Last 6 months Acurracy</td>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px"}}>87%</td>
        </tr> */}
        <tr>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px", fontWeight: "bold"}}>Model Accuracy</td>
          {/* <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px"}}>N/A</td> */}
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px"}}>{Math.abs(((parseFloat(this.props.metadata['smape'])))*100).toFixed(2) > 100 ? '' : Math.abs(((parseFloat(this.props.metadata['mape'])))*100).toFixed(2) + '%'}</td>
        </tr>
        <tr>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px", fontWeight: "bold"}}>Model</td>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px"}}>{this.props.metadata['bestModel']}</td>
        </tr>
        {/* <tr>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px", fontWeight: "bold"}}>Last Trained</td>
          <td style={{fontSize: 12, paddingLeft: "10px", paddingTop: "10px"}}>2023-03-01</td>
        </tr> */}
        </tbody>
      </Table>
      
    )
  }

  get_models_radio(){
    return (
      <Form value="Arima">
          <div key="inline-radio" className="mb-3" style={{padding: "20px"}}>
            <Form.Check
              disabled
              label="AutoARIMA"
              name="modelsList"
              type="checkbox"
              id="AutoARIMA"
              value="AutoARIMA"
              defaultChecked={this.props.defaultChecked === "AutoARIMA"}
              // onChange={this.handleOptionChange}
            />
            <Form.Check
              label="Prophet"
              name="modelsList"
              type="checkbox"
              id="Prophet"
              value="Prophet"
              defaultChecked={this.props.defaultChecked === "Prophet"}
              // onChange={this.handleOptionChange}
            />
            <Form.Check
              label="ETS"
              name="modelsList"
              type="checkbox"
              id="ETS"
              value="ETS"
              defaultChecked={this.props.defaultChecked === "ETS"}
              // onChange={this.handleOptionChange}
            />
          </div>
      </Form>
    )
  }

  render() {
    const tabData = this.get_tab_data();
    const containerStyle = {
      borderRight: 'solid 0.5px',
      borderLeft: 'solid 0.5px',
      borderBottom: 'solid 0.5px',
      height: "308px",
      borderColor: '#e9ecef #e9ecef #dee2e6',
      width: 'fit-content', // Adjust the width of the container
      minWidth: '200px', // Set a minimum width to ensure it doesn't collapse completely,
      overflow: "scroll"
    };
  
    return (
      <>
        <div style={containerStyle}>
          <Nav variant="tabs" size='sm' defaultActiveKey="#" onSelect={this.handleTabChange}>
            <Nav.Item>
              <Nav.Link style={{ color: 'black', fontSize: 12, paddingLeft: "5px" }} href="#">Forecast</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link style={{ color: 'black', fontSize: 12 }} eventKey="models">Models</Nav.Link>
            </Nav.Item>
          </Nav>
          {tabData}
        </div>
      </>
    )
  }
  
}

export default Models;