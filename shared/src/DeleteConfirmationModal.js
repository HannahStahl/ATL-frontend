import React from "react";
import { Modal } from "react-bootstrap";
import LoaderButton from "./LoaderButton";

export default ({
  rowSelectedForRemoval, setRowSelectedForRemoval, removeRow,
  itemType, capitalizedItemType, categoryName, isLoading
}) => (
  <Modal show={rowSelectedForRemoval !== undefined} onHide={() => setRowSelectedForRemoval(undefined)}>
    <Modal.Header closeButton>
      <h2>{`Remove ${capitalizedItemType}`}</h2>
    </Modal.Header>
    <Modal.Body>
      {rowSelectedForRemoval && (
        <React.Fragment>
          <p>
            {`Are you sure you want to remove this ${itemType}${categoryName ? ` from the ${categoryName}` : ''}?`}
          </p>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            onClick={removeRow}
          >
            Yes, remove
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            onClick={() => setRowSelectedForRemoval(undefined)}
          >
            Cancel
          </LoaderButton>
        </React.Fragment>
      )}
    </Modal.Body>
  </Modal>
);
