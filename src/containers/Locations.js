import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader, Table, Modal } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import "./Locations.css";
import Location from "./Location";

// TODO move this component to admin frontend
export default function Roster() {
  const { locations, setLocations } = useAppContext();
  const [locationSelected, setLocationSelected] = useState(undefined);
  const [newLocationSelected, setNewLocationSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = {
    locationName: "Name",
    // TODO add other fields
  };

  const editLocation = async (event, updatedLocation) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.put("atl-backend", `update/location/${updatedLocation.locationId}`, { body: updatedLocation });
    const index = locations.findIndex((locationInList) => locationInList.locationId === updatedLocation.locationId);
    locations[index] = result;
    setLocations([...locations]);
    setIsLoading(false);
    setLocationSelected(undefined);
  };

  const addLocation = async (event, newLocation) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.post("atl-backend", "create/location", { body: newLocation });
    locations.push(result);
    setLocations([...locations]);
    setIsLoading(false);
    setNewLocationSelected(false);
  };

  return (
    <div>
      <PageHeader>Court Locations</PageHeader>
      <div className="Locations">
        <Table bordered hover>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => <th key={key}>{columns[key]}</th>)}
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.locationId} onClick={() => setLocationSelected(location)}>
                {Object.keys(columns).map((key) => <td key={key}>{location[key]}</td>)}
              </tr>
            ))}
            <tr>
              <td colSpan={Object.keys(columns).length}>
                <p onClick={() => setNewLocationSelected(true)}>+ Add new location</p>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={locationSelected !== undefined} onHide={() => setLocationSelected(undefined)}>
        <Modal.Header closeButton><Modal.Title>Edit Location Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <Location originalLocation={locationSelected} saveLocation={editLocation} isLoading={isLoading} />
        </Modal.Body>
      </Modal>
      <Modal show={newLocationSelected} onHide={() => setNewLocationSelected(false)}>
        <Modal.Header closeButton><Modal.Title>Add New Location</Modal.Title></Modal.Header>
        <Modal.Body><Location saveLocation={addLocation} isLoading={isLoading} /></Modal.Body>
      </Modal>
    </div>
  );
}
