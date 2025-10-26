import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";



export default () => {
  const { payments, setPayments, allTeams, loadingData } = useAppContext();
  const columns = {
    teamId: {
      label: "Team",
      type: "dropdown",
      required: true,
      joiningTable: allTeams.filter((team) => team.isActive && team.teamName !== "Bye"),
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
    },
    payerName: { label: "Captain or Payer", type: "text", required: true },
    amountPaid: { label: "Amount Paid", type: "text", required: true },
    paymentMethod: { label: "Method", type: "text", required: true },
  };

  return (
    <div className="container">
      <PageHeader>Fee Payments</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <Table
          columns={columns}
          rows={payments}
          filterRows={(list) => list.filter((row) => row.amountPaid)}
          setRows={setPayments}
          getRows={() => API.get("atl-backend", "list/payment")}
          itemType="payment"
          API={API}
        />
      )}
    </div>
  );
}
