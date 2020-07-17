import React from "react";
import { PageHeader } from "react-bootstrap";
import content from "./content.json";

export default function FAQ() {
  return (
    <div className="container">
      <PageHeader>FAQs</PageHeader>
      {content.faq.map((question, index) => (
        <div key={question.question}>
          {index > 0 && <hr />}
          <p>{`Q: ${question.question}`}</p>
          <p>{`A: ${question.answer}`}</p>
        </div>
      ))}
    </div>
  );
}
