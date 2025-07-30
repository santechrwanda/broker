import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import type { Company } from "@/hooks/use-company"

// PDF Styles - Using default fonts instead of custom fonts to avoid loading issues
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "2pt solid #127894",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#127894",
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 3,
  },
  companyDetails: {
    fontSize: 10,
    color: "#888888",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    color: "#666666",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1.5pt solid #127894",
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: "0.5pt solid #e0e0e0",
    minHeight: 25,
  },
  alternateRow: {
    backgroundColor: "#f9f9f9",
  },
  cell: {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    textAlign: "left",
    fontSize: 9,
  },
  cellBold: {
    fontFamily: "Helvetica-Bold",
  },
  statusCell: {
    flex: 0.8,
    paddingLeft: 6,
    paddingRight: 6,
    textAlign: "center",
  },
  statusApproved: {
    color: "#16a34a",
    fontFamily: "Helvetica-Bold",
  },
  statusPending: {
    color: "#ca8a04",
    fontFamily: "Helvetica-Bold",
  },
  statusRejected: {
    color: "#dc2626",
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#888888",
    fontSize: 8,
    borderTop: "1pt solid #e0e0e0",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 15,
    right: 30,
    fontSize: 9,
    color: "#666666",
  },
  summarySection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    color: "#127894",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#666666",
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
})

interface CompanyPDFDocumentProps {
  companies: Company[]
}

const CompanyPDFDocument = ({ companies }: CompanyPDFDocumentProps) => {
  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusStyle = (status: Company["status"]) => {
    switch (status) {
      case "approved":
        return styles.statusApproved
      case "pending":
        return styles.statusPending
      case "rejected":
        return styles.statusRejected
      default:
        return {}
    }
  }

  // Calculate summary statistics
  const totalCompanies = companies.length
  const approvedCompanies = companies.filter((c) => c.status === "approved").length
  const pendingCompanies = companies.filter((c) => c.status === "pending").length
  const rejectedCompanies = companies.filter((c) => c.status === "rejected").length
  const totalShares = companies.reduce((sum, c) => sum + (c.numberOfShares || 0), 0)

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* Removed Image component to avoid potential loading issues */}
          <View style={[styles.logo, { backgroundColor: "#127894", borderRadius: 25, justifyContent: "center", alignItems: "center" }]}>
            <Text style={{ color: "white", fontSize: 16, fontFamily: "Helvetica-Bold" }}>SB</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.companyName}>StockBroker Platform</Text>
            <Text style={styles.companyTagline}>Professional Stock Trading & Company Management</Text>
            <Text style={styles.companyDetails}>
              Email: info@stockbroker.com | Phone: +250 788 123 456 | Website: www.stockbroker.com
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Companies Registry Report</Text>
        <Text style={styles.subtitle}>
          Generated on{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Summary Statistics</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Companies:</Text>
            <Text style={styles.summaryValue}>{totalCompanies}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Approved Companies:</Text>
            <Text style={styles.summaryValue}>{approvedCompanies}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pending Approval:</Text>
            <Text style={styles.summaryValue}>{pendingCompanies}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rejected Applications:</Text>
            <Text style={styles.summaryValue}>{rejectedCompanies}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Shares:</Text>
            <Text style={styles.summaryValue}>{formatNumber(totalShares)}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 0.5 }]}>#</Text>
          <Text style={[styles.cell, { flex: 2 }]}>Company Name</Text>
          <Text style={[styles.cell, { flex: 1.5 }]}>Owner</Text>
          <Text style={[styles.cell, { flex: 1.2 }]}>Category</Text>
          <Text style={[styles.cell, { flex: 1 }]}>Shares</Text>
          <Text style={[styles.statusCell]}>Status</Text>
          <Text style={[styles.cell, { flex: 1.5 }]}>Location</Text>
          <Text style={[styles.cell, { flex: 1 }]}>Created</Text>
        </View>

        {/* Table Rows */}
        {companies.map((company, index) => (
          <View style={[styles.row, index % 2 === 1 ? styles.alternateRow : {}]} key={company.id}>
            <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.cellBold, { flex: 2 }]}>{company.companyName}</Text>
            <Text style={[styles.cell, { flex: 1.5 }]}>{company.ownerFullName}</Text>
            <Text style={[styles.cell, { flex: 1.2 }]}>{formatCategory(company.companyCategory)}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{formatNumber(company.numberOfShares)}</Text>
            <Text style={[styles.statusCell, getStatusStyle(company.status)]}>{company.status.toUpperCase()}</Text>
            <Text style={[styles.cell, { flex: 1.5 }]}>
              {company.companyAddress?.substring(0, 30)}
              {(company.companyAddress?.length || 0) > 30 ? "..." : ""}
            </Text>
            <Text style={[styles.cell, { flex: 1 }]}>{formatDate(company.createdAt)}</Text>
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          This document contains confidential information. Generated by StockBroker Platform Management System.
          {"\n"}For inquiries, contact: support@stockbroker.com
        </Text>

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

export default CompanyPDFDocument