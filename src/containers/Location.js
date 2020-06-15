import React, { useState } from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default ({ originalLocation, saveLocation, isLoading }) => {
  const [location, setLocation] = useState(originalLocation || {});

  const validateForm = () => location.locationName?.length > 0;

  return (
    <form onSubmit={(e) => saveLocation(e, location)}>
      <FormGroup controlId="locationName">
        <ControlLabel>Name</ControlLabel>
        <FormControl
          value={location.locationName || ''}
          type="text"
          onChange={e => setLocation({ ...location, locationName: e.target.value })}
        />
      </FormGroup>
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
