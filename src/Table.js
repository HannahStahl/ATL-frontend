import React, { useState } from 'react';
import { Table, Modal } from 'react-bootstrap';
import EditForm from './EditForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default ({
  columns, rows, filterRows, getRows, setRows, itemType, displayType, API, categoryName, customSelect,
  CustomAddComponent, CustomEditComponent, customAddFunction, customEditFunction, customRemoveFunction,
  validate, createDisabled, removeDisabled, primaryKey, getInactiveRows
}) => {
  const [sortKey, setSortKey] = useState(undefined);
  const [sortDirection, setSortDirection] = useState(undefined);
  const [rowSelectedForEdit, setRowSelectedForEdit] = useState(undefined);
  const [rowSelectedForRemoval, setRowSelectedForRemoval] = useState(undefined);
  const [addingRow, setAddingRow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemId = primaryKey || `${itemType}Id`;

  const addRow = async (event, body) => {
    event.preventDefault();
    if (validate && !validate(body)) return;
    setIsLoading(true);
    if (customAddFunction) await customAddFunction(body);
    else {
      await API.post("atl-backend", `create/${itemType}`, { body });
      const newRows = await getRows();
      setRows([...newRows]);
    }
    setIsLoading(false);
    setAddingRow(false);
  };

  const editRow = async (event, body) => {
    event.preventDefault();
    if (validate && !validate(body)) return;
    setIsLoading(true);
    const rowId = body[itemId];
    if (customEditFunction) await customEditFunction(rowId, body);
    else {
      const result = await API.put("atl-backend", `update/${itemType}/${rowId}`, { body });
      const newRows = await getRows(result);
      setRows([...newRows]);
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
      const newRows = await getRows();
      setRows([...newRows]);
    }
    setIsLoading(false);
    setRowSelectedForRemoval(undefined);
  };

  const displayItemType = displayType || itemType;
  const capitalizedItemType = displayItemType.replace(/(^|\s|-)(\S)/g, (_, p1, p2) => `${p1}${p2.toUpperCase()}`);

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

  const getValue = (row, key) => {
    return columns[key].children ? joinChildren(row, columns[key]) : (
      columns[key].joiningTable ? getValueFromJoiningTable(key, columns[key], row) : row[key]
    );
  };

  let rowsToDisplay = filterRows ? filterRows(rows) : rows;
  if (sortKey && sortDirection) {
    rowsToDisplay.sort((row1, row2) => {
      const getAscendingReturnValue = () => {
        if (!row1[sortKey]) return -1;
        if (!row2[sortKey]) return 1;
        const value1 = getValue(row1, sortKey);
        const value2 = getValue(row2, sortKey);
        return columns[sortKey].sortFunction(value1, value2);
      }
      return getAscendingReturnValue() * (sortDirection === 'ASC' ? 1 : -1);
    });
  }

  const EditComponent = CustomEditComponent || EditForm;

  return (
    <>
      <div className="table-container">
        <Table bordered hover className={setRows || customSelect ? 'interactive-table' : undefined}>
          <thead>
            <tr>
              {setRows && !removeDisabled && <th />}
              {Object.keys(columns).filter((key) => !columns[key].hideFromTable).map((key) => (
                <th key={key}>
                  <div className="table-header-cell">
                    {columns[key].label}
                    {columns[key].sortFunction
                      ? (
                        <div className="sort-icons">
                          <i
                            className="fas fa-caret-up fa-lg"
                            onClick={() => {
                              setSortKey(key);
                              setSortDirection('ASC');
                            }}
                          />
                          <i
                            className="fas fa-caret-down fa-lg"
                            onClick={() => {
                              setSortKey(key);
                              setSortDirection('DESC');
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )
                    }
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {setRows && !createDisabled && (
                CustomAddComponent ? <CustomAddComponent /> : (
                  <td
                    colSpan={Object.keys(columns).filter((key) => !columns[key].hideFromTable).length + (removeDisabled ? 0 : 1)}
                    onClick={() => setAddingRow(true)}
                  >
                    {`+ Add new ${displayItemType}`}
                  </td>
                )
              )}
            </tr>
            {rowsToDisplay.map((row) => (
              <tr
                key={row[itemId]}
                onClick={!row.readOnly && (setRows || customSelect) ? (e) => {
                  if (!e.target.className.includes("fas") && !e.target.href) {
                    customSelect ? customSelect(row) : setRowSelectedForEdit(row);
                  }
                } : undefined}
                className={row.readOnly ? "disabled" : undefined}
              >
                {setRows && !removeDisabled && (
                  <td className="remove-row">
                    {!row.readOnly && (
                      <i className="fas fa-times-circle" onClick={() => setRowSelectedForRemoval(row)} />
                    )}
                  </td>
                )}
                {Object.keys(columns).filter((key) => !columns[key].hideFromTable).map((key) => {
                  const value = getValue(row, key);
                  return <td key={key}>{columns[key].render ? columns[key].render(value, row) : value}</td>;
                })}
              </tr>
            ))}
            {getInactiveRows && getInactiveRows(rows).map((row) => (
              <tr
                key={row[itemId]}
                onClick={!row.readOnly && (setRows || customSelect) ? (e) => {
                  if (!e.target.className.includes("fas") && !e.target.href) {
                    customSelect ? customSelect(row) : setRowSelectedForEdit(row);
                  }
                } : undefined}
                className={`inactive-row${row.readOnly ? " disabled" : ""}`}
              >
                {setRows && !removeDisabled && (
                  <td className="remove-row">
                    {!row.readOnly && (
                      <i className="fas fa-times-circle" onClick={() => setRowSelectedForRemoval(row)} />
                    )}
                  </td>
                )}
                {Object.keys(columns).filter((key) => !columns[key].hideFromTable).map((key) => {
                  const value = columns[key].children ? joinChildren(row, columns[key]) : (
                    columns[key].joiningTable ? getValueFromJoiningTable(key, columns[key], row) : row[key]
                  );
                  return <td key={key}>{columns[key].render ? columns[key].render(value, row) : value}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal
        className={CustomEditComponent ? "full-width-modal" : ""}
        show={rowSelectedForEdit !== undefined}
        onHide={() => setRowSelectedForEdit(undefined)}
      >
        <Modal.Header closeButton>
          <h2>{`Edit ${capitalizedItemType} Details`}</h2>
        </Modal.Header>
        <Modal.Body>
          <EditComponent
            fields={getFormFields()}
            original={rowSelectedForEdit}
            save={editRow}
            isLoading={isLoading}
          />
        </Modal.Body>
      </Modal>
      <Modal show={addingRow} onHide={() => setAddingRow(false)}>
        <Modal.Header closeButton>
          <h2>{`Add New ${capitalizedItemType}`}</h2>
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
        itemType={displayItemType}
        capitalizedItemType={capitalizedItemType}
        categoryName={categoryName}
      />
    </>
  );
};
