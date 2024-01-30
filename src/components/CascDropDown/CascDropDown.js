import React, { useState, useEffect } from "react";
import Select from "react-select";
// import data from './cascData.json';

function CascDropDwon(props) {
  const [variant, setVariant] = useState({ value: "ALL", label: "ALL" });
  const [substate, setSubstate] = useState({ value: "ALL", label: "ALL" });
  const [channel, setChannel] = useState({ value: "ALL", label: "ALL" });
  const [size, setSize] = useState({ value: "ALL", label: "ALL" });

  const defState = props.defBrnadObjList[0]['state'];

  const defVariant = props.defBrnadObjList[0]['brandVariant'];

  const defChannel = props.defBrnadObjList[0]['channel'];

  const defSize = props.defBrnadObjList[0]['size'];


  const handleStateChange = (obj) => {
    setSubstate(obj);
    if (obj.value === "ALL") {
      props.filterFunction(props.brandObj ? props.brandObj["brand"] : props.opt[0].value);
    } else {
      props.filterFunction(props.brandObj ? props.brandObj["brand"] + "~" + obj.value : props.opt[0].value + "~" + obj.value);
    }
    setVariant({ value: "ALL", label: "ALL" });
    setChannel({ value: "ALL", label: "ALL" });
  };

  const handleBrandVariantChange = (obj) => {
    setVariant(obj);
    if (obj.value === "ALL") {
      const brand = props.brandObj ? props.brandObj["brand"] : props.opt[0].value;
      const substateValue = substate ? substate.value : "";
      props.filterFunction(brand + "~" + substateValue);
    } else {
      const brand = props.brandObj ? props.brandObj["brand"] : props.opt[0].value;
      const substateValue = substate ? substate.value : "";
      props.filterFunction(brand + "~" + substateValue + "~" + obj.value);
    }
    setChannel({ value: "ALL", label: "ALL" });
  };

  const handleChannelChange = (obj) => {
    setChannel(obj);
    const brand = props.brandObj ? props.brandObj["brand"] : props.opt[0].value;
    const substateValue = substate ? substate.value : "";
    const variantValue = variant ? variant.value : "";
    if (obj.value === "ALL") {
      props.filterFunction(brand + "~" + substateValue + "~" + variantValue);
    } else {
      const filterVar = brand + "~" + substateValue + "~" + variantValue + "~" + obj.value;
      props.filterFunction(filterVar);
    }
  };

  const handleSizeChange = (obj) => {
    setChannel(obj);
    const brand = props.brandObj ? props.brandObj["brand"] : props.opt[0].value;
    const substateValue = substate ? substate.value : "";
    const variantValue = variant ? variant.value : "";
    const channelValue = channel ? channel.value : "";

    if (obj.value === "ALL") {
      props.filterFunction(brand + "~" + substateValue + "~" + variantValue + "~" + channelValue);
    } else {
      const filterVar = brand + "~" + substateValue + "~" + variantValue + "~" + channelValue + obj.value;
      props.filterFunction(filterVar);
    }
  };

  useEffect(() => {
    setVariant({ value: "ALL", label: "ALL" });
    setSubstate({ value: "ALL", label: "ALL" });
    setChannel({ value: "ALL", label: "ALL" });
    setSize({ value: "ALL", label: "ALL" });
  }, [props.brandObj]);

  if (props.opt[0] !== undefined) {
    return (
      <div>
        <div>
          <b>Brand</b>
          <Select
            options={props.opt}
            onChange={props.function}
            defaultValue={props.opt[0]}
            placeholder="--All--"
            value={props.val}
            getOptionLabel={x => x.label}
            getOptionValue={x => x.value}
        />
          <br />
          <b>Sub State</b>
          <Select
            placeholder="--All--"
            value={substate}
            options={props.brandObj !== undefined ? props.brandObj["state"] : defState}
            onChange={handleStateChange}
            getOptionLabel={(x) => x.label}
            getOptionValue={(x) => x.value}
          />
          <br />
          <b>Brand Variant</b>
          <Select
            placeholder="--All--"
            options={
              props.brandObj !== undefined
                ? substate && substate.value === "ALL"
                  ? []
                  : props.brandObj.brandVariant
                : substate && substate.value === "ALL"
                ? []
                : defVariant
            }
            value={variant}
            onChange={handleBrandVariantChange}
            getOptionLabel={(x) => x.label}
            getOptionValue={(x) => x.value}
          />
          <br />
          <b>Channel</b>
          <Select
            placeholder="--All--"
            value={channel}
            options={
              props.brandObj !== undefined
                ? variant && variant.value === "ALL"
                  ? []
                  : props.brandObj.channel
                : variant && variant.value === "ALL"
                ? []
                : defChannel
            }
            onChange={handleChannelChange}
            getOptionLabel={(x) => x.label}
            getOptionValue={(x) => x.value}
          />
          <br />
          <b>Size</b>
          <Select
            placeholder="--All--"
            value={size}
            options={
              props.brandObj !== undefined
                ? channel && channel.value === "ALL"
                  ? []
                  : props.brandObj.channel
                : channel && channel.value === "ALL"
                ? []
                : defSize
            }
            onChange={handleChannelChange}
            getOptionLabel={(x) => x.label}
            getOptionValue={(x) => x.value}
          />
        </div>
      </div>
    );
  } else {
    return <h1>Loading....</h1>;
  }
}

export default CascDropDwon;
