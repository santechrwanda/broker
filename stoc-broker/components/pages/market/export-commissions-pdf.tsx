import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
// PDF Styles
Font.register({
    family: "Roboto",
    fonts: [
      { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf" },
    ],
  });
  const styles = StyleSheet.create({
    page: { padding: 24, fontFamily: "Roboto", fontSize: 10 },
    title: { fontSize: 16, marginBottom: 15, textAlign: "center" },
    tableHeader: { flexDirection: "row", borderBottom: "0.8pt solid #ddd", paddingVertical: 5, backgroundColor: "#F3F6F9", fontWeight: "bold" },
    row: { flexDirection: "row", paddingVertical: 4, borderBottom: "0.5pt solid #ccc" },
    cell: { flex: 1, paddingLeft: 4, paddingRight: 8 },
    paging: { position: "absolute", bottom: 15, right: 15, fontSize: 11 },
  });
  
  const CommissionPDFDocument = ({ commissions }: { commissions: any[] }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Commissions List</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>#</Text>
          <Text style={styles.cell}>Broker Name</Text>
          <Text style={styles.cell}>Broker Role</Text>
          <Text style={styles.cell}>Customer Name</Text>
          <Text style={styles.cell}>Company</Text>
          <Text style={styles.cell}>Status</Text>
        </View>
        {commissions.map((item, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.cell}>{i + 1}</Text>
            <Text style={styles.cell}>{item.broker}</Text>
            <Text style={styles.cell}>{item.brokerRole}</Text>
            <Text style={styles.cell}>{item.customer}</Text>
            <Text style={styles.cell}>{item.company}</Text>
            <Text style={styles.cell}>{item.status}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  export default CommissionPDFDocument;