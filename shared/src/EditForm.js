import React, { useState, useEffect } from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import LoaderButton from "./LoaderButton";

export default ({ fields, original, save, isLoading, joiningTables }) => {
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

  return (
    <form onSubmit={(e) => save(e, updated)}>
      {Object.keys(fields).map((key) => (
        <FormGroup key={key} controlId={key}>
          <ControlLabel>{fields[key].label}</ControlLabel>
          {["text", "number", "email"].includes(fields[key].type) && (
            <FormControl
              value={updated[key] || ''}
              type={fields[key].type}
              onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
            />
          )}
          {fields[key].type === "textarea" && (
            <FormControl
              value={updated[key] || ''}
              componentClass="textarea"
              rows="3"
              onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
            />
          )}
          {fields[key].type === "dropdown" && (
            <FormControl
              value={updated[key] || ''}
              componentClass="select"
              onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
            >
              <option value="" />
              {joiningTables[fields[key].joiningTable].map((item) => {
                const { joiningTableKey, joiningTableFieldNames } = fields[key];
                return (
                  <option key={item[joiningTableKey]} value={item[joiningTableKey]}>
                    {joiningTableFieldNames.map((fieldName) => item[fieldName]).join(' ')}
                  </option>
                );
              })}
            </FormControl>
          )}
        </FormGroup>
      ))}
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        bsStyle="primary"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Save
      </LoaderButton>
    </form>
  );
};
