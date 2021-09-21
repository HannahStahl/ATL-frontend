import React from "react";
import { FormControl, Checkbox, HelpBlock } from "react-bootstrap";

const StaticValue = ({ fields, fieldKey, updated }) => {
  const {
    joiningTable, joiningTableKey, joiningTableFieldNames,
  } = fields[fieldKey];
  const item = joiningTable.find((item) => item[joiningTableKey] === updated[fieldKey]);
  return (
    <span>{joiningTableFieldNames.map((fieldName) => item[fieldName]).join(' ')}</span>
  );
};

export default ({ fields, fieldKey, updated, setUpdated }) => {
  if (!fields[fieldKey]) return null;
  const {
    type, joiningTable, joiningTableFilter, joiningTableKey, staticField, disabled,
    joiningTableFieldNames, options, placeholder, helpText, extraNotes, step
  } = fields[fieldKey];
  return (
    <>
      {helpText && <HelpBlock className="helper-text">{helpText}</HelpBlock>}
      {["text", "number", "email", "date"].includes(type) && (
        <FormControl
          value={updated[fieldKey] || ''}
          type={type}
          onChange={e => setUpdated({ ...updated, [fieldKey]: e.target.value })}
          placeholder={placeholder}
          step={step}
        />
      )}
      {type === "checkbox" && (
        <Checkbox
          disabled={disabled && disabled(updated)}
          checked={updated[fieldKey] || false}
          onChange={e => setUpdated({ ...updated, [fieldKey]: e.target.checked })}
        />
      )}
      {type === "textarea" && (
        <FormControl
          value={updated[fieldKey] || ''}
          componentClass="textarea"
          rows="3"
          onChange={e => setUpdated({ ...updated, [fieldKey]: e.target.value })}
          placeholder={placeholder}
        />
      )}
      {type === "dropdown" && (
        staticField ? <StaticValue fields={fields} fieldKey={fieldKey} updated={updated} /> : (
          <FormControl
            value={updated[fieldKey] || ''}
            componentClass="select"
            onChange={e => setUpdated({ ...updated, [fieldKey]: e.target.value })}
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
        )
      )}
      {extraNotes && <HelpBlock className="no-margin-bottom extra-notes">{extraNotes(updated)}</HelpBlock>}
    </>
  );
};
