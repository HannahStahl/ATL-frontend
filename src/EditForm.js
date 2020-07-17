import React, { useState, useEffect } from "react";
import {
  FormControl, Checkbox, FormGroup, ControlLabel, HelpBlock
} from "react-bootstrap";
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

  const renderValue = (key) => {
    const {
      type, joiningTable, joiningTableFilter, joiningTableKey,
      joiningTableFieldNames, options, placeholder, helpText
    } = fields[key];
    return (
      <>
        {helpText && <HelpBlock className="helper-text">{helpText}</HelpBlock>}
        {["text", "number", "email", "date"].includes(type) && (
          <FormControl
            value={updated[key] || ''}
            type={type}
            onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
            placeholder={placeholder}
          />
        )}
        {type === "checkbox" && (
          <Checkbox
            checked={updated[key] || false}
            onChange={e => setUpdated({ ...updated, [key]: e.target.checked })}
          />
        )}
        {type === "textarea" && (
          <FormControl
            value={updated[key] || ''}
            componentClass="textarea"
            rows="3"
            onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
            placeholder={placeholder}
          />
        )}
        {type === "dropdown" && (
          <FormControl
            value={updated[key] || ''}
            componentClass="select"
            onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
          >
            <option value="" />
            {options ? options.map((option) => (
              <option key={option.value} value={option.value}>{option.name}</option>
            )) : (
              joiningTableFilter
                ? joiningTable.filter((row) => (
                  updated[joiningTableFilter.key] && row[joiningTableFilter.joiningTableKey] === updated[joiningTableFilter.key]
                )) : joiningTable
              ).map((item) => {
                return (
                  <option key={item[joiningTableKey]} value={item[joiningTableKey]}>
                    {joiningTableFieldNames.map((fieldName) => item[fieldName]).join(' ')}
                  </option>
                );
              }
            )}
          </FormControl>
        )}
      </>
    );
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
              <FormGroup>
                {label && <ControlLabel>{label}</ControlLabel>}
                {renderValue(key)}
              </FormGroup>
            );
          })}
        </>
      ) : (
        <table className='form-table'>
          <tbody>
            {Object.keys(fields).filter(isEditable).map((key) => {
              const { label } = fields[key];
              return (
                <tr key={key}>
                  <td className='form-label'>{label || ''}</td>
                  <td className='form-field'>{renderValue(key)}</td>
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