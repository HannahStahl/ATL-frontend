import React, { useState } from 'react';
import { Table, Modal } from 'react-bootstrap';
import EditForm from './EditForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default ({
  columns, rows, setRows, itemType, API, categoryName,
  CustomAddComponent, customEditFunction, customRemoveFunction
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
    if (customEditFunction) await customEditFunction(rowId, body);
    else {
      const result = await API.put("atl-backend", `update/${itemType}/${rowId}`, { body });
      const index = rows.findIndex((rowInList) => rowInList[itemId] === rowId);
      rows[index] = result;
      setRows([...rows]);
    }
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

  const joinValues = (obj, keys) => keys.map((key) => obj[key]).join(' ');

  const getValueFromJoiningTable = (key, obj, row) => {
    const { joiningTable, joiningTableKey, joiningTableFieldNames } = obj;
    const value = joiningTable.find((item) => item[joiningTableKey] === row[key]);
    return value ? joinValues(value, joiningTableFieldNames) : '';
  };

  const joinChildren = (obj, row) => {
    let value = '';
    let joiner = row.childrenJoiner ? row.childrenJoiner : ' ';
    row.children.forEach((child) => {
      const childValue = child.joiningTable
        ? getValueFromJoiningTable(child.key, child, obj)
        : obj[child.key];
      if (value.length > 0 && childValue.length > 0) value += joiner;
      value += childValue;
    });
    return value;
  };

  const getFormFields = () => {
    const fields = {};
    Object.keys(columns).forEach((key) => {
      const column = columns[key];
      if (!column.readOnly) {
        if (column.children) {
          column.children.forEach((child) => {
            if (!child.readOnly) fields[child.key] = child;
          });
        } else fields[key] = column;
      }
    });
    return fields;
  };

  return (
    <React.Fragment>
      <style>
        {`
          th {
            background-color: #e7e7e7;
          }
          th,td {
            white-space: nowrap;
          }
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
              {Object.keys(columns).filter((key) => !columns[key].hideFromTable).map((key) => <th key={key}>{columns[key].label}</th>)}
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
                {Object.keys(columns).filter((key) => !columns[key].hideFromTable).map((key) => (
                  <td key={key}>
                    {columns[key].children ? (
                      joinChildren(row, columns[key])
                    ) : (
                      columns[key].joiningTable ? getValueFromJoiningTable(key, columns[key], row) : row[key]
                    )}
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
                  <td
                    colSpan={Object.keys(columns).filter((key) => !columns[key].hideFromTable).length + 1}
                    onClick={() => setAddingRow(true)}
                  >
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
            fields={getFormFields()}
            original={rowSelectedForEdit}
            save={editRow}
            isLoading={isLoading}
          />
        </Modal.Body>
      </Modal>
      <Modal show={addingRow} onHide={() => setAddingRow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{`Add New ${capitalizedItemType}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditForm
            fields={getFormFields()}
            save={addRow}
            isLoading={isLoading}
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
