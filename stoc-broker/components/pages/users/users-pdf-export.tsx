// components/UserPDFDocument.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register font
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf" },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    position: "relative",
    fontFamily: "Roboto",
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "0.8pt solid #ddd",
    paddingVertical: 5,
    backgroundColor: "#F3F6F9",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottom: "0.5pt solid #ccc",
  },
  cell: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 8,
  },
  statusActive: {
    color: "green",
    fontWeight: "bold",
  },
  statusBlocked: {
    color: "red",
    fontWeight: "bold",
  },
  paging: {
    position: "absolute",
    bottom: 15,
    right: 15,
    fontSize: 11
  }
});

// Helper: chunk array into pages
const chunkArray = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const ROWS_PER_PAGE = 25; // Adjust based on font size and spacing

const UserPDFDocument = ({ users }: { users: any[] }) => {
  const pages = chunkArray(users, ROWS_PER_PAGE);

  return (
    <Document>
      {pages.map((userChunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <Text style={styles.title}>Users List</Text>
          <Text style={styles.paging}>Page {pageIndex + 1}</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.cell, { flex: 1.5 }]}>Name</Text>
            <Text style={[styles.cell, { flex: 2 }]}>Email</Text>
            <Text style={styles.cell}>Phone</Text>
            <Text style={styles.cell}>Date</Text>
            <Text style={styles.cell}>Status</Text>
          </View>

          {/* User Rows */}
          {userChunk.map((user, i) => {
            const serialNumber = pageIndex * ROWS_PER_PAGE + i + 1;
            return (
              <View style={styles.row} key={serialNumber}>
                <Text style={[styles.cell, { flex: 0.5 }]}>{serialNumber}</Text>
                <Text style={[styles.cell, { flex: 1.5 }]}>{user.name}</Text>
                <Text style={[styles.cell, { flex: 2 }]}>{user.email}</Text>
                <Text style={styles.cell}>{user.phone}</Text>
                <Text style={styles.cell}>{user.date}</Text>
                <Text
                  style={[
                    styles.cell,
                    user.status === "ACTIVE"
                      ? styles.statusActive
                      : styles.statusBlocked,
                  ]}
                >
                  {user.status}
                </Text>
              </View>
            );
          })}
        </Page>
      ))}
    </Document>
  );
};

export default UserPDFDocument;
