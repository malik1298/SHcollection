import { jsPDF } from 'jspdf';
import { Order, WebsiteSettings } from '../types/index.js';

export function generateOrderSlipPDF(order: Order, settings: WebsiteSettings): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const slip = settings.orderSlip;
  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Colors
  const burgundy = [114, 47, 55]; // #722F37
  const gold = [212, 175, 55]; // #D4AF37
  const darkText = [35, 31, 32];
  const mutedText = [100, 100, 100];

  // Top Accent Bar (Burgundy & Gold)
  doc.setFillColor(burgundy[0], burgundy[1], burgundy[2]);
  doc.rect(0, 0, pageWidth, 5, 'F');
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 5, pageWidth, 1.5, 'F');

  // Header / Branding
  if (slip.showWebsiteName || slip.showLogo) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(burgundy[0], burgundy[1], burgundy[2]);
    doc.text(settings.websiteName || 'SH COLLECTION', margin, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(settings.tagline || 'Haute Couture & Luxury Bridal Formals', margin, y + 12);
  }

  // Invoice Title on the right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text('OFFICIAL ORDER SLIP', pageWidth - margin, y + 4, { align: 'right' });

  if (slip.showOrderNumber) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(burgundy[0], burgundy[1], burgundy[2]);
    doc.text(`Order #: ${order.orderNumber}`, pageWidth - margin, y + 10, { align: 'right' });
  }

  if (slip.showDate) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    doc.text(`Date: ${formattedDate}`, pageWidth - margin, y + 15, { align: 'right' });
  }

  y += 24;

  // Horizontal divider
  doc.setDrawColor(230, 220, 210);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Header Note if configured
  if (slip.headerNote) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(burgundy[0], burgundy[1], burgundy[2]);
    doc.text(slip.headerNote.toUpperCase(), margin, y);
    y += 6;
  }

  // Two column layout: Customer Info (Left) | Atelier Info (Right)
  const colWidth = (contentWidth - 10) / 2;
  const col2X = margin + colWidth + 10;
  const startBoxY = y;

  // Left Column - Bill To
  doc.setFillColor(253, 251, 247);
  doc.roundedRect(margin, y, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(225, 215, 205);
  doc.roundedRect(margin, y, colWidth, 42, 2, 2, 'S');

  let cy = y + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(burgundy[0], burgundy[1], burgundy[2]);
  doc.text('CLIENT DETAILS', margin + 5, cy);
  cy += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);

  if (slip.showCustomerName) {
    doc.setFont('helvetica', 'bold');
    doc.text(order.customerName, margin + 5, cy);
    doc.setFont('helvetica', 'normal');
    cy += 5;
  }
  if (slip.showPhone) {
    doc.text(`Tel: ${order.phone}`, margin + 5, cy);
    cy += 5;
  }
  if (slip.showEmail && order.email) {
    doc.text(`Email: ${order.email}`, margin + 5, cy);
    cy += 5;
  }
  if (slip.showAddress) {
    const fullAddress = `${order.address}, ${order.city} ${order.province ? `, ${order.province}` : ''}`;
    const splitAddress = doc.splitTextToSize(fullAddress, colWidth - 10);
    doc.text(splitAddress, margin + 5, cy);
  }

  // Right Column - Boutique Details
  doc.setFillColor(253, 251, 247);
  doc.roundedRect(col2X, startBoxY, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(225, 215, 205);
  doc.roundedRect(col2X, startBoxY, colWidth, 42, 2, 2, 'S');

  let ay = startBoxY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(burgundy[0], burgundy[1], burgundy[2]);
  doc.text('ATELIER & CONCIERGE', col2X + 5, ay);
  ay += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);

  const studioLines = doc.splitTextToSize(settings.address || 'Flagship Bridal Studio, MM Alam Road, Lahore', colWidth - 10);
  doc.text(studioLines, col2X + 5, ay);
  ay += studioLines.length * 4.5;

  if (slip.showWhatsapp && settings.whatsappNumber) {
    doc.text(`WhatsApp: ${settings.whatsappNumber}`, col2X + 5, ay);
    ay += 5;
  }
  if (slip.showEmailContact && settings.email) {
    doc.text(`Email: ${settings.email}`, col2X + 5, ay);
    ay += 5;
  }
  doc.text(`Payment: ${order.paymentMethod || 'Cash on Delivery'}`, col2X + 5, ay);

  y += 48;

  // Items Table
  if (slip.showProducts) {
    // Table Header
    doc.setFillColor(burgundy[0], burgundy[1], burgundy[2]);
    doc.rect(margin, y, contentWidth, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    doc.text('#', margin + 3, y + 5.5);
    doc.text('ITEM DESCRIPTION & SPECIFICATION', margin + 12, y + 5.5);
    if (slip.showQuantity) {
      doc.text('QTY', margin + 115, y + 5.5, { align: 'center' });
    }
    if (slip.showPrices) {
      doc.text('UNIT PRICE', margin + 145, y + 5.5, { align: 'right' });
      doc.text('AMOUNT', pageWidth - margin - 3, y + 5.5, { align: 'right' });
    }

    y += 8;

    // Table Rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);

    order.items.forEach((item, index) => {
      const rowHeight = 12;
      const isAlt = index % 2 === 1;
      if (isAlt) {
        doc.setFillColor(250, 248, 245);
        doc.rect(margin, y, contentWidth, rowHeight, 'F');
      }

      doc.setDrawColor(240, 235, 230);
      doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

      // Index
      doc.text(`${index + 1}`, margin + 3, y + 5);

      // Item Name & specs
      doc.setFont('helvetica', 'bold');
      const safeName = item.name.length > 45 ? item.name.substring(0, 42) + '...' : item.name;
      doc.text(safeName, margin + 12, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      const specs = `SKU: ${item.sku || 'N/A'} | Size: ${item.size} | Color: ${item.color}`;
      doc.text(specs, margin + 12, y + 9.5);
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);

      // Quantity
      if (slip.showQuantity) {
        doc.text(`${item.quantity}`, margin + 115, y + 7, { align: 'center' });
      }

      // Unit Price & Total
      if (slip.showPrices) {
        const sym = order.currencySymbol || 'Rs.';
        doc.text(`${sym} ${item.price.toLocaleString()}`, margin + 145, y + 7, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.text(`${sym} ${(item.price * item.quantity).toLocaleString()}`, pageWidth - margin - 3, y + 7, {
          align: 'right',
        });
        doc.setFont('helvetica', 'normal');
      }

      y += rowHeight;
    });

    y += 6;

    // Totals Section
    if (slip.showPrices) {
      const totalBoxWidth = 75;
      const totalBoxX = pageWidth - margin - totalBoxWidth;
      const sym = order.currencySymbol || 'Rs.';

      // Subtotal
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Subtotal:', totalBoxX, y);
      doc.text(`${sym} ${order.subtotal.toLocaleString()}`, pageWidth - margin - 3, y, { align: 'right' });
      y += 5;

      // Discount
      if (slip.showDiscount && order.discount > 0) {
        doc.setTextColor(114, 47, 55);
        doc.text('Discount:', totalBoxX, y);
        doc.text(`-${sym} ${order.discount.toLocaleString()}`, pageWidth - margin - 3, y, { align: 'right' });
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        y += 5;
      }

      // Shipping
      if (slip.showShipping) {
        doc.text('Delivery & Handling:', totalBoxX, y);
        doc.text(
          order.shipping > 0 ? `${sym} ${order.shipping.toLocaleString()}` : 'Complimentary / Free',
          pageWidth - margin - 3,
          y,
          { align: 'right' }
        );
        y += 6;
      }

      // Total divider
      doc.setDrawColor(burgundy[0], burgundy[1], burgundy[2]);
      doc.setLineWidth(0.6);
      doc.line(totalBoxX, y, pageWidth - margin, y);
      y += 4;

      // Grand Total
      if (slip.showTotal) {
        doc.setFillColor(253, 248, 245);
        doc.rect(totalBoxX, y - 2, totalBoxWidth, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(burgundy[0], burgundy[1], burgundy[2]);
        doc.text('GRAND TOTAL:', totalBoxX + 2, y + 4);
        doc.text(`${sym} ${order.grandTotal.toLocaleString()}`, pageWidth - margin - 3, y + 4, { align: 'right' });
        y += 12;
      }
    }
  }

  // Notes if configured & present
  if (slip.showNotes && order.notes) {
    doc.setFillColor(250, 248, 245);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(burgundy[0], burgundy[1], burgundy[2]);
    doc.text('CLIENT INSTRUCTIONS & FITTING NOTES:', margin + 4, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    const noteLines = doc.splitTextToSize(order.notes, contentWidth - 8);
    doc.text(noteLines, margin + 4, y + 10);
    y += 20;
  }

  // Footer Note & Signature area
  if (slip.showFooterText && slip.footerNote) {
    const bottomY = 270;
    doc.setDrawColor(220, 210, 200);
    doc.line(margin, bottomY - 6, pageWidth - margin, bottomY - 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    const footerLines = doc.splitTextToSize(slip.footerNote, contentWidth);
    doc.text(footerLines, margin, bottomY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(burgundy[0], burgundy[1], burgundy[2]);
    doc.text(
      `Generated on ${new Date().toLocaleString()} | SH COLLECTION LUXURY BRIDAL ATELIER`,
      pageWidth / 2,
      288,
      { align: 'center' }
    );
  }

  // Download PDF
  doc.save(`SH-Collection-Order-${order.orderNumber}.pdf`);
}
