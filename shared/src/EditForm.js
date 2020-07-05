import React, { useState, useEffect } from "react";
import { Form, FormGroup, ControlLabel, FormControl, Col } from "react-bootstrap";
import LoaderButton from "./LoaderButton";

export default ({ fields, original, save, isLoading }) => {
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
    <Form horizontal onSubmit={(e) => save(e, updated)}>
      {Object.keys(fields).map((key) => (
        <FormGroup key={key} controlId={key}>
          <Col componentClass={ControlLabel} sm={3}>{fields[key].label || ''}</Col>
          <Col sm={9}>
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
                {fields[key].joiningTable.map((item) => {
                  const { joiningTableKey, joiningTableFieldNames } = fields[key];
                  return (
                    <option key={item[joiningTableKey]} value={item[joiningTableKey]}>
                      {joiningTableFieldNames.map((fieldName) => item[fieldName]).join(' ')}
                    </option>
                  );
                })}
              </FormControl>
            )}
          </Col>
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
    </Form>
  );
};
