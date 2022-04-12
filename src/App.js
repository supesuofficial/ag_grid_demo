import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import {useState, useEffect} from "react"

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const Papa = require("papaparse")


const App = () => {

  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [newColName, setNewColName] = useState(null)

  const handleGridReady = params => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
    params.columnApi.autoSizeAllColumns()
  }
  const [rowData] = useState([
    
  ])

  const [colDefs] = useState([
    //{headerName: "", checkboxSelection: true, headerCheckboxSelection: true, pinned: "left"},
    {field: 'dimension', headerName: "Dimension", editable: true, lockPosition: true, resizable: true},
    {field: 'xs', editable: true, resizable: true},
    {field: 's', editable: true, resizable: true},
    {field: 'm', editable: true, resizable: true},
    {field: 'l', editable: true, resizable: true},
    {field: 'xl', editable: true, resizable: true},
    {field: 'xxl', editable: true, resizable: true},
  ]);


  const addRow = () => {
    gridApi.applyTransaction({ add: [{}]})
  }


  const deleteRow = (e) => {
    gridApi.applyTransaction({ remove: [e.node.data]})
  }

  const reAddRow = (e) => {
    // Check that row doesn't already exist
    if (gridApi.getRowNode(e.node.id) == undefined){
      gridApi.applyTransaction( { add: [e.node.data]})
    }
  }


  const showData = () => {
   let data = []
   gridApi.forEachNode(row => data.push(row.data))

   const parsedData = data.map(row => {
    const {dimension, ...sizes} = row

    let newRow = {}
    newRow.dimension = row.dimension
    newRow.sizes = sizes

    return newRow
   })

   console.log(parsedData)
  }

  const handleImport = (e) => {
    console.log("Imported")

    const csv = e.target.files[0]

    const setGridRows = (results, file) => {
      // results will have error also, can do error handling
      gridApi.setRowData(results.data)
    }

    Papa.parse(csv, 
      {
        complete: setGridRows,
        skipEmptyLines: true,
        header: true,
        transformHeader: (header) => header.toLowerCase()
      }
    )
  }

  const receiveData = () => {
    const data = [{dimension: "test", sizes: {s:25, xxs:10}}]
    const parsedData = data.map(row => {
      let newRow = {...row.sizes}
      newRow.dimension = row.dimension

      return newRow
    })

    console.log(parsedData)
    gridApi.setRowData(parsedData)
  }

  return (
    <>
      <button onClick={addRow}> Add row</button>
      <button onClick={showData}> Show state </button>
      <button onClick={receiveData}> Receive data</button>
      <input type="file" accept=".csv" onChange={handleImport}/>
      <div className="ag-theme-alpine" style={{height: 400, width: 800}}>
        <AgGridReact 
          rowData={rowData}
          columnDefs={colDefs}
          onGridReady={handleGridReady}
          rowDragEntireRow={true}
          onRowDragLeave={deleteRow}
          onRowDragEnd={reAddRow}
        />
      </div>
    </>

  );
}

export default App;

