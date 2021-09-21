import React, { useState, useEffect } from "react";
import { HelpBlock, Table } from "react-bootstrap";
import FormValue from "./FormValue";
import LoaderButton from "./LoaderButton";

export default ({ fields, original, save, isLoading, buttonText, labelsAbove }) => {
  const [updated, setUpdated] = useState(original || {});

  useEffect(() => {
    setUpdated(original || {});
  }, [original]);

  const headerRow = [
    { label: "Line", width: 125 },
    { label: "Home Players", width: 300 },
    { label: "Home Sets Won", width: 125 },
    { label: "Visitor Players", width: 300 },
    { label: "Visitor Sets Won", width: 125 },
    { label: "Score", width: 200 },
  ];

  const rows = [
    {
      label: "Singles 1",
      columns: [
        ["singles1HomePlayerId"],
        ["singles1HomeSetsWon"],
        ["singles1VisitorPlayerId"],
        ["singles1VisitorSetsWon"],
        ["singles1Score"],
      ]
    },
    {
      label: "Singles 2",
      columns: [
        ["singles2HomePlayerId"],
        ["singles2HomeSetsWon"],
        ["singles2VisitorPlayerId"],
        ["singles2VisitorSetsWon"],
        ["singles2Score"],
      ]
    },
    {
      label: "Doubles 1",
      columns: [
        ["doubles1HomePlayer1Id", "doubles1HomePlayer2Id"],
        ["doubles1HomeSetsWon"],
        ["doubles1VisitorPlayer1Id", "doubles1VisitorPlayer2Id"],
        ["doubles1VisitorSetsWon"],
        ["doubles1Score"],
      ]
    },
    {
      label: "Doubles 2",
      columns: [
        ["doubles2HomePlayer1Id", "doubles2HomePlayer2Id"],
        ["doubles2HomeSetsWon"],
        ["doubles2VisitorPlayer1Id", "doubles2VisitorPlayer2Id"],
        ["doubles2VisitorSetsWon"],
        ["doubles2Score"],
      ]
    },
  ];

  const validateForm = () => {
    let valid = true;
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (field.required && (!updated[key] || updated[key].length === 0)) {
        valid = false;
      }
    });
    return valid;
  };

  return (
    <form onSubmit={(e) => save(e, updated)}>
      <HelpBlock>Please enter the scores from the perspective of the winners.</HelpBlock>
      <div className="table-container">
        <Table bordered>
          <thead>
            <tr>{headerRow.map(({ label, width }) => <th key={label} style={{ width }}>{label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(({ label, columns }) => (
              <tr>
                <td className="form-label">{label}</td>
                {columns.map((column) => (
                  <td key={column[0]}>
                    {column.map((key) => (
                      <FormValue key={key} fields={fields} fieldKey={key} updated={updated} setUpdated={setUpdated} />
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <table className="form-table">
        <tbody>  
          {["homeVerified", "visitorVerified"].map((key) => {
            const { label, extraNotes } = fields[key];
            return (
              <tr key={key}>
                <td className={`form-label${extraNotes ? ' top-aligned' : ''}`}>{label || ''}</td>
                <td className={`form-field${extraNotes ? ' extra-notes' : ''}`}>
                  <FormValue fields={fields} fieldKey={key} updated={updated} setUpdated={setUpdated} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        bsStyle="primary"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        {buttonText || "Save"}
      </LoaderButton>
    </form>
  );
};
