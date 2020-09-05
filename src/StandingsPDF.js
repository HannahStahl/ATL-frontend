import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export default ({ columns, standings, getValue }) => {
  const pdfStyles = StyleSheet.create({
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row"
    },
    tableCol: {
      width: `${100/Object.keys(columns).length}%`,
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0
    },
    tableCell: {
      margin: "auto",
      marginTop: 5,
      fontSize: 10
    }
  });

  return (
    <Document>
      <Page style={pdfStyles.body} orientation="landscape">
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            {Object.keys(columns).map((key) => (
              <View key={key} style={pdfStyles.tableCol}>
                <Text style={pdfStyles.tableCell}>{columns[key].label.toUpperCase()}</Text>
              </View>
            ))}
          </View>
          {standings.map((team) => (
            <View key={team.teamId} style={pdfStyles.tableRow}>
              {Object.keys(columns).map((key) => (
                <View key={key} style={pdfStyles.tableCol}>
                  <Text style={pdfStyles.tableCell}>{getValue(team, key)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
