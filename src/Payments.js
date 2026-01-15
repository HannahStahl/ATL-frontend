import React, { useEffect, useState } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { payments, setPayments, allTeams, loadingData } = useAppContext();

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

  const createOrUpdatePayment = async (paymentId, body) => {
    if (paymentId) {
      await API.put("atl-backend", `update/payment/${paymentId}`, { body });
    } else {
      await API.post("atl-backend", "create/payment", { body });
    }
    const updatedPayments = await getPayments();
    setPayments([...updatedPayments]);
  }

  return (
    <div className="container">
      <PageHeader>Fee Payments</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <Table
          columns={columns}
          rows={teamsWithPayments}
          setRows={setPayments}
          itemType="payment"
          API={API}
          createDisabled
          removeDisabled
          customEditFunction={createOrUpdatePayment}
        />
      )}
    </div>
  );
}
