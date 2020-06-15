import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader, Table, Modal } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import "./Divisions.css";
import Division from "./Division";

// TODO move this component to admin frontend
export default function Roster() {
  const { divisions, setDivisions } = useAppContext();
  const [divisionSelected, setDivisionSelected] = useState(undefined);
  const [newDivisionSelected, setNewDivisionSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = {
    divisionNumber: "Division Number",
    // TODO add other fields
  };

  const editDivision = async (event, updatedDivision) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.put("atl-backend", `update/division/${updatedDivision.divisionId}`, { body: updatedDivision });
    const index = divisions.findIndex((divisionInList) => divisionInList.divisionId === updatedDivision.divisionId);
    divisions[index] = result;
    setDivisions([...divisions]);
    setIsLoading(false);
    setDivisionSelected(undefined);
  };

  const addDivision = async (event, newDivision) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.post("atl-backend", "create/division", { body: newDivision });
    divisions.push(result);
    setDivisions([...divisions]);
    setIsLoading(false);
    setNewDivisionSelected(false);
  };

  return (
    <div>
      <PageHeader>Divisions</PageHeader>
      <div className="Divisions">
        <Table bordered hover>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => <th key={key}>{columns[key]}</th>)}
            </tr>
          </thead>
          <tbody>
            {divisions.map((division) => (
              <tr key={division.divisionId} onClick={() => setDivisionSelected(division)}>
                {Object.keys(columns).map((key) => <td key={key}>{division[key]}</td>)}
              </tr>
            ))}
            <tr>
              <td colSpan={Object.keys(columns).length}>
                <p onClick={() => setNewDivisionSelected(true)}>+ Add new division</p>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={divisionSelected !== undefined} onHide={() => setDivisionSelected(undefined)}>
        <Modal.Header closeButton><Modal.Title>Edit Division Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <Division originalDivision={divisionSelected} saveDivision={editDivision} isLoading={isLoading} />
        </Modal.Body>
      </Modal>
      <Modal show={newDivisionSelected} onHide={() => setNewDivisionSelected(false)}>
        <Modal.Header closeButton><Modal.Title>Add New Division</Modal.Title></Modal.Header>
        <Modal.Body><Division saveDivision={addDivision} isLoading={isLoading} /></Modal.Body>
      </Modal>
    </div>
  );
}
