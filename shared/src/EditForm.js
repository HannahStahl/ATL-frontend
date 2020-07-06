import React, { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";
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
    <React.Fragment>
      <style>
        {`
          .form-table {
            width: 100%;
          }
          .form-table td {
            padding-bottom: 10px;
          }
          .form-label {
            text-align: right;
            white-space: nowrap;
            padding-right: 10px;
            font-weight: bold;
          }
          .form-field {
            width: 100%;
          }
        `}
      </style>
      <form onSubmit={(e) => save(e, updated)}>
        <table className='form-table'>
          <tbody>
            {Object.keys(fields).map((key) => {
              const {
                label, type, joiningTable, joiningTableFilter, joiningTableKey, joiningTableFieldNames
              } = fields[key];
              return (
                <tr key={key}>
                  <td className='form-label'>{label || ''}</td>
                  <td className='form-field'>
                    {["text", "number", "email"].includes(type) && (
                      <FormControl
                        value={updated[key] || ''}
                        type={type}
                        onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
                      />
                    )}
                    {type === "textarea" && (
                      <FormControl
                        value={updated[key] || ''}
                        componentClass="textarea"
                        rows="3"
                        onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
                      />
                    )}
                    {type === "dropdown" && (
                      <FormControl
                        value={updated[key] || ''}
                        componentClass="select"
                        onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
                      >
                        <option value="" />
                        {(joiningTableFilter
                            ? joiningTable.filter((row) => (
                              updated[joiningTableFilter.key] && row[joiningTableFilter.joiningTableKey] === updated[joiningTableFilter.key]
                            )) : joiningTable
                          ).map((item) => {
                            return (
                              <option key={item[joiningTableKey]} value={item[joiningTableKey]}>
                                {joiningTableFieldNames.map((fieldName) => item[fieldName]).join(' ')}
                              </option>
                            );
                          })
                        }
                      </FormControl>
                    )}
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
          Save
        </LoaderButton>
      </form>
    </React.Fragment>
  );
};
