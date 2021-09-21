import React, { useState, useEffect } from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";
import FormValue from "./FormValue";
import LoaderButton from "./LoaderButton";

export default ({ fields, original, save, isLoading, buttonText, labelsAbove }) => {
  const [updated, setUpdated] = useState(original || {});

  useEffect(() => {
    setUpdated(original || {});
  }, [original]);

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

  const isEditable = (key) => {
    const field = fields[key];
    if (field.readOnlyConditional) {
      return field.readOnlyConditional(updated);
    }
    return true;
  };

  return (
    <form onSubmit={(e) => save(e, updated)}>
      {labelsAbove ? (
        <>
          {Object.keys(fields).filter(isEditable).map((key) => {
            const { label } = fields[key];
            return (
              <FormGroup key={key}>
                {label && <ControlLabel>{label}</ControlLabel>}
                <FormValue fields={fields} fieldKey={key} updated={updated} setUpdated={setUpdated} />
              </FormGroup>
            );
          })}
        </>
      ) : (
        <table className='form-table'>
          <tbody>
            {Object.keys(fields).filter(isEditable).map((key) => {
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
      )}
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
