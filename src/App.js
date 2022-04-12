import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import {useState, useEffect} from "react"

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const App = () => {

  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [newColName, setNewColName] = useState(null)

  const handleGridReady = params => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)
    params.columnApi.autoSizeAllColumns()
  }
  const [rowData, setRowData] = useState([
    
  ])

  const [colDefs, setColDefs] = useState([
    //{headerName: "", checkboxSelection: true, headerCheckboxSelection: true, pinned: "left"},
    {field: 'measurement', headerName: "Measurement", editable: true, lockPosition: true, resizable: true},
    {field: 'easeTight', headerName: "Ease Tight", editable: true, lockPosition: true, resizable: true},
    {field: 'easeLoose', headerName: "Ease Loose", editable: true, lockPosition: true, resizable: true},
    {field: 'bodyPart', editable: true, lockPosition: true, resizable: true},
    {field: 'xs', editable: true, resizable: true},
    {field: 's', editable: true, resizable: true},
    {field: 'm', editable: true, resizable: true},
    {field: 'l', editable: true, resizable: true}
  ]);


  const addColumn = () => {
    setColDefs(colDefs.concat({headerName: newColName ? newColName : "Unnamed size", editable: true, resizable: true, field: `${Date.now()}`}))
  }

  const addRow = () => {
    gridApi.applyTransaction({ add: [{}]})
  }


  const deleteRow = (e) => {
    gridApi.applyTransaction({ remove: [e.node.data]})
  }

  const reAddRow = (e) => {
    gridApi.applyTransaction( { add: [e.node.data]})
  }


  const showData = () => {
    const columns = columnApi.getAllDisplayedColumns()
    const csv = gridApi.getDataAsCsv({columnKeys: columns.filter(column => column.colId !== "0")})
    console.log(csv)
  }

  const handleNameChange = (e) => {
    setNewColName(e.target.value)
  }

  return (
    <>
      <button onClick={addRow}> Add row</button>
      <button onClick={showData}> Show state </button>
      <input type="text" placeholder='Column name' onChange={handleNameChange} required={true}/>
      <button onClick={addColumn}> Add column </button>
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

