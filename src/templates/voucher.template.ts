interface VoucherData {
    bookingId: string;
    generatedDate: string;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    numberOfGuests: number;
    numberOfAdults: number;
    numberOfChildren: number;
    villaName: string;
    villaLocation: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfNights: number;
    bookingStatus: string;
    bookingStatusClass: string;
    caretakerPhone: string;
    managerPhone: string;
    basePrice: string;
    extraCharges: string;
    discount: string;
    taxPercentage: string;
    tax: string;
    totalAmount: string;
    amountPaid: string;
    balanceDue: string;
}

export function createVoucherHTML(data: VoucherData): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Arial', sans-serif;
      background: #f0ede8;
      padding: 0;
      color: #1A1A1A;
    }

    .voucher {
      max-width: 820px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    }

    /* ─── HEADER ─────────────────────────────── */
    .header {
      background: linear-gradient(135deg, #FF6B35 0%, #e8522a 100%);
      color: white;
      padding: 36px 40px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left h1 {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .header-left .tagline {
      font-size: 13px;
      opacity: 0.85;
      margin-top: 4px;
      letter-spacing: 1px;
    }

    .header-logo img {
      height: 64px;
      object-fit: contain;
    }

    /* ─── BOOKING BADGE ──────────────────────── */
    .booking-badge {
      background: #FFF5F0;
      border-left: 5px solid #FF6B35;
      padding: 18px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ffe0d3;
    }

    .booking-id-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
    .booking-id-value { font-size: 26px; font-weight: 900; color: #FF6B35; margin-top: 2px; }
    .booking-date { font-size: 13px; color: #888; text-align: right; }
    .booking-date strong { display: block; color: #444; font-size: 14px; }

    /* ─── CONTENT ────────────────────────────── */
    .content { padding: 32px 40px; }

    /* ─── SECTION ────────────────────────────── */
    .section { margin-bottom: 28px; }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      color: #FF6B35;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #ffe0d3;
    }

    /* ─── INFO GRID ──────────────────────────── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .info-grid.three-col { grid-template-columns: 1fr 1fr 1fr; }
    .info-grid.four-col  { grid-template-columns: 1fr 1fr 1fr 1fr; }

    .info-item {
      background: #fafafa;
      padding: 14px 16px;
      border-radius: 10px;
      border: 1px solid #f0f0f0;
    }

    .info-label {
      font-size: 10px;
      color: #aaa;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 5px;
    }

    .info-value {
      font-size: 15px;
      font-weight: 700;
      color: #1A1A1A;
    }

    /* ─── STATUS BADGE ───────────────────────── */
    .status-badge {
      display: inline-block;
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-confirmed { background: #E8F5E9; color: #2E7D32; }
    .status-pending   { background: #FFF3E0; color: #F57C00; }
    .status-cancelled { background: #FFEBEE; color: #C62828; }

    /* ─── PRICE TABLE ────────────────────────── */
    .price-table {
      width: 100%;
      border-collapse: collapse;
    }

    .price-table tr { border-bottom: 1px solid #f5f5f5; }

    .price-table td {
      padding: 11px 4px;
      font-size: 14px;
    }

    .price-table .label { color: #666; }
    .price-table .amount { text-align: right; font-weight: 600; color: #333; }

    .price-table .subtotal-row td { color: #999; font-size: 13px; }

    .price-table .total-row {
      border-top: 2px solid #FF6B35;
      border-bottom: 2px solid #FF6B35;
    }
    .price-table .total-row td {
      padding: 14px 4px;
      font-size: 17px;
      font-weight: 900;
      color: #FF6B35;
    }

    .price-table .balance-row td {
      color: #c0392b;
      font-weight: 700;
    }

    .price-table .paid-row td {
      color: #27ae60;
      font-weight: 600;
    }

    /* ─── DIVIDER ────────────────────────────── */
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #ffe0d3, transparent);
      margin: 8px 0 28px;
    }

    /* ─── VILLA CONTACTS ─────────────────────── */
    .villa-contacts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .villa-contact-card {
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }
    .caretaker-card { background: #1A1A1A; }
    .manager-card   { background: #2c1810; }
    .vc-icon { font-size: 28px; flex-shrink: 0; margin-top: 2px; }
    .vc-role {
      font-size: 10px; font-weight: 700; color: #aaa;
      text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;
    }
    .vc-phone {
      font-size: 17px; font-weight: 900; color: #FF6B35; margin-bottom: 4px;
    }
    .vc-note { font-size: 11px; color: #888; }

    /* ─── GOA ESSENTIALS ─────────────────────── */
    .goa-essentials {
      background: linear-gradient(135deg, #fff8f5 0%, #fff3ee 100%);
      border: 1px solid #ffe0d3;
      border-radius: 14px;
      padding: 24px 28px;
      margin-bottom: 28px;
    }

    .essentials-title {
      font-size: 13px;
      font-weight: 900;
      color: #FF6B35;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 6px;
    }

    .essentials-subtitle {
      font-size: 12px;
      color: #aaa;
      margin-bottom: 20px;
    }

    .essentials-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .essential-card {
      background: white;
      border-radius: 10px;
      padding: 14px 16px;
      border: 1px solid #f5e8e2;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .essential-icon {
      font-size: 22px;
      line-height: 1;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .essential-info {}
    .essential-name {
      font-size: 13px;
      font-weight: 700;
      color: #1A1A1A;
      margin-bottom: 3px;
    }
    .essential-phone {
      font-size: 13px;
      color: #FF6B35;
      font-weight: 600;
    }
    .essential-note {
      font-size: 11px;
      color: #aaa;
      margin-top: 2px;
    }

    /* ─── CARETAKER HIGHLIGHT ────────────────── */
    .caretaker-bar {
      background: #1A1A1A;
      color: white;
      border-radius: 10px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .caretaker-bar .ct-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }
    .caretaker-bar .ct-name  { font-size: 15px; font-weight: 700; color: white; margin-top: 2px; }
    .caretaker-bar .ct-phone { font-size: 16px; font-weight: 900; color: #FF6B35; }

    /* ─── TAXI NOTE ──────────────────────────── */
    .taxi-note {
      background: #fffbf0;
      border: 1px solid #ffe99a;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 12px;
      color: #7a6000;
      display: flex;
      gap: 8px;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    /* ─── EATS & DRINKS ──────────────────────── */
    .food-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 28px;
    }

    .food-col {
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #f0f0f0;
    }

    .food-col-header {
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .food-col-header.drinks-header { background: #1a1a2e; }
    .food-col-header.eats-header   { background: #2d1a0e; }

    .food-col-header .fch-icon { font-size: 20px; }
    .food-col-header .fch-title {
      font-size: 13px;
      font-weight: 900;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .food-col-header .fch-sub {
      font-size: 10px;
      color: rgba(255,255,255,0.5);
      margin-top: 1px;
    }

    .food-list {
      list-style: none;
      padding: 10px 0;
      background: #fafafa;
    }

    .food-list li {
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #f0f0f0;
    }

    .food-list li:last-child { border-bottom: none; }

    .food-list li::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .drinks-list li::before { background: #FF6B35; }
    .eats-list   li::before { background: #e8522a; }

    /* ─── POLICY SECTION ─────────────────────── */
    .policy-wrapper {
      border: 1px solid #ede8e3;
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .policy-header {
      background: #1A1A1A;
      color: white;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .policy-header-icon  { font-size: 22px; }
    .policy-header-title { font-size: 14px; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 2px; }
    .policy-header-sub   { font-size: 11px; color: #aaa; margin-top: 2px; }
    .policy-block {
      padding: 20px 24px;
      border-bottom: 1px solid #f0ebe6;
    }
    .policy-block:last-child { border-bottom: none; }
    .policy-block-title {
      font-size: 12px; font-weight: 900; color: #FF6B35;
      text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px;
    }
    .policy-rule-card {
      display: flex; gap: 14px; align-items: flex-start;
      padding: 12px 14px; border-radius: 10px; margin-bottom: 10px;
    }
    .green-card  { background: #f0faf2; border: 1px solid #b7e4c7; }
    .orange-card { background: #fff8f0; border: 1px solid #ffddb3; }
    .red-card    { background: #fff5f5; border: 1px solid #ffc4c4; }
    .prc-badge {
      width: 24px; height: 24px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 900; color: white; flex-shrink: 0; margin-top: 1px;
    }
    .green-badge  { background: #2E7D32; }
    .orange-badge { background: #E65100; }
    .red-badge    { background: #C62828; }
    .prc-title { font-size: 13px; font-weight: 700; color: #1A1A1A; margin-bottom: 4px; }
    .prc-text  { font-size: 12px; color: #555; line-height: 1.7; }
    .policy-example {
      background: #fafafa; border-left: 3px solid #FF6B35;
      padding: 10px 14px; border-radius: 0 8px 8px 0; margin-top: 4px;
    }
    .pe-label { font-size: 10px; font-weight: 700; color: #FF6B35; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .pe-text  { font-size: 12px; color: #555; line-height: 1.7; }
    .amenities-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;
    }
    .amenity-item {
      background: #fafafa; border: 1px solid #f0f0f0;
      border-radius: 8px; padding: 9px 12px; font-size: 12px; font-weight: 600; color: #333;
    }
    .optional-note {
      background: #fff8f0; border: 1px solid #ffddb3;
      border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #7a4000;
    }
    .rules-group { margin-bottom: 14px; }
    .rules-group:last-child { margin-bottom: 0; }
    .rules-group-label {
      font-size: 12px; font-weight: 700; color: #444;
      margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px dashed #e0e0e0;
    }
    .rule-item { font-size: 12px; color: #555; line-height: 1.9; padding-left: 4px; }
    .cooking-note { font-size: 11px; color: #999; margin-bottom: 12px; font-style: italic; }
    .cooking-table-wrapper { overflow: hidden; border-radius: 10px; border: 1px solid #f0f0f0; margin-bottom: 10px; }
    .cooking-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .cooking-table thead tr { background: #FF6B35; color: white; }
    .cooking-table thead th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .cooking-table tbody tr { border-bottom: 1px solid #f5f5f5; }
    .cooking-table tbody tr:last-child { border-bottom: none; }
    .cooking-table tbody tr:nth-child(even) { background: #fafafa; }
    .cooking-table tbody td { padding: 10px 14px; color: #333; font-weight: 600; }
    .cooking-footer-note { font-size: 11px; color: #999; font-style: italic; }

    /* ─── PAGE BREAK CONTROL ─────────────────── */
    .section,
    .info-grid,
    .info-item,
    .villa-contacts-grid,
    .villa-contact-card,
    .goa-essentials,
    .essentials-grid,
    .essential-card,
    .food-section,
    .food-col,
    .food-list,
    .policy-wrapper,
    .policy-block,
    .policy-rule-card,
    .policy-example,
    .amenities-grid,
    .cooking-table-wrapper,
    .cooking-table,
    .price-table,
    .caretaker-bar,
    .taxi-note,
    .terms,
    .footer,
    .rules-group,
    .optional-note {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .food-section      { page-break-before: auto; break-before: auto; }
    .policy-wrapper    { page-break-before: auto; break-before: auto; }

    .section-title     { page-break-after: avoid; break-after: avoid; }
    .policy-block-title { page-break-after: avoid; break-after: avoid; }

    /* ─── TERMS ──────────────────────────────── */
    .terms {
      background: #fafafa;
      border-radius: 10px;
      padding: 16px 20px;
      font-size: 11.5px;
      color: #888;
      line-height: 1.8;
      margin-bottom: 0;
    }

    .terms strong { color: #555; }

    /* ─── FOOTER ─────────────────────────────── */
    .footer {
      background: #1A1A1A;
      color: white;
      padding: 28px 40px;
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .footer-logo img {
      height: 48px;
      object-fit: contain;
      opacity: 0.9;
    }

    .footer-contact { font-size: 12px; line-height: 2; color: #bbb; text-align: center; }
    .footer-contact a { color: #FF6B35; text-decoration: none; }

    .footer-tagline {
      text-align: right;
      font-size: 12px;
      color: #666;
      font-style: italic;
      line-height: 1.7;
    }

    .footer-copy {
      text-align: center;
      font-size: 10px;
      color: #555;
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid #333;
    }
    @media print {
      body {
        padding: 0 !important;
        background: white !important;
      }
      .voucher {
        box-shadow: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
      }
    }

    html, body {
      height: auto !important;
      overflow: hidden !important;
    }
  </style>
</head>
<body>
<div class="voucher">

  <!-- ═══ HEADER ═══════════════════════════════════════════════ -->
  <div class="header">
    <div class="header-left">
      <h1>Booking Voucher</h1>
      <div class="tagline">TBK Villas — Premium Villa Stays in Goa</div>
    </div>
    <div class="header-logo">
      <img src="data:image/png;base64,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ируван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" style="display:block; height:64px; object-fit:contain;" alt="TBK Villas"/>
    </div>
  </div>

  <!-- ═══ BOOKING BADGE ════════════════════════════════════════ -->
  <div class="booking-badge">
    <div>
      <div class="booking-id-label">Booking Reference</div>
      <div class="booking-id-value">#${data.bookingId}</div>
    </div>
    <div class="booking-date">
      <span>Voucher Generated</span>
      <strong>${data.generatedDate}</strong>
    </div>
  </div>

  <!-- ═══ CONTENT ══════════════════════════════════════════════ -->
  <div class="content">

    <!-- Guest Info -->
    <div class="section">
      <div class="section-title">👤 Guest Information</div>
      <div class="info-grid" style="margin-bottom:12px;">
        <div class="info-item">
          <div class="info-label">Guest Name</div>
          <div class="info-value">${data.guestName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Phone Number</div>
          <div class="info-value">${data.guestPhone}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email Address</div>
          <div class="info-value">${data.guestEmail}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Total Guests</div>
          <div class="info-value">${data.numberOfGuests} Persons</div>
        </div>
      </div>
      <div class="info-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="info-item">
          <div class="info-label">Adults</div>
          <div class="info-value">${data.numberOfAdults}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Children</div>
          <div class="info-value">${data.numberOfChildren}</div>
        </div>
      </div>
    </div>

    <!-- Villa + Stay Details -->
    <div class="section">
      <div class="section-title">🏡 Villa &amp; Stay Details</div>
      <!-- Row 1: Villa Name + Location -->
      <div class="info-grid" style="margin-bottom: 12px;">
        <div class="info-item">
          <div class="info-label">Villa Name</div>
          <div class="info-value">${data.villaName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Location</div>
          <div class="info-value">
            <a href="${data.villaLocation}" target="_blank" style="display:inline-block; background:#FF6B35; color:white; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:700; text-decoration:none; letter-spacing:0.5px;">📍 View on Maps</a>
          </div>
        </div>
      </div>
      <!-- Row 2: Check-In + Check-Out + Nights + Status -->
      <div class="info-grid" style="grid-template-columns: 1fr 1fr 1fr 1fr;">
        <div class="info-item">
          <div class="info-label">Check-In</div>
          <div class="info-value">${data.checkInDate}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Check-Out</div>
          <div class="info-value">${data.checkOutDate}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Total Nights</div>
          <div class="info-value">${data.numberOfNights} Nights</div>
        </div>
        <div class="info-item">
          <div class="info-label">Booking Status</div>
          <div class="info-value">
            <span class="status-badge status-${data.bookingStatusClass}">${data.bookingStatus}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Villa Contacts -->
    <div class="section">
      <div class="section-title">📞 Villa Contacts</div>
      <div class="villa-contacts-grid">
        <div class="villa-contact-card caretaker-card">
          <div class="vc-icon">🏡</div>
          <div class="vc-info">
            <div class="vc-role">Villa Caretaker</div>
            <div class="vc-phone">${data.caretakerPhone}</div>
            <div class="vc-note">On-ground support during your stay</div>
          </div>
        </div>
        <div class="villa-contact-card manager-card">
          <div class="vc-icon">👨‍💼</div>
          <div class="vc-info">
            <div class="vc-role">Villa Manager</div>
            <div class="vc-phone">${data.managerPhone}</div>
            <div class="vc-note">For bookings &amp; escalations</div>
          </div>
        </div>
      </div>
      <!-- Emergency Contacts -->
      <div style="margin-top:12px; background:#1a1a2e; border-radius:12px; padding:16px 20px;">
        <div style="font-size:10px; font-weight:700; color:#aaa; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px;">🚨 Emergency Contacts — TBK Villas Team</div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
          <div style="text-align:center;">
            <div style="font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Jairaj</div>
            <div style="font-size:15px; font-weight:900; color:#FF6B35;">+91 98300 43884</div>
          </div>
          <div style="text-align:center; border-left:1px solid #333; border-right:1px solid #333;">
            <div style="font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Puja</div>
            <div style="font-size:15px; font-weight:900; color:#FF6B35;">+91 98318 91991</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Rittika</div>
            <div style="font-size:15px; font-weight:900; color:#FF6B35;">+91 98308 85531</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Summary -->
    <div class="section">
      <div class="section-title">💰 Payment Summary</div>
      <table class="price-table">
        <tr class="subtotal-row">
          <td class="label">Base Price (${data.numberOfNights} nights × rate)</td>
          <td class="amount">₹${data.basePrice}</td>
        </tr>
        <tr class="subtotal-row">
          <td class="label">Additional Services</td>
          <td class="amount">₹${data.extraCharges}</td>
        </tr>
        <tr class="subtotal-row">
          <td class="label">Discount</td>
          <td class="amount" style="color:#27ae60;">− ₹${data.discount}</td>
        </tr>
        <tr class="subtotal-row">
          <td class="label">GST (${data.taxPercentage}%)</td>
          <td class="amount">₹${data.tax}</td>
        </tr>
        <tr class="total-row">
          <td class="label">Total Amount</td>
          <td class="amount">₹${data.totalAmount}</td>
        </tr>
        <tr class="paid-row">
          <td class="label">Amount Paid</td>
          <td class="amount">₹${data.amountPaid}</td>
        </tr>
        <tr class="balance-row">
          <td class="label">Balance Due (at check-in)</td>
          <td class="amount">₹${data.balanceDue}</td>
        </tr>
      </table>
      <div style="background:#fff8f0;border:1px solid #ffddb3;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:12px;color:#7a4000;line-height:1.7;">
        💰 <strong>Security Deposit — ₹20,000/-</strong> to be paid to the Caretaker at check-in. Fully refundable at check-out, subject to no damage.
      </div>
    </div>

    <div class="divider"></div>

    <!-- ═══ GOA ESSENTIALS ══════════════════════════════════════ -->
    <div class="goa-essentials">
      <div class="essentials-title">🌴 Your Goa Essentials</div>
      <div class="essentials-subtitle">Handpicked contacts by TBK Villas — for a seamless Goa experience</div>

      <!-- Taxi note -->
      <div class="taxi-note">
        ⚠️ <span><strong>Taxi &amp; Car Rental:</strong> Due to the Goa Taxi Union, we strongly recommend renting a car through your villa caretaker. They will arrange the best local rate from villa-specific trusted vendors.</span>
      </div>

      <!-- Static essentials grid -->
      <div class="essentials-grid">

        <div class="essential-card">
          <div class="essential-icon">🛥️</div>
          <div class="essential-info">
            <div class="essential-name">Yacht Charter</div>
            <div class="essential-phone">+91 70690 42290</div>
            <div class="essential-note">Private yacht bookings in Goa</div>
          </div>
        </div>

        <div class="essential-card">
          <div class="essential-icon">💆</div>
          <div class="essential-info">
            <div class="essential-name">Spa At Home</div>
            <div class="essential-phone">+91 98817 42468</div>
            <div class="essential-note">In-villa spa &amp; wellness sessions</div>
          </div>
        </div>

        <div class="essential-card">
          <div class="essential-icon">🚗</div>
          <div class="essential-info">
            <div class="essential-name">Lulu Taxi Service</div>
            <div class="essential-phone">+91 98507 76442</div>
            <div class="essential-note">Trusted local driver &amp; transfers</div>
          </div>
        </div>

        <div class="essential-card">
          <div class="essential-icon">🎸</div>
          <div class="essential-info">
            <div class="essential-name">Private Musician</div>
            <div class="essential-phone">+91 70830 44452</div>
            <div class="essential-note">Live music for events &amp; parties</div>
          </div>
        </div>

        <div class="essential-card">
          <div class="essential-icon">🎉</div>
          <div class="essential-info">
            <div class="essential-name">Decorator</div>
            <div class="essential-phone">+91 95455 82925</div>
            <div class="essential-note">Birthdays, anniversaries &amp; events</div>
          </div>
        </div>

        <div class="essential-card">
          <div class="essential-icon">🍸</div>
          <div class="essential-info">
            <div class="essential-name">Villa 259</div>
            <div class="essential-phone">+91 99995 55565</div>
            <div class="essential-note">🍺 Craft Beer Dispensing Machine</div>
            <div class="essential-note">🍸 Private Bartender Service</div>
            <div class="essential-note">🎉 Party Catering Services</div>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══ EATS & DRINKS ══════════════════════════════════════ -->
    <div class="food-section">

      <!-- DRINKS -->
      <div class="food-col">
        <div class="food-col-header drinks-header">
          <div class="fch-icon">🍹</div>
          <div>
            <div class="fch-title">Drinks</div>
            <div class="fch-sub">TBK Recommended Bars</div>
          </div>
        </div>
        <ul class="food-list drinks-list">
          <li>C'est La Vie</li>
          <li>Cajy Bar</li>
          <li>Feli Tavern</li>
          <li>Slow Tide</li>
          <li>Aguiar Bar</li>
          <li>Room One</li>
          <li>Izumi</li>
          <li>Bar Outrigger</li>
          <li>Peter's Tavern</li>
          <li>MTW</li>
          <li>Boiler Maker</li>
        </ul>
      </div>

      <!-- EATS -->
      <div class="food-col">
        <div class="food-col-header eats-header">
          <div class="fch-icon">🍴</div>
          <div>
            <div class="fch-title">Eats</div>
            <div class="fch-sub">TBK Recommended Restaurants</div>
          </div>
        </div>
        <ul class="food-list eats-list">
          <li>Horseshoe</li>
          <li>Petisco</li>
          <li>Ramesh</li>
          <li>Praça Prazeres</li>
          <li>Sai</li>
          <li>Seamen's Nest</li>
          <li>Mafia Cocktail</li>
          <li>Bomras</li>
          <li>Thai N Wok</li>
          <li>Babazin</li>
          <li>Mister Merchant</li>
        </ul>
      </div>

    </div>

    <!-- ═══ CAFES & SHOPPING ══════════════════════════════════ -->
    <div class="food-section">

      <!-- CAFES -->
      <div class="food-col">
        <div class="food-col-header" style="background:#2d1a0e;">
          <div class="fch-icon">☕</div>
          <div>
            <div class="fch-title">Cafes</div>
            <div class="fch-sub">TBK Recommended Cafes</div>
          </div>
        </div>
        <ul class="food-list eats-list">
          <li>Babka</li>
          <li>G-Shot Cafe</li>
          <li>Nada</li>
          <li>Larder &amp; Fork Goa</li>
          <li>Padaria Prazeres</li>
        </ul>
      </div>

      <!-- SHOPPING -->
      <div class="food-col">
        <div class="food-col-header" style="background:#1a2d1a;">
          <div class="fch-icon">🛍️</div>
          <div>
            <div class="fch-title">Shopping</div>
            <div class="fch-sub">TBK Recommended Stores</div>
          </div>
        </div>
        <ul class="food-list drinks-list">
          <li>Flames</li>
          <li>La Boa</li>
          <li>Rangeela</li>
          <li>Whim</li>
          <li>No Nasties</li>
          <li>Berdino &amp; Studio Veranda</li>
          <li>Shivan &amp; Narresh</li>
          <li>Goa Collective — Friday Night Bazaar</li>
        </ul>
      </div>

    </div>

    <!-- ═══ GUEST INFO & STAY POLICIES ══════════════════════════ -->
    <div class="policy-wrapper">

      <div class="policy-header">
        <span class="policy-header-icon">📋</span>
        <div>
          <div class="policy-header-title">Guest Information &amp; Stay Policies</div>
          <div class="policy-header-sub">Please read carefully before check-in</div>
        </div>
      </div>

      <!-- Cancellation -->
      <div class="policy-block">
        <div class="policy-block-title">❌ Cancellation Policy</div>
        <div class="policy-rule-card green-card">
          <div class="prc-badge green-badge">1</div>
          <div>
            <div class="prc-title">Free Cancellation</div>
            <div class="prc-text">Full refund if cancelled <strong>30 days or more</strong> before check-in date.</div>
          </div>
        </div>
        <div class="policy-rule-card orange-card">
          <div class="prc-badge orange-badge">2</div>
          <div>
            <div class="prc-title">Cancellation Within 30 Days</div>
            <div class="prc-text">TBK Villas will make reasonable efforts to rebook the villa for the same dates.</div>
          </div>
        </div>
        <div class="policy-rule-card red-card">
          <div class="prc-badge red-badge">3</div>
          <div>
            <div class="prc-title">Refund Eligibility (If Rebooked)</div>
            <div class="prc-text">
              • Refund limited to the amount recovered from the new booking.<br>
              • Rate difference between original and rebooked rate is borne by guest.<br>
              • If villa is <strong>not rebooked</strong>, no refund is applicable.
            </div>
          </div>
        </div>
        <div class="policy-example">
          <div class="pe-label">📌 Illustrative Example</div>
          <div class="pe-text">Guest books 3 nights @ ₹100/night. Villa rebooked @ ₹80/night.<br>
            <strong>Refund: ₹240</strong> (₹80 × 3 nights) &nbsp;|&nbsp; <strong>Forfeited: ₹60</strong>
          </div>
        </div>
      </div>

      <!-- Inclusions -->
      <div class="policy-block">
        <div class="policy-block-title">✅ Inclusions &amp; Amenities</div>
        <div class="amenities-grid">
          <div class="amenity-item">📶 High-speed Wi-Fi</div>
          <div class="amenity-item">⚡ 100% Power Backup</div>
          <div class="amenity-item">🏊 Private Swimming Pool</div>
          <div class="amenity-item">👨‍💼 Full-time Caretaker</div>
          <div class="amenity-item">🧹 Daily Housekeeping</div>
          <div class="amenity-item">🛏️ Linen Change (every 3 days)</div>
          <div class="amenity-item">🛁 Daily Towel Change</div>
          <div class="amenity-item">❄️ AC in All Rooms &amp; Living</div>
          <div class="amenity-item">🍳 Fully Equipped Kitchen</div>
          <div class="amenity-item">🔊 Music Speakers</div>
          <div class="amenity-item">👔 Iron &amp; Hair Dryer</div>
        </div>
        <div class="optional-note">
          ⚙️ <strong>Optional (Chargeable):</strong> Cook services available on request — Groceries charged at actual cost.
        </div>
      </div>

      <!-- House Rules -->
      <div class="policy-block">
        <div class="policy-block-title">🏠 House Rules</div>
        <div class="rules-group">
          <div class="rules-group-label">🚬 Smoking &amp; Substance Policy</div>
          <div class="rule-item">• Smoking is <strong>strictly prohibited</strong> inside the villa premises.</div>
          <div class="rule-item">• Smoking permitted only in designated outdoor areas.</div>
          <div class="rule-item">• Hookah permitted in <strong>outdoor areas only</strong>.</div>
          <div class="rule-item">• Possession or consumption of drugs or illegal substances is <strong>strictly prohibited</strong>.</div>
        </div>
        <div class="rules-group">
          <div class="rules-group-label">🚪 Guest Access &amp; Visitors</div>
          <div class="rule-item">• Entry restricted to guests whose details were provided at the time of booking.</div>
          <div class="rule-item">• Visitors or unregistered guests are <strong>not permitted</strong> at any time, without exception.</div>
        </div>
        <div class="rules-group">
          <div class="rules-group-label">🎉 Noise, Parties &amp; Events</div>
          <div class="rule-item">• Loud music or noise in outdoor areas is <strong>strictly prohibited after 10:00 PM</strong>.</div>
          <div class="rule-item">• Parties or events require <strong>prior written approval</strong> from TBK Villas management.</div>
        </div>
        <div class="rules-group">
          <div class="rules-group-label">👥 Extra Person Charge</div>
          <div class="rule-item">• ₹2,000/- per extra person per night. <strong>Conditions apply.</strong></div>
        </div>
      </div>

      <!-- Cooking Charges -->
      <div class="policy-block">
        <div class="policy-block-title">👨‍🍳 Caretaker Cooking Charges</div>
        <div class="cooking-note">Groceries to be arranged &amp; paid for separately by the guest.</div>
        <div class="cooking-table-wrapper">
          <table class="cooking-table">
            <thead>
              <tr>
                <th>Meal</th>
                <th>Up to 6 Guests</th>
                <th>Up to 8 Guests</th>
                <th>Up to 12 Guests</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>🌅 Breakfast</td><td>₹500</td><td>₹600</td><td>₹1,000</td></tr>
              <tr><td>☀️ Lunch</td><td>₹600</td><td>₹700</td><td>₹1,500</td></tr>
              <tr><td>🌙 Dinner</td><td>₹600</td><td>₹700</td><td>₹1,500</td></tr>
            </tbody>
          </table>
        </div>
        <div class="cooking-footer-note">Please inform your caretaker in advance to ensure availability and smooth service.</div>
      </div>

    </div>

    <!-- General Terms -->
    <div class="terms">
      <strong>General:</strong>&nbsp;
      Check-in: 3:00 PM &nbsp;|&nbsp; Check-out: 11:00 AM &nbsp;|&nbsp;
      Valid govt. ID required for all guests &nbsp;|&nbsp;
      Pets applicable only at Pet-Friendly Villas — ₹5,000 (Conditions Apply) &nbsp;|&nbsp;
      Property damage billed separately &nbsp;|&nbsp;
      This voucher is system-generated and valid without signature.
    </div>

  </div><!-- /content -->

  <!-- ═══ FOOTER ══════════════════════════════════════════════ -->
  <div class="footer">
    <div class="footer-inner">
      <div class="footer-logo">
        <img src="data:image/png;base64,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груван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" style="display:block; height:48px; object-fit:contain; opacity:0.9;" alt="TBK Villas"/>
      </div>
      <div class="footer-contact">
        📧 info@tbkvillas.com<br>
        📞 +91 98300 43884<br>
        🌐 <a href="https://www.tbkvillas.com">www.tbkvillas.com</a>
      </div>
      <div class="footer-tagline">
        "Experience Goa,<br>the TBK way."<br>
        <span style="color:#555;">— Your home away from home</span>
      </div>
    </div>
    <div class="footer-copy">
      © 2025 TBK Villas. All rights reserved.
    </div>
  </div>

</div>
</body>
</html>`;
}
