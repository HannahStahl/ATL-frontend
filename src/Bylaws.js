import React from "react";
import { PageHeader } from "react-bootstrap";
import content from "./content.json";

const getRomanNumeral = (index) => {
  const number = index + 1;
  if (number === 1) return "I";
  if (number === 2) return "II";
  if (number === 3) return "III";
  if (number === 4) return "IV";
  return "";
};

const getLetter = (index) => {
  const number = index + 1;
  return (number + 9).toString(36).toUpperCase();
};

export default function Bylaws() {
  return (
    <div className="container">
      <PageHeader>By-laws</PageHeader>
      {Object.keys(content.bylaws).map((section, index) => (
        <div key={section}>
          <h3>{`${getRomanNumeral(index)}. ${section}`}</h3>
          {content.bylaws[section].map((item, index) => (
            <div key={item.item}>
              <p>{`${getLetter(index)}. ${item.item}`}</p>
              {item.children.map((childItem, index) => (
                <p key={childItem} className="bylaw-child-item">{`${index + 1}. ${childItem}`}</p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
