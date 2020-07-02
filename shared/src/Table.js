import React, { useState } from 'react';
import { Table, Modal } from 'react-bootstrap';
import EditForm from './EditForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default ({
  columns, rows, setRows, itemType, joiningTables, API,
  categoryName, CustomAddComponent, customRemoveFunction
}) => {
  const [rowSelectedForEdit, setRowSelectedForEdit] = useState(undefined);
  const [rowSelectedForRemoval, setRowSelectedForRemoval] = useState(undefined);
  const [addingRow, setAddingRow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemId = `${itemType}Id`;

  const addRow = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.post("atl-backend", `create/${itemType}`, { body });
    rows.push(result);
    setRows([...rows]);
    setIsLoading(false);
    setAddingRow(false);
  };

  const editRow = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    const rowId = body[itemId];
    const result = await API.put("atl-backend", `update/${itemType}/${rowId}`, { body });
    const index = rows.findIndex((rowInList) => rowInList[itemId] === rowId);
    rows[index] = result;
    setRows([...rows]);
    setIsLoading(false);
    setRowSelectedForEdit(undefined);
  };

  const removeRow = async () => {
    setIsLoading(true);
    const rowId = rowSelectedForRemoval[itemId];
    if (customRemoveFunction) await customRemoveFunction(rowId);
    else {
      await API.del("atl-backend", `delete/${itemType}/${rowId}`);
      const index = rows.findIndex((rowInList) => rowInList[itemId] === rowId);
      rows.splice(index, 1);
      setRows([...rows]);
    }
    setIsLoading(false);
    setRowSelectedForRemoval(undefined);
  };

  const capitalizedItemType = itemType.charAt(0).toUpperCase() + itemType.slice(1);

  const getValueFromJoiningTable = (key, row) => {
    const { joiningTable, joiningTableKey, joiningTableFieldNames } = columns[key];
    const value = joiningTables[joiningTable].find((item) => item[joiningTableKey] === row[key]);
    return value ? joiningTableFieldNames.map((key) => value[key]).join(' ') : '';
  };

  return (
    <React.Fragment>
      <style>
        {`
          .table-container {
            overflow-x: scroll;
          }
          .remove-row {
            width: 30px;
          }
          @media all and (hover: hover) {
            .interactive-table td:hover {
              cursor: pointer;
            }
          }
        `}
      </style>
      <div className="table-container">
        <Table bordered hover className={setRows ? 'interactive-table' : undefined}>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => <th key={key}>{columns[key].label}</th>)}
              {setRows && <th />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row[itemId]}
                onClick={setRows ? (e) => {
                  if (!e.target.className.includes("fas")) setRowSelectedForEdit(row);
                } : undefined}
              >
                {Object.keys(columns).map((key) => (
                  <td key={key}>
                    {columns[key].joiningTable ? getValueFromJoiningTable(key, row) : row[key]}
                  </td>
                ))}
                {setRows && (
                  <td className="remove-row">
                    <i className="fas fa-times-circle" onClick={() => setRowSelectedForRemoval(row)} />
                  </td>
                )}
              </tr>
            ))}
            <tr>
              {setRows && (
                CustomAddComponent ? <CustomAddComponent /> : (
                  <td colSpan={Object.keys(columns).length + 1} onClick={() => setAddingRow(true)}>
                    {`+ Add new ${itemType}`}
                  </td>
                )
              )}
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={rowSelectedForEdit !== undefined} onHide={() => setRowSelectedForEdit(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>{`Edit ${capitalizedItemType} Details`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditForm
            fields={columns}
            original={rowSelectedForEdit}
            save={editRow}
            isLoading={isLoading}
            joiningTables={joiningTables}
          />
        </Modal.Body>
      </Modal>
      <Modal show={addingRow} onHide={() => setAddingRow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{`Add New ${capitalizedItemType}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditForm
            fields={columns}
            save={addRow}
            isLoading={isLoading}
            joiningTables={joiningTables}
          />
        </Modal.Body>
      </Modal>
      <DeleteConfirmationModal
        rowSelectedForRemoval={rowSelectedForRemoval}
        setRowSelectedForRemoval={setRowSelectedForRemoval}
        removeRow={removeRow}
        isLoading={isLoading}
        itemType={itemType}
        capitalizedItemType={capitalizedItemType}
        categoryName={categoryName}
      />
    </React.Fragment>
  );
};
