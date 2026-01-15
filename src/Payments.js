import React, { useEffect, useState } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { saveAs } from "file-saver";
import zipcelx from "zipcelx";
import { pdf } from "@react-pdf/renderer";
import PaymentsPDF from "./PaymentsPDF";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { payments, setPayments, allTeams, seasons, loadingData } = useAppContext();
  const currentSeason = seasons.find((season) => season.currentSeason);

  const [teamsWithPayments, setTeamsWithPayments] = useState([]);

  useEffect(() => {
    const activeTeams = allTeams.filter((team) => team.isActive && team.teamName !== "Bye");
    setTeamsWithPayments(activeTeams.map((team) => {
      const teamPayment = payments.find((payment) => payment.teamId === team.teamId);
      return { ...team, ...(teamPayment || {})};
    }).sort((a, b) => {
      if (a.amountPaid && b.amountPaid) return a.createdAt - b.createdAt;
      if (a.amountPaid) return 1;
      if (b.amountPaid) return -1;
      return a.teamNumber - b.teamNumber;
    }));
  }, [allTeams, payments]);

  const columns = {
    teamId: {
      label: "Team",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
      readOnly: true,
    },
    payerName: { label: "Captain or Payer", type: "text" },
    amountPaid: { label: "Amount Paid", type: "text" },
    paymentMethod: { label: "Method", type: "text" },
  };

  const getPayments = () => API.get("atl-backend", "list/payment");

  const createOrUpdatePayment = async (teamId, body) => {
    const { paymentId } = body;
    if (paymentId) {
      await API.put("atl-backend", `update/payment/${paymentId}`, { body });
    } else {
      await API.post("atl-backend", "create/payment", { body });
    }
    const updatedPayments = await getPayments();
    setPayments([...updatedPayments]);
  };

  const dataKeys = Object.keys(columns);

  const getValue = (teamWithPayment, key) => {
    let value = teamWithPayment[key] || "";
    if (key === "teamId" && value.length > 0) {
      const team = allTeams.find((teamInList) => teamInList.teamId === value);
      value = team ? team.teamName || "" : "";
    }
    return value;
  };

  const downloadExcel = () => {
    const headerRow = dataKeys.map((key) => ({
      value: columns[key].label, type: "string"
    }));
    const dataRows = teamsWithPayments.map((teamWithPayment) => dataKeys.map((key) => {
      return ({ value: getValue(teamWithPayment, key), type: "string" });
    }));
    const data = [headerRow].concat(dataRows);
    zipcelx({ filename: `ATL Fee Payments - ${currentSeason.seasonName}`, sheet: { data } });
  };

  const generatePDF = async () => {
    const blob = await pdf(
      <PaymentsPDF
        columns={columns}
        teamsWithPayments={teamsWithPayments}
        getValue={getValue}
      />
    ).toBlob();
    saveAs(blob, `ATL Fee Payments - ${currentSeason.seasonName}.pdf`);
  };

  return (
    <div className="container">
      <PageHeader>Fee Payments</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <>
        <Table
          columns={columns}
          rows={teamsWithPayments}
          setRows={setPayments}
          itemType="payment"
          API={API}
          primaryKey="teamId"
          createDisabled
          removeDisabled
          customEditFunction={createOrUpdatePayment}
        />
          <p className="centered-text">
            <b>Download list of payments:</b>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={downloadExcel} className="download-schedule-link">
              <i className="fas fa-file-excel" />
              Excel
            </a>
            <span className="download-schedule-link" onClick={generatePDF}>
              <i className="fas fa-file-pdf" />
              PDF
            </span>
          </p>
        </>
      )}
    </div>
  );
}
