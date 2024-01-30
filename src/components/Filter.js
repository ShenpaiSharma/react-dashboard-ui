import React, { Component } from 'react';
import Select from "react-select";
import axios from 'axios';


class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: this.props.filterObj['brands'],
            subStates: this.props.filterObj['subStates'],
            channel: this.props.filterObj['channel'],
            variant: this.props.filterObj['brandVariants'],
            size: this.props.filterObj['sizes'],
            selectedBrand: this.props.filterObj['brands'][0],
            selectedSubstate: { value: "ALL", label: "ALL" },
            selectedChannel: { value: "ALL", label: "ALL" },
            selectedVariant: { value: "ALL", label: "ALL" },
            selectedSize: { value: "ALL", label: "ALL" },
            defaultVal: {value: "ALL", label: "ALL"}
        };
        console.log('filter', this.props.filterObj)
    }

    async getSubStates(key) {
        let filter_url = `${this.props.baseApiURL}/filter/?pattern=${key.replaceAll(' ', '%20').replaceAll('&', '%26')}~`;
        let filters = await axios.get(filter_url);
        let subStatesFilter = filters.data.map((state) => ({ value: state, label: state }))
        this.setState({subStates: subStatesFilter})
    }

    async getChannels(key) {
        let filter_url = `${this.props.baseApiURL}/filter/?pattern=${key.replaceAll(' ', '%20').replaceAll('&', '%26')}~`;
        let filters = await axios.get(filter_url);
        let subChannels = filters.data.map((state) => ({ value: state, label: state }))
        console.log('channels', subChannels)
        this.setState({channel: subChannels})
        console.log('channels', this.state.channel)
    }

    async getBrandVariants(key) {
        let filter_url = `${this.props.baseApiURL}/filter/?pattern=${key.replaceAll(' ', '%20').replaceAll('&', '%26')}~`;
        let filters = await axios.get(filter_url);
        let subBrandVariants = filters.data.map((state) => ({ value: state, label: state }))
        this.setState({variant: subBrandVariants})
    }

    async getBrandSizes(key) {
        let filter_url = `${this.props.baseApiURL}/filter/?pattern=${key.replaceAll(' ', '%20').replaceAll('&', '%26')}~`;
        let filters = await axios.get(filter_url);
        let brandSize = filters.data.map((state) => ({ value: state, label: state }))
        this.setState({size: brandSize})
    }

    handleBrandChange = (event) => {
        let selectedBrand = event.value;
        this.setState({ 
            selectedBrand: { value: selectedBrand, label: selectedBrand }, 
            selectedSubstate: { value: "ALL", label: "ALL" },
            selectedChannel: { value: "ALL", label: "ALL" } ,
            selectedVariant: { value: "ALL", label: "ALL" },
            selectedSize: { value: "ALL", label: "ALL" } 
        })
        this.getSubStates(selectedBrand)
        this.props.setFilterData(selectedBrand)
    };

    handleStateChange = (event) => {
        let selectedSubstate = event.value;
        let key = "";
        if (selectedSubstate === "ALL") {
            this.setState({
                selectedSubstate: { value: "ALL", label: "ALL" } ,
                selectedChannel: { value: "ALL", label: "ALL" } ,
                selectedVariant: { value: "ALL", label: "ALL" } ,
                selectedSize: { value: "ALL", label: "ALL" }  
            })
            key = this.state.selectedBrand['value']
        } else {
            this.setState({
                selectedSubstate: { value: selectedSubstate, label: selectedSubstate } ,
                selectedChannel: { value: "ALL", label: "ALL" } ,
                selectedVariant: { value: "ALL", label: "ALL" } ,
                selectedSize: { value: "ALL", label: "ALL" }  
            })
            key = this.state.selectedBrand['value'] + '~' + selectedSubstate;
            this.getChannels(key)
        }  
        this.props.setFilterData(key)
    };

    handleChannelChange = (event) => {
        let selectedChannel = event.value;
        let key = "";
        if (selectedChannel === "ALL") {
            this.setState({
                selectedChannel: { value: "ALL", label: "ALL" } ,
                selectedVariant: { value: "ALL", label: "ALL" } ,
                selectedSize: { value: "ALL", label: "ALL" }  
            })
            key = this.state.selectedBrand['value'] + '~' + this.state.selectedSubstate['value']
        } else {
            this.setState({
                selectedChannel: { value: selectedChannel, label: selectedChannel } ,
                selectedVariant: { value: "ALL", label: "ALL" } ,
                selectedSize: { value: "ALL", label: "ALL" }  
            })
            key = this.state.selectedBrand['value'] + '~' + this.state.selectedSubstate['value'] + '~' + selectedChannel;
            this.getBrandVariants(key)
        }  
        this.props.setFilterData(key)
    };

    handleBrandVariantChange = (event) => {
        let selectedBrandVariant = event.value;
        let key = "";
        if (selectedBrandVariant === "ALL") {
            this.setState({
                selectedVariant: { value: "ALL", label: "ALL" },
                selectedSize: { value: "ALL", label: "ALL" }
            })
            key = this.state.selectedBrand['value'] + '~' + this.state.selectedSubstate['value'] + '~' + this.state.selectedChannel['value']
        } else {
            this.setState({
                selectedVariant: { value: selectedBrandVariant, label: selectedBrandVariant },
                selectedSize: { value: "ALL", label: "ALL" }
            })
            key = this.state.selectedBrand['value'] + '~' + this.state.selectedSubstate['value'] + '~' + this.state.selectedChannel['value'] + '~' + selectedBrandVariant;
            this.getBrandSizes(key)
        }  
        this.props.setFilterData(key)
    };

    handleSizeChange = (event) => {
        let selectedBrandSize = event.value;
        let key = "";
        if (selectedBrandSize === "ALL") {
            this.setState({
                selectedSize: { value: "ALL", label: "ALL" } 
            })
            key = this.state.selectedBrand['value'] + '~' + this.state.selectedSubstate['value'] + '~' + this.state.selectedChannel['value'] + '~' + this.state.selectedVariant['value'];
        } else {
            this.setState({
                selectedSize: { value: selectedBrandSize, label: selectedBrandSize }
            })
            key = this.state.selectedBrand['value'] + '~' + this.state.selectedSubstate['value'] + '~' + this.state.selectedChannel['value'] + '~' + this.state.selectedVariant['value'] + '~' + selectedBrandSize;
        }
        this.props.setFilterData(key)
    };

    render() {
        const isBrandAll = this.state.selectedBrand.value === "ALL";
        const isSubstateAll = this.state.selectedSubstate.value === "ALL";
        const isChannelAll = this.state.selectedChannel.value === "ALL";
        const isVariantAll = this.state.selectedVariant.value === "ALL";
      
        const sortOptions = (options) => {
          return options.sort((a, b) => {
            if (a.value === "ALL") return -1;
            if (b.value === "ALL") return 1;
            return a.label.localeCompare(b.label);
          });
        };
      
        return (
          <div>
            <div>
              <b>Brand</b>
              <Select
                options={sortOptions(this.state.brands)}
                onChange={this.handleBrandChange}
                defaultValue={this.state.brands[0]}
                getOptionLabel={x => x.label}
                getOptionValue={x => x.value}
              />
              <br />
              <b>State</b>
              <Select
                placeholder="--All--"
                value={this.state.selectedSubstate}
                options={isBrandAll ? [] : sortOptions(this.state.subStates)}
                onChange={this.handleStateChange}
                getOptionLabel={x => x.label}
                getOptionValue={x => x.value}
              />
              <br />
              <b>Channel</b>
              <Select
                placeholder="--All--"
                value={this.state.selectedChannel}
                options={isSubstateAll ? [] : sortOptions(this.state.channel)}
                onChange={this.handleChannelChange}
                getOptionLabel={x => x.label}
                getOptionValue={x => x.value}
              />
              <br />
              <b>Brand Variant</b>
              <Select
                placeholder="--All--"
                options={isChannelAll ? [] : sortOptions(this.state.variant)}
                value={this.state.selectedVariant}
                onChange={this.handleBrandVariantChange}
                getOptionLabel={x => x.label}
                getOptionValue={x => x.value}
              />
              <br />
              <b>Size</b>
              <Select
                placeholder="--All--"
                value={this.state.selectedSize}
                options={isVariantAll ? [] : sortOptions(this.state.size)}
                onChange={this.handleSizeChange}
                getOptionLabel={x => x.label}
                getOptionValue={x => x.value}
              />
            </div>
          </div>
        );
      }
}

export default Filter;