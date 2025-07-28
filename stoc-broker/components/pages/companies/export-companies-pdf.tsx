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

const CompanyPDFDocument = ({ companies }: { companies: any[] }) => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Companies List</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.cell}>#</Text>
            <Text style={styles.cell}>Name</Text>
            <Text style={styles.cell}>Owner</Text>
            <Text style={styles.cell}>Industry</Text>
            <Text style={styles.cell}>Location</Text>
            <Text style={styles.cell}>Rating</Text>
          </View>
          {companies.map((company, i) => (
            <View style={styles.row} key={company.id}>
              <Text style={styles.cell}>{i + 1}</Text>
              <Text style={styles.cell}>{company.name}</Text>
              <Text style={styles.cell}>{company.owner}</Text>
              <Text style={styles.cell}>{company.industry}</Text>
              <Text style={styles.cell}>{company.location}</Text>
              <Text style={styles.cell}>{company.rating}</Text>
            </View>
          ))}
        </Page>
      </Document>
    );
  };

  export default CompanyPDFDocument;