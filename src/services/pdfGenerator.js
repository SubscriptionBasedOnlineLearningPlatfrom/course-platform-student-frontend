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

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // --- Background and Outer Border ---
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Main decorative border (blue)
  doc.setLineWidth(3);
  doc.setDrawColor(6, 57, 112); // Dark blue
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner border
  doc.setLineWidth(0.5);
  doc.setDrawColor(6, 57, 112);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Decorative corner ornaments (yellow/gold)
  doc.setLineWidth(1.5);
  doc.setDrawColor(217, 119, 6); // Gold color
  
  // Top-left corner
  doc.line(15, 15, 30, 15);
  doc.line(15, 15, 15, 30);
  
  // Top-right corner
  doc.line(pageWidth - 15, 15, pageWidth - 30, 15);
  doc.line(pageWidth - 15, 15, pageWidth - 15, 30);
  
  // Bottom-left corner
  doc.line(15, pageHeight - 15, 30, pageHeight - 15);
  doc.line(15, pageHeight - 15, 15, pageHeight - 30);
  
  // Bottom-right corner
  doc.line(pageWidth - 15, pageHeight - 15, pageWidth - 30, pageHeight - 15);
  doc.line(pageWidth - 15, pageHeight - 15, pageWidth - 15, pageHeight - 30);

  // --- Company Branding ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(6, 57, 112);
  doc.text('ProLearnx', pageWidth / 2, 35, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('LEARN SMART. GROW FAST', pageWidth / 2, 42, { align: 'center' });

  // --- Certificate Title ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(40);
  doc.setTextColor(6, 57, 112);
  doc.text('Certificate of Completion', pageWidth / 2, 65, { align: 'center' });

  // Decorative underline
  doc.setLineWidth(1);
  doc.setDrawColor(217, 119, 6);
  doc.line(pageWidth / 2 - 40, 68, pageWidth / 2 + 40, 68);

  // --- "This certifies that" text ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text('This is to certify that', pageWidth / 2, 85, { align: 'center' });

  // --- Student Name ---
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(32);
  doc.setTextColor(6, 57, 112);
  doc.text(studentName, pageWidth / 2, 105, { align: 'center' });

  // --- "has successfully completed" text ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text('has successfully completed the course', pageWidth / 2, 120, { align: 'center' });

  // --- Course Name ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(60, 60, 60);
  doc.text(courseName, pageWidth / 2, 138, { align: 'center' });

  // --- Footer Section ---
  const formattedDate = new Date(issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Date of Issue (left side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Date of Issue', 30, pageHeight - 35);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(formattedDate, 30, pageHeight - 28);

  // Authorized Signature (right side)
  // Signature in cursive style
  doc.setFont('times', 'italic');
  doc.setFontSize(20);
  doc.setTextColor(60, 60, 60);
  doc.text('s. sivapriya', pageWidth - 30, pageHeight - 40, { align: 'right' });

  // Signature line
  doc.setLineWidth(0.5);
  doc.setDrawColor(60, 60, 60);
  doc.line(pageWidth - 80, pageHeight - 42, pageWidth - 30, pageHeight - 42);

  // "Authorized Signature" label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Authorized Signature', pageWidth - 30, pageHeight - 35, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text('Online Learning Platform', pageWidth - 30, pageHeight - 28, { align: 'right' });

  // Save the PDF
  doc.save(`${studentName.replace(/\s/g, '_')}_${courseName.replace(/\s/g, '_')}_Certificate.pdf`);
};