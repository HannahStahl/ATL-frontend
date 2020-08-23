import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export default ({ dataKeys, columns, filterMatches, allMatches, getValue, primaryKey }) => {
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
      width: `${100/dataKeys.length}%`,
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
            {dataKeys.map((key) => (
              <View key={key} style={pdfStyles.tableCol}>
                <Text style={pdfStyles.tableCell}>{columns[key].label.toUpperCase()}</Text>
              </View>
            ))}
          </View>
          {filterMatches(allMatches).map((match) => (
            <View key={match[primaryKey]} style={pdfStyles.tableRow}>
              {dataKeys.map((key) => (
                <View key={key} style={pdfStyles.tableCol}>
                  <Text style={pdfStyles.tableCell}>{getValue(match, key)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
