import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer"
import type { Commission } from "@/hooks/use-commissions"
import type { User } from "@/hooks/use-users"
import type { Company } from "@/hooks/use-company"
import { UserShape } from "../users/users-list"

// PDF Styles
Font.register({
  family: "Roboto",
  fonts: [{ src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf" }],
})

const styles = StyleSheet.create({
  page: { padding: 24, fontFamily: "Roboto", fontSize: 10, color: "#333" },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1pt solid #eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  logoFallback: {
    width: 40,
    height: 40,
    marginRight: 10,
    backgroundColor: "#20acd3",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logoFallbackText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#20acd3",
  },
  headerRight: {
    fontSize: 8,
    textAlign: "right",
    color: "#666",
  },
  title: { fontSize: 16, marginBottom: 15, textAlign: "center", fontWeight: "bold", color: "#444" },
  summarySection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  summaryItem: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#666",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1pt solid #ddd",
    paddingVertical: 7,
    backgroundColor: "#F3F6F9",
    fontWeight: "bold",
    fontSize: 9,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: "0.5pt solid #eee",
    alignItems: "center",
  },
  rowEven: {
    backgroundColor: "#fcfcfc",
  },
  cell: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 8,
    fontSize: 8,
    color: "#333",
  },
  statusCompleted: {
    backgroundColor: "#d4edda",
    color: "#155724",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  statusInprogress: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  statusCancelled: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  statusPending: {
    backgroundColor: "#d1ecf1",
    color: "#0c5460",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  statusRejected: {
    backgroundColor: "#e2d4ed",
    color: "#4a2472",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
    borderTop: "1pt solid #eee",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 15,
    right: 15,
    fontSize: 8,
    color: "#666",
  },
})

interface CommissionPDFDocumentProps {
  commissions: Commission[]
  users: UserShape[]
  companies: Company[]
}

const CommissionPDFDocument = ({ commissions, users, companies }: CommissionPDFDocumentProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return styles.statusCompleted
      case "inprogress":
        return styles.statusInprogress
      case "cancelled":
        return styles.statusCancelled
      case "pending":
        return styles.statusPending
      case "rejected":
        return styles.statusRejected
      default:
        return {}
    }
  }

  const totalCommissions = commissions.length
  const completedCommissions = commissions.filter((c) => c.status === "completed").length
  const pendingCommissions = commissions.filter((c) => c.status === "pending").length
  const totalCommissionAmount = commissions.reduce((sum, c) => sum + c.commissionAmount, 0)

  // Determine if logo should be shown or fallback
  const showLogo = true // Assume logo path is valid for now, or add a check if needed

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            {showLogo ? (
              <Image src="/logo.svg" style={styles.logo} />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoFallbackText}>SB</Text>
              </View>
            )}
            <View>
              <Text style={styles.companyName}>Stocbroker</Text>
              <Text style={{ fontSize: 9, color: "#666" }}>Your trusted partner in stock brokerage.</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text>123 Brokerage Lane, Financial City, FC 12345</Text>
            <Text>Email: info@stocbroker.com</Text>
            <Text>Phone: +123 456 7890</Text>
            <Text>Website: www.stocbroker.com</Text>
          </View>
        </View>

        <Text style={styles.title}>Commissions Report</Text>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Commissions</Text>
            <Text style={styles.summaryValue}>{totalCommissions}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Completed</Text>
            <Text style={styles.summaryValue}>{completedCommissions}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryValue}>{pendingCommissions}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Commission Amount</Text>
            <Text style={styles.summaryValue}>${Number(totalCommissionAmount || 0.0).toFixed(2)}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>Broker Name</Text>
          <Text style={styles.cell}>Customer Name</Text>
          <Text style={styles.cell}>Company</Text>
          <Text style={styles.cell}>Shares</Text>
          <Text style={styles.cell}>Price/Share</Text>
          <Text style={styles.cell}>Total Amount</Text>
          <Text style={styles.cell}>Commission</Text>
          <Text style={styles.cell}>Status</Text>
          <Text style={styles.cell}>Created At</Text>
        </View>

        {/* Table Rows */}
        {commissions.map((item, i) => (
          <View key={item.id} style={[styles.row, i % 2 === 0 ? styles.rowEven : {}]}>
            <Text style={styles.cell}>{item.brokerName}</Text>
            <Text style={styles.cell}>{item.customerName}</Text>
            <Text style={styles.cell}>{item.companyName}</Text>
            <Text style={styles.cell}>{item.numberOfShares}</Text>
            <Text style={styles.cell}>${Number(item.pricePerShare).toFixed(2)}</Text>
            <Text style={styles.cell}>${Number(item.totalAmount).toFixed(2)}</Text>
            <Text style={styles.cell}>${Number(item.commissionAmount).toFixed(2)}</Text>
            <Text style={[styles.cell, getStatusStyle(item.status)]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
            <Text style={styles.cell}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        ))}

        {/* Footer */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

export default CommissionPDFDocument