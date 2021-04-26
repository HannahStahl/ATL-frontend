import React, { useState, useEffect } from "react";
import { FormGroup, Modal, Radio } from "react-bootstrap";
import { API } from "aws-amplify";
import { useAppContext } from "./libs/contextLib";
import LoaderButton from "./LoaderButton";

export default ({ switchingSeason, setSwitchingSeason }) => {
  const { seasons, setSeasons } = useAppContext();
  const currentSeason = seasons.find((season) => season.currentSeason);
  const [selectedSeasonId, setSelectedSeasonId] = useState(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentSeason) {
      setSelectedSeasonId(currentSeason.seasonId);
    }
  }, [currentSeason]);

  const updateCurrentSeason = async () => {
    setIsSaving(true);
    await Promise.all(seasons.map((season) => (
      API.put("atl-backend", `update/season/${season.seasonId}`, {
        body: {
          ...season,
          currentSeason: season.seasonId === selectedSeasonId,
          published: season.seasonId === selectedSeasonId ? true : season.published,
        }
      })
    )));
    setIsSaving(false);
    const updatedSeasons = await API.get("atl-backend", "list/season");
    setSeasons([...updatedSeasons]);
    setSwitchingSeason(false);
  };

  return (
    <Modal
      className="switch-current-season-modal"
      show={switchingSeason}
      onHide={() => setSwitchingSeason(false)}
    >
      <Modal.Header closeButton>
        <h2>Select current season</h2>
      </Modal.Header>
      <Modal.Body>
        <p>This will update which calendar is displayed on the website home page.</p>
        <p>This will also enforce the roster deadlines specified for the selected season.</p>
        {seasons.map((season) => (
          <FormGroup>
            <Radio
              inline
              checked={season.seasonId === selectedSeasonId}
              onChange={() => setSelectedSeasonId(season.seasonId)}
            >
              {season.seasonName}
            </Radio>
          </FormGroup>
        ))}
        <FormGroup>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="primary"
            isLoading={isSaving}
            onClick={updateCurrentSeason}
          >
            Submit
          </LoaderButton>
        </FormGroup>
      </Modal.Body>
    </Modal>
  );
};
