import jsPDF from 'jspdf';

/**
 * Generates and downloads a PDF certificate directly in the browser.
 * This function is designed for client-side execution in a React app.
 * @param {object} data - The certificate data.
 * @param {string} data.studentName - The name of the student.
 * @param {string} data.courseName - The name of the course.
 * @param {string} data.issueDate - The date the certificate was issued.
 */
export const generateCertificatePDF = (data) => {
  const { studentName, courseName, issueDate } = data;

  if (!studentName || !courseName || !issueDate) {
    console.error("Certificate data is incomplete.", data);
    alert("Cannot generate certificate. Data is missing.");
    return;
  }

  // Create a new PDF document in A4 landscape format
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // --- PDF Styling and Content ---

  // Add a decorative border
  doc.setLineWidth(1.5);
  doc.setDrawColor(6, 57, 112); // A dark, professional blue
  doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);

  // Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(6, 57, 112);
  doc.text('Certificate of Completion', doc.internal.pageSize.width / 2, 50, { align: 'center' });

  // "This certifies that" text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0); // Black
  doc.text('This is to certify that', doc.internal.pageSize.width / 2, 80, { align: 'center' });

  // Student Name
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(32);
  doc.setTextColor(217, 119, 6); // A golden/orange color
  doc.text(studentName, doc.internal.pageSize.width / 2, 105, { align: 'center' });

  // "has successfully completed" text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('has successfully completed the course', doc.internal.pageSize.width / 2, 125, { align: 'center' });

  // Course Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(6, 57, 112);
  doc.text(courseName, doc.internal.pageSize.width / 2, 145, { align: 'center' });

  // Issue Date
  const formattedDate = new Date(issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFontSize(14);
  doc.text(`Date of Issue: ${formattedDate}`, 30, doc.internal.pageSize.height - 30);
  
  // Signature Line
  doc.text('Authorized Signature', doc.internal.pageSize.width - 85, doc.internal.pageSize.height - 30);
  doc.setLineWidth(0.5);
  doc.line(doc.internal.pageSize.width - 95, doc.internal.pageSize.height - 35, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 35);

  // Save the PDF, which triggers a download in the browser
  doc.save(`${studentName.replace(/\s/g, '_')}_${courseName.replace(/\s/g, '_')}_Certificate.pdf`);
};