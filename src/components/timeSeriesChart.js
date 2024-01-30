import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import moment from 'moment';

const numberParser = (params) => {
  const value = params.newValue;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return parseFloat(value);
};

const chartTooltipRenderer = ({ xValue, yValue }) => {
  const date = xValue instanceof Date ? xValue : new Date(xValue);
  const formattedDate = moment(date).format('DD MMM YYYY');
  return {
    content: `${formattedDate}: ${yValue}`,
  };
};

function TimeSeriesChart(props) {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState(props.chartData);
  const [keys, setKeys] = useState(['VolumeNineLitre', props.bestModel, 'actual']);

  const columnDefs = useMemo(() => [
    {
      field: 'MonthEndDate',
      chartDataType: 'category',
      pinned: true,
      // valueFormatter: (params) => (params.value).toISOString().substring(0, 10),
    },
    ...keys.map(key => ({
      field: key,
      chartDataType: 'series',
      valueParser: numberParser,
    })),
  ], [keys]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    // editable: true,
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const chartThemes = useMemo(() => ['ag-pastel', 'ag-vivid'], []);
  const popupParent = useMemo(() => document.body, []);
  const chartThemeOverrides = useMemo(() => ({
    common: {
      padding: {
        top: 45,
      },
      legend: {
        position: 'bottom',
      },
      axes: {
        number: {
          title: {
            enabled: true,
          },
        },
      },
    },
    column: {
      series: {
        strokeWidth: 2,
        fillOpacity: 0.8,
        tooltip: {
          renderer: chartTooltipRenderer,
        },
      },
    },
    line: {
      series: {
        strokeWidth: 5,
        strokeOpacity: 0.8,
        tooltip: {
          renderer: chartTooltipRenderer,
        },
      },
    },
  }), []);

  const onFirstDataRendered = useCallback(() => {
    const chartDiv = document.querySelector('#myChart');

    while (chartDiv.firstChild) {
      chartDiv.removeChild(chartDiv.firstChild);
    }

    const createRangeChartParams = {
      chartType: 'customCombo',
      cellRange: {
        columns: ['MonthEndDate', 'VolumeNineLitre', props.bestModel, 'actual'],
      },
      seriesChartTypes: keys.map(key => ({
        colId: key,
        chartType: 'line',
        secondaryAxis: false,
      })),
      aggFunc: 'sum',
      navigator: {
        enabled: true,
      },
      suppressChartRanges: true,
      chartContainer: chartDiv,
    };

    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.createRangeChart(createRangeChartParams);
    }
  }, [keys, props.bestModel]);

  useEffect(() => {
    setRowData(props.chartData);
  }, [props.chartData]);

  useEffect(() => {
    // Update keys when props.bestModel or models in metadata change
    const newKeys = ['VolumeNineLitre', props.bestModel, 'actual'];
    for (let i = 0; i < props.metadata['models'].length; i++) {
      if (props.metadata['models'][i]['model'] === props.bestModel) {
        continue;
      }
      newKeys.push(props.metadata['models'][i]['model']);
    }
    setKeys(newKeys);
  }, [props.bestModel, props.metadata]);

  useEffect(() => {
    onFirstDataRendered();
  }, [onFirstDataRendered]);

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div style={gridStyle} className="ag-theme-alpine">
          <div style={{ height: "90%", display: 'none' }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              enableRangeSelection={true}
              chartThemes={chartThemes}
              enableCharts={true}
              popupParent={popupParent}
              chartThemeOverrides={chartThemeOverrides}
              onFirstDataRendered={onFirstDataRendered}
            ></AgGridReact>
          </div>
        </div>
        <div id="myChart" className="ag-theme-alpine"></div>
      </div>
    </div>
  );
}

export default TimeSeriesChart;
