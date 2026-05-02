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
      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjIwNSIgdmlld0JveD0iMCAwIDE0MCAyMDUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMTcuMTc4IDE1Ni40TDEwMi45NzUgMTIwLjUyTDEwMi41NzMgMTE5LjUxMUw3NC44NjA3IDQ5LjUzNjNMODAuMjgxMyAzNS45NDQyTDExMy4zODEgMTE5LjUyNEwxMTMuNzgzIDEyMC41MzNMMTI3Ljk4NiAxNTYuNDEzTDExNy4xNzggMTU2LjRaTTc2LjIzMzQgMTU2LjM1MUw2MS40MTIzIDE1Ni4zMzNMNjEuNDU1OCAxMjAuNDdMNzYuMjc2OSAxMjAuNDg4TDc2LjIzMzQgMTU2LjM1MVpNMTI5LjcgMTU2LjQxNUwxMTUuNDk3IDEyMC41MzVMMTE1LjA5NSAxMTkuNTI2TDgxLjE1MSAzMy43OTY1TDQ5Ljg1MDggMTEyLjI3NEw3NC4wMjEyIDUxLjY3NEwxMDAuODc5IDExOS41MDlMMTAxLjI4MSAxMjAuNTE4TDExNS40OTQgMTU2LjM5OEw3Ny40MjMyIDE1Ni4zNTJMNzcuNDY3OSAxMTkuNDhMNTcuNzQ2NyAxMTkuNDU2TDU3LjcwMiAxNTYuMzI4TDMyLjMwNDQgMTU2LjI5N0wzMS44MDg5IDE1Ny41NThMMTMwLjIxMyAxNTcuNjc3TDEyOS43MSAxNTYuNDE1TDEyOS43IDE1Ni40MTVaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNjIuMzU2NiAxNy45NTU1TDY3Ljc3NzIgNC4zNjMzMUw3My4wODQ1IDE3Ljc1NjZMNjcuNjYzOSAzMS4zNDg4TDYyLjM4NjggMTguMDE2TDYyLjM2NjcgMTcuOTU1NUw2Mi4zNTY2IDE3Ljk1NTVaTTY3Ljc5MjUgMC4wNzU4OTUzTDY2LjkzMjkgMi4yMTM1M0w2MS41MTIzIDE1LjgwNTdMNjAuNjYyOCAxNy45NDMzTDIwLjIgMTE5LjQwMUwxOS43OTU1IDEyMC40MDlMNS41MDU2IDE1Ni4yNTVMNC45OTk5NyAxNTcuNTA1TDYuNzU0MyAxNTcuNTA3TDcuMjQ5ODYgMTU2LjI1N0w3LjE5OTQ1IDE1Ni4yNTdMMjEuNDg5NCAxMjAuNDExTDIxLjUzOTggMTIwLjQxMUwyMS45NDQzIDExOS40MDNMMjEuODkzOSAxMTkuNDAzTDYxLjUwNzEgMjAuMTAzMkw2MS41MjcyIDIwLjE2MzhMNjYuODA0MyAzMy40OTY1TDMyLjUzMDggMTE5LjQzNkwzMi4xMjYzIDEyMC40NDRMMTcuODI2MyAxNTYuMjlMNy4yMzk3NSAxNTYuMjc3TDYuNzQ0MiAxNTcuNTI3TDE5LjA0NDcgMTU3LjU0MkwxOS41NTA0IDE1Ni4yOTJMMzMuODUwMyAxMjAuNDQ2TDM0LjI1NDkgMTE5LjQzOEw2Ny42Njg3IDM1LjY0NjNMNjguNTE4MyAzMy41MDg3TDczLjkzODkgMTkuOTA2NEw3NC43OTg1IDE3Ljc2ODhMNzMuOTQ0MSAxNS42MTlMNjguNjM2OCAyLjIyNTY4TDY3Ljc5MjUgMC4wNzU4OTUzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQ0Ljg4MDcgMTIwLjQ2TDMwLjU5MDkgMTU2LjI5NUwxOS41NTA2IDE1Ni4yODJMMTkuMDU1MSAxNTcuNTQyTDMxLjc4OTEgMTU3LjU1OEwzMi4yOTQ4IDE1Ni4yOTdMMzIuMjg0NyAxNTYuMjk3TDQwLjE3MjkgMTM2LjU0NEw0Ni45ODkyIDExOS40NDNMNDkuODQxMSAxMTIuMjg0TDgxLjE0MTMgMzMuNzk2NEw4MC4yOTcgMzEuNjU2N0w3NC43ODg3IDE3Ljc1ODhMNzMuOTM5MiAxOS45MDY1TDc5LjQzNzQgMzMuODA0NUw3NC4wMTY4IDQ3LjM5NjZMNjguNTE4NSAzMy40OTg3TDY3LjY1ODkgMzUuNjM2M0w3My4xNjcyIDQ5LjUzNDNMNDUuMjg1MyAxMTkuNDQxIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQuMDA4IDE3OC43MDJIOC41VjE5OUg1Ljk4NFYxNzguNzAySDAuNDc2VjE3Ni4zMjJIMTQuMDA4VjE3OC43MDJaTTE3LjQwMDYgMTc2LjMyMkgyMS40ODA2QzIzLjc0NzIgMTc2LjMyMiAyNS40ODEyIDE3Ni43OTggMjYuNjgyNiAxNzcuNzVDMjguMDQyNiAxNzguNzkzIDI4LjcyMjYgMTgwLjM1NyAyOC43MjI2IDE4Mi40NDJDMjguNzIyNiAxODQuMzkxIDI3Ljk3NDYgMTg1Ljg3NiAyNi40Nzg2IDE4Ni44OTZDMjcuOTI5MiAxODcuMjU5IDI5LjAwNTkgMTg3Ljk5NSAyOS43MDg2IDE4OS4xMDZDMzAuNDMzOSAxOTAuMTk0IDMwLjc5NjYgMTkxLjM2MSAzMC43OTY2IDE5Mi42MDhDMzAuNzk2NiAxOTMuNjI4IDMwLjU2OTkgMTk0LjU2OSAzMC4xMTY2IDE5NS40M0MyOS42ODU5IDE5Ni4yOTEgMjkuMTQxOSAxOTYuOTgzIDI4LjQ4NDYgMTk3LjUwNEMyNy4yMTUyIDE5OC41MDEgMjUuNDAxOSAxOTkgMjMuMDQ0NiAxOTlIMTcuNDAwNlYxNzYuMzIyWk0xOS45MTY2IDE3OC43MDJWMTg2LjI4NEgyMS44MjA2QzIyLjE2MDYgMTg2LjI4NCAyMi40ODkyIDE4Ni4yNzMgMjIuODA2NiAxODYuMjVDMjMuMTIzOSAxODYuMjA1IDIzLjQ5NzkgMTg2LjExNCAyMy45Mjg2IDE4NS45NzhDMjQuMzgxOSAxODUuODE5IDI0Ljc2NzIgMTg1LjYxNSAyNS4wODQ2IDE4NS4zNjZDMjUuNDI0NiAxODUuMTE3IDI1LjcwNzkgMTg0Ljc0MyAyNS45MzQ2IDE4NC4yNDRDMjYuMTYxMiAxODMuNzQ1IDI2LjI3NDYgMTgzLjE2NyAyNi4yNzQ2IDE4Mi41MUMyNi4yNzQ2IDE4MS44MDcgMjYuMTM4NiAxODEuMjA3IDI1Ljg2NjYgMTgwLjcwOEMyNS41OTQ2IDE4MC4xODcgMjUuMjg4NiAxNzkuODAxIDI0Ljk0ODYgMTc5LjU1MkMyNC42MDg2IDE3OS4zMDMgMjQuMjAwNiAxNzkuMTEgMjMuNzI0NiAxNzguOTc0QzIzLjI0ODYgMTc4LjgzOCAyMi44ODU5IDE3OC43NTkgMjIuNjM2NiAxNzguNzM2QzIyLjM4NzIgMTc4LjcxMyAyMi4xMzc5IDE3OC43MDIgMjEuODg4NiAxNzguNzAySDE5LjkxNjZaTTE5LjkxNjYgMTg4LjUyOFYxOTYuNjJIMjIuODA2NkMyNC42NDI2IDE5Ni42MiAyNS45Njg2IDE5Ni4zMDMgMjYuNzg0NiAxOTUuNjY4QzI3Ljc4MTkgMTk0Ljk0MyAyOC4yODA2IDE5My45IDI4LjI4MDYgMTkyLjU0QzI4LjI4MDYgMTkxLjAyMSAyNy42MzQ2IDE4OS45MTEgMjYuMzQyNiAxODkuMjA4QzI1LjUyNjYgMTg4Ljc1NSAyNC4yNDU5IDE4OC41MjggMjIuNTAwNiAxODguNTI4SDE5LjkxNjZaTTM3Ljk0NTkgMTc2LjMyMlYxODYuMDQ2TDQ3LjYwMTkgMTc2LjMyMkg1MS4wMDE5TDQwLjM5MzkgMTg2Ljg5Nkw1MS4zNDE5IDE5OUg0Ny44NzM5TDM4LjU5MTkgMTg4LjU5NkwzNy45NDU5IDE4OS4yNDJWMTk5SDM1LjQyOTlWMTc2LjMyMkgzNy45NDU5Wk02MC4wMzc2IDE3Ni4zMjJINjIuODI1Nkw2OS4yMTc2IDE5My42MjhMNzUuNjA5NiAxNzYuMzIySDc4LjM5NzZMNjkuMjE3NiAyMDAuMzZMNjAuMDM3NiAxNzYuMzIyWk04MC45NzAyIDE4NC44OUg4My40MTgyVjE5OUg4MC45NzAyVjE4NC44OVpNODAuOTcwMiAxODAuNzc2QzgwLjYzMDIgMTgwLjQzNiA4MC40NjAyIDE4MC4wMjggODAuNDYwMiAxNzkuNTUyQzgwLjQ2MDIgMTc5LjA3NiA4MC42MzAyIDE3OC42NjggODAuOTcwMiAxNzguMzI4QzgxLjMxMDIgMTc3Ljk4OCA4MS43MTgyIDE3Ny44MTggODIuMTk0MiAxNzcuODE4QzgyLjY3MDIgMTc3LjgxOCA4My4wNzgyIDE3Ny45ODggODMuNDE4MiAxNzguMzI4QzgzLjc1ODIgMTc4LjY2OCA4My45MjgyIDE3OS4wNzYgODMuOTI4MiAxNzkuNTUyQzgzLjkyODIgMTgwLjAyOCA4My43NTgyIDE4MC40MzYgODMuNDE4MiAxODAuNzc2QzgzLjA3ODIgMTgxLjExNiA4Mi42NzAyIDE4MS4yODYgODIuMTk0MiAxODEuMjg2QzgxLjcxODIgMTgxLjI4NiA4MS4zMTAyIDE4MS4xMTYgODAuOTcwMiAxODAuNzc2Wk04OC4wNDI1IDE3NC4yMTRIOTAuNDkwNVYxOTlIODguMDQyNVYxNzQuMjE0Wk05NS4xMTQ3IDE3NC4yMTRIOTcuNTYyN1YxOTlIOTUuMTE0N1YxNzQuMjE0Wk0xMTIuOTk5IDE4Ni44OTZWMTg0Ljg5SDExNS40NDdWMTk5SDExMi45OTlWMTk3LjAyOEMxMTEuNzc1IDE5OC42MTUgMTEwLjE2NiAxOTkuNDA4IDEwOC4xNzEgMTk5LjQwOEMxMDYuMjY3IDE5OS40MDggMTA0LjY0NiAxOTguNzUxIDEwMy4zMDkgMTk3LjQzNkMxMDEuOTcyIDE5Ni4xMjEgMTAxLjMwMyAxOTQuMjg1IDEwMS4zMDMgMTkxLjkyOEMxMDEuMzAzIDE4OS42MTYgMTAxLjk2IDE4Ny44MTQgMTAzLjI3NSAxODYuNTIyQzEwNC42MTIgMTg1LjIwNyAxMDYuMjQ0IDE4NC41NSAxMDguMTcxIDE4NC41NUMxMTAuMjExIDE4NC41NSAxMTEuODIgMTg1LjMzMiAxMTIuOTk5IDE4Ni44OTZaTTEwOC40NDMgMTg2LjcyNkMxMDcuMTUxIDE4Ni43MjYgMTA2LjA1MiAxODcuMTkxIDEwNS4xNDUgMTg4LjEyQzEwNC4yNjEgMTg5LjAyNyAxMDMuODE5IDE5MC4yOTYgMTAzLjgxOSAxOTEuOTI4QzEwMy44MTkgMTkzLjQ5MiAxMDQuMjI3IDE5NC43NzMgMTA1LjA0MyAxOTUuNzdDMTA1Ljg4MiAxOTYuNzQ1IDEwNy4wMTUgMTk3LjIzMiAxMDguNDQzIDE5Ny4yMzJDMTA5Ljg3MSAxOTcuMjMyIDExMS4wMDQgMTk2LjcyMiAxMTEuODQzIDE5NS43MDJDMTEyLjcwNCAxOTQuNjgyIDExMy4xMzUgMTkzLjQzNSAxMTMuMTM1IDE5MS45NjJDMTEzLjEzNSAxOTAuMjg1IDExMi42NTkgMTg4Ljk5MyAxMTEuNzA3IDE4OC4wODZDMTEwLjc1NSAxODcuMTc5IDEwOS42NjcgMTg2LjcyNiAxMDguNDQzIDE4Ni43MjZaTTEyNy45MDMgMTg3LjFMMTI1Ljg5NyAxODguMTU0QzEyNS41MTIgMTg3LjIwMiAxMjQuODU1IDE4Ni43MjYgMTIzLjkyNSAxODYuNzI2QzEyMy40NDkgMTg2LjcyNiAxMjMuMDQxIDE4Ni44NjIgMTIyLjcwMSAxODcuMTM0QzEyMi4zODQgMTg3LjQwNiAxMjIuMjI1IDE4Ny44MDMgMTIyLjIyNSAxODguMzI0QzEyMi4yMjUgMTg4LjggMTIyLjM3MyAxODkuMTYzIDEyMi42NjcgMTg5LjQxMkMxMjIuOTg1IDE4OS42MzkgMTIzLjU5NyAxODkuOTQ1IDEyNC41MDMgMTkwLjMzQzEyNi4yOTQgMTkxLjA3OCAxMjcuNDczIDE5MS44MDMgMTI4LjAzOSAxOTIuNTA2QzEyOC41MzggMTkzLjExOCAxMjguNzg3IDE5My44NzcgMTI4Ljc4NyAxOTQuNzg0QzEyOC43ODcgMTk2LjIxMiAxMjguMzIzIDE5Ny4zNDUgMTI3LjM5MyAxOTguMTg0QzEyNi40ODcgMTk5IDEyNS4zMzEgMTk5LjQwOCAxMjMuOTI1IDE5OS40MDhDMTIzLjY1MyAxOTkuNDA4IDEyMy4zNTkgMTk5LjM3NCAxMjMuMDQxIDE5OS4zMDZDMTIyLjcyNCAxOTkuMjYxIDEyMi4yODIgMTk5LjE0NyAxMjEuNzE1IDE5OC45NjZDMTIxLjE3MSAxOTguNzYyIDEyMC42NSAxOTguMzg4IDEyMC4xNTEgMTk3Ljg0NEMxMTkuNjUzIDE5Ny4zIDExOS4yNjcgMTk2LjYyIDExOC45OTUgMTk1LjgwNEwxMjEuMTAzIDE5NC45MkMxMjEuNjcgMTk2LjQ2MSAxMjIuNjIyIDE5Ny4yMzIgMTIzLjk1OSAxOTcuMjMyQzEyNC43MDcgMTk3LjIzMiAxMjUuMjc0IDE5Ny4wMDUgMTI1LjY1OSAxOTYuNTUyQzEyNi4wNjcgMTk2LjA5OSAxMjYuMjcxIDE5NS41NzcgMTI2LjI3MSAxOTQuOTg4QzEyNi4yNzEgMTk0LjY3MSAxMjYuMjE1IDE5NC4zOTkgMTI2LjEwMSAxOTQuMTcyQzEyNi4wMTEgMTkzLjkyMyAxMjUuODQxIDE5My43MDcgMTI1LjU5MSAxOTMuNTI2QzEyNS4zNjUgMTkzLjM0NSAxMjUuMTM4IDE5My4xOTcgMTI0LjkxMSAxOTMuMDg0QzEyNC43MDcgMTkyLjk3MSAxMjQuNDAxIDE5Mi44MjMgMTIzLjk5MyAxOTIuNjQyQzEyMi4xOCAxOTEuODQ5IDEyMS4wMzUgMTkxLjE1NyAxMjAuNTU5IDE5MC41NjhDMTIwLjEyOSAxOTAuMDI0IDExOS45MTMgMTg5LjMzMyAxMTkuOTEzIDE4OC40OTRDMTE5LjkxMyAxODcuMjcgMTIwLjI4NyAxODYuMzA3IDEyMS4wMzUgMTg1LjYwNEMxMjEuODA2IDE4NC45MDEgMTIyLjgwMyAxODQuNTUgMTI0LjAyNyAxODQuNTVDMTI1LjgxOCAxODQuNTUgMTI3LjExIDE4NS40IDEyNy45MDMgMTg3LjFaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxMzQiIGN5PSIxNzciIHI9IjUuNSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTMyLjM1MSAxNzMuNjM0SDEzMy40MTVDMTM0LjEzMiAxNzMuNjM0IDEzNC42NjkgMTczLjc1NyAxMzUuMDI3IDE3NC4wMDJDMTM1LjUxMiAxNzQuMzI3IDEzNS43NTQgMTc0LjgxOCAxMzUuNzU0IDE3NS40NzVDMTM1Ljc1NCAxNzUuOTg2IDEzNS41OTggMTc2LjQxIDEzNS4yODYgMTc2Ljc0OUMxMzQuOTgxIDE3Ny4wODcgMTM0LjU4IDE3Ny4yNzMgMTM0LjA4MiAxNzcuMzA2TDEzNi4xOTIgMTgwLjI3MUgxMzUuMjk2TDEzMy4yNzYgMTc3LjM2NUgxMzMuMDg3VjE4MC4yNzFIMTMyLjM1MVYxNzMuNjM0Wk0xMzMuMDg3IDE3NC4zM1YxNzYuNzA5SDEzMy41NTVDMTM0LjAxMiAxNzYuNzA5IDEzNC4zNzEgMTc2LjYwMyAxMzQuNjI5IDE3Ni4zOUMxMzQuODg4IDE3Ni4xNzggMTM1LjAxOCAxNzUuODc5IDEzNS4wMTggMTc1LjQ5NUMxMzUuMDE4IDE3NS4wNDQgMTM0Ljg0MiAxNzQuNzE4IDEzNC40OSAxNzQuNTE5QzEzNC4yNjUgMTc0LjM5MyAxMzMuOTQ2IDE3NC4zMyAxMzMuNTM1IDE3NC4zM0gxMzMuMDg3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" style="display:block; height:64px; object-fit:contain;" alt="TBK Villas"/>
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
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjIwNSIgdmlld0JveD0iMCAwIDE0MCAyMDUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMTcuMTc4IDE1Ni40TDEwMi45NzUgMTIwLjUyTDEwMi41NzMgMTE5LjUxMUw3NC44NjA3IDQ5LjUzNjNMODAuMjgxMyAzNS45NDQyTDExMy4zODEgMTE5LjUyNEwxMTMuNzgzIDEyMC41MzNMMTI3Ljk4NiAxNTYuNDEzTDExNy4xNzggMTU2LjRaTTc2LjIzMzQgMTU2LjM1MUw2MS40MTIzIDE1Ni4zMzNMNjEuNDU1OCAxMjAuNDdMNzYuMjc2OSAxMjAuNDg4TDc2LjIzMzQgMTU2LjM1MVpNMTI5LjcgMTU2LjQxNUwxMTUuNDk3IDEyMC41MzVMMTE1LjA5NSAxMTkuNTI2TDgxLjE1MSAzMy43OTY1TDQ5Ljg1MDggMTEyLjI3NEw3NC4wMjEyIDUxLjY3NEwxMDAuODc5IDExOS41MDlMMTAxLjI4MSAxMjAuNTE4TDExNS40OTQgMTU2LjM5OEw3Ny40MjMyIDE1Ni4zNTJMNzcuNDY3OSAxMTkuNDhMNTcuNzQ2NyAxMTkuNDU2TDU3LjcwMiAxNTYuMzI4TDMyLjMwNDQgMTU2LjI5N0wzMS44MDg5IDE1Ny41NThMMTMwLjIxMyAxNTcuNjc3TDEyOS43MSAxNTYuNDE1TDEyOS43IDE1Ni40MTVaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNjIuMzU2NiAxNy45NTU1TDY3Ljc3NzIgNC4zNjMzMUw3My4wODQ1IDE3Ljc1NjZMNjcuNjYzOSAzMS4zNDg4TDYyLjM4NjggMTguMDE2TDYyLjM2NjcgMTcuOTU1NUw2Mi4zNTY2IDE3Ljk1NTVaTTY3Ljc5MjUgMC4wNzU4OTUzTDY2LjkzMjkgMi4yMTM1M0w2MS41MTIzIDE1LjgwNTdMNjAuNjYyOCAxNy45NDMzTDIwLjIgMTE5LjQwMUwxOS43OTU1IDEyMC40MDlMNS41MDU2IDE1Ni4yNTVMNC45OTk5NyAxNTcuNTA1TDYuNzU0MyAxNTcuNTA3TDcuMjQ5ODYgMTU2LjI1N0w3LjE5OTQ1IDE1Ni4yNTdMMjEuNDg5NCAxMjAuNDExTDIxLjUzOTggMTIwLjQxMUwyMS45NDQzIDExOS40MDNMMjEuODkzOSAxMTkuNDAzTDYxLjUwNzEgMjAuMTAzMkw2MS41MjcyIDIwLjE2MzhMNjYuODA0MyAzMy40OTY1TDMyLjUzMDggMTE5LjQzNkwzMi4xMjYzIDEyMC40NDRMMTcuODI2MyAxNTYuMjlMNy4yMzk3NSAxNTYuMjc3TDYuNzQ0MiAxNTcuNTI3TDE5LjA0NDcgMTU3LjU0MkwxOS41NTA0IDE1Ni4yOTJMMzMuODUwMyAxMjAuNDQ2TDM0LjI1NDkgMTE5LjQzOEw2Ny42Njg3IDM1LjY0NjNMNjguNTE4MyAzMy41MDg3TDczLjkzODkgMTkuOTA2NEw3NC43OTg1IDE3Ljc2ODhMNzMuOTQ0MSAxNS42MTlMNjguNjM2OCAyLjIyNTY4TDY3Ljc5MjUgMC4wNzU4OTUzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQ0Ljg4MDcgMTIwLjQ2TDMwLjU5MDkgMTU2LjI5NUwxOS41NTA2IDE1Ni4yODJMMTkuMDU1MSAxNTcuNTQyTDMxLjc4OTEgMTU3LjU1OEwzMi4yOTQ4IDE1Ni4yOTdMMzIuMjg0NyAxNTYuMjk3TDQwLjE3MjkgMTM2LjU0NEw0Ni45ODkyIDExOS40NDNMNDkuODQxMSAxMTIuMjg0TDgxLjE0MTMgMzMuNzk2NEw4MC4yOTcgMzEuNjU2N0w3NC43ODg3IDE3Ljc1ODhMNzMuOTM5MiAxOS45MDY1TDc5LjQzNzQgMzMuODA0NUw3NC4wMTY4IDQ3LjM5NjZMNjguNTE4NSAzMy40OTg3TDY3LjY1ODkgMzUuNjM2M0w3My4xNjcyIDQ5LjUzNDNMNDUuMjg1MyAxMTkuNDQxIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQuMDA4IDE3OC43MDJIOC41VjE5OUg1Ljk4NFYxNzguNzAySDAuNDc2VjE3Ni4zMjJIMTQuMDA4VjE3OC43MDJaTTE3LjQwMDYgMTc2LjMyMkgyMS40ODA2QzIzLjc0NzIgMTc2LjMyMiAyNS40ODEyIDE3Ni43OTggMjYuNjgyNiAxNzcuNzVDMjguMDQyNiAxNzguNzkzIDI4LjcyMjYgMTgwLjM1NyAyOC43MjI2IDE4Mi40NDJDMjguNzIyNiAxODQuMzkxIDI3Ljk3NDYgMTg1Ljg3NiAyNi40Nzg2IDE4Ni44OTZDMjcuOTI5MiAxODcuMjU5IDI5LjAwNTkgMTg3Ljk5NSAyOS43MDg2IDE4OS4xMDZDMzAuNDMzOSAxOTAuMTk0IDMwLjc5NjYgMTkxLjM2MSAzMC43OTY2IDE5Mi42MDhDMzAuNzk2NiAxOTMuNjI4IDMwLjU2OTkgMTk0LjU2OSAzMC4xMTY2IDE5NS40M0MyOS42ODU5IDE5Ni4yOTEgMjkuMTQxOSAxOTYuOTgzIDI4LjQ4NDYgMTk3LjUwNEMyNy4yMTUyIDE5OC41MDEgMjUuNDAxOSAxOTkgMjMuMDQ0NiAxOTlIMTcuNDAwNlYxNzYuMzIyWk0xOS45MTY2IDE3OC43MDJWMTg2LjI4NEgyMS44MjA2QzIyLjE2MDYgMTg2LjI4NCAyMi40ODkyIDE4Ni4yNzMgMjIuODA2NiAxODYuMjVDMjMuMTIzOSAxODYuMjA1IDIzLjQ5NzkgMTg2LjExNCAyMy45Mjg2IDE4NS45NzhDMjQuMzgxOSAxODUuODE5IDI0Ljc2NzIgMTg1LjYxNSAyNS4wODQ2IDE4NS4zNjZDMjUuNDI0NiAxODUuMTE3IDI1LjcwNzkgMTg0Ljc0MyAyNS45MzQ2IDE4NC4yNDRDMjYuMTYxMiAxODMuNzQ1IDI2LjI3NDYgMTgzLjE2NyAyNi4yNzQ2IDE4Mi41MUMyNi4yNzQ2IDE4MS44MDcgMjYuMTM4NiAxODEuMjA3IDI1Ljg2NjYgMTgwLjcwOEMyNS41OTQ2IDE4MC4xODcgMjUuMjg4NiAxNzkuODAxIDI0Ljk0ODYgMTc5LjU1MkMyNC42MDg2IDE3OS4zMDMgMjQuMjAwNiAxNzkuMTEgMjMuNzI0NiAxNzguOTc0QzIzLjI0ODYgMTc4LjgzOCAyMi44ODU5IDE3OC43NTkgMjIuNjM2NiAxNzguNzM2QzIyLjM4NzIgMTc4LjcxMyAyMi4xMzc5IDE3OC43MDIgMjEuODg4NiAxNzguNzAySDE5LjkxNjZaTTE5LjkxNjYgMTg4LjUyOFYxOTYuNjJIMjIuODA2NkMyNC42NDI2IDE5Ni42MiAyNS45Njg2IDE5Ni4zMDMgMjYuNzg0NiAxOTUuNjY4QzI3Ljc4MTkgMTk0Ljk0MyAyOC4yODA2IDE5My45IDI4LjI4MDYgMTkyLjU0QzI4LjI4MDYgMTkxLjAyMSAyNy42MzQ2IDE4OS45MTEgMjYuMzQyNiAxODkuMjA4QzI1LjUyNjYgMTg4Ljc1NSAyNC4yNDU5IDE4OC41MjggMjIuNTAwNiAxODguNTI4SDE5LjkxNjZaTTM3Ljk0NTkgMTc2LjMyMlYxODYuMDQ2TDQ3LjYwMTkgMTc2LjMyMkg1MS4wMDE5TDQwLjM5MzkgMTg2Ljg5Nkw1MS4zNDE5IDE5OUg0Ny44NzM5TDM4LjU5MTkgMTg4LjU5NkwzNy45NDU5IDE4OS4yNDJWMTk5SDM1LjQyOTlWMTc2LjMyMkgzNy45NDU5Wk02MC4wMzc2IDE3Ni4zMjJINjIuODI1Nkw2OS4yMTc2IDE5My42MjhMNzUuNjA5NiAxNzYuMzIySDc4LjM5NzZMNjkuMjE3NiAyMDAuMzZMNjAuMDM3NiAxNzYuMzIyWk04MC45NzAyIDE4NC44OUg4My40MTgyVjE5OUg4MC45NzAyVjE4NC44OVpNODAuOTcwMiAxODAuNzc2QzgwLjYzMDIgMTgwLjQzNiA4MC40NjAyIDE4MC4wMjggODAuNDYwMiAxNzkuNTUyQzgwLjQ2MDIgMTc5LjA3NiA4MC42MzAyIDE3OC42NjggODAuOTcwMiAxNzguMzI4QzgxLjMxMDIgMTc3Ljk4OCA4MS43MTgyIDE3Ny44MTggODIuMTk0MiAxNzcuODE4QzgyLjY3MDIgMTc3LjgxOCA4My4wNzgyIDE3Ny45ODggODMuNDE4MiAxNzguMzI4QzgzLjc1ODIgMTc4LjY2OCA4My45MjgyIDE3OS4wNzYgODMuOTI4MiAxNzkuNTUyQzgzLjkyODIgMTgwLjAyOCA4My43NTgyIDE4MC40MzYgODMuNDE4MiAxODAuNzc2QzgzLjA3ODIgMTgxLjExNiA4Mi42NzAyIDE4MS4yODYgODIuMTk0MiAxODEuMjg2QzgxLjcxODIgMTgxLjI4NiA4MS4zMTAyIDE4MS4xMTYgODAuOTcwMiAxODAuNzc2Wk04OC4wNDI1IDE3NC4yMTRIOTAuNDkwNVYxOTlIODguMDQyNVYxNzQuMjE0Wk05NS4xMTQ3IDE3NC4yMTRIOTcuNTYyN1YxOTlIOTUuMTE0N1YxNzQuMjE0Wk0xMTIuOTk5IDE4Ni44OTZWMTg0Ljg5SDExNS40NDdWMTk5SDExMi45OTlWMTk3LjAyOEMxMTEuNzc1IDE5OC42MTUgMTEwLjE2NiAxOTkuNDA4IDEwOC4xNzEgMTk5LjQwOEMxMDYuMjY3IDE5OS40MDggMTA0LjY0NiAxOTguNzUxIDEwMy4zMDkgMTk3LjQzNkMxMDEuOTcyIDE5Ni4xMjEgMTAxLjMwMyAxOTQuMjg1IDEwMS4zMDMgMTkxLjkyOEMxMDEuMzAzIDE4OS42MTYgMTAxLjk2IDE4Ny44MTQgMTAzLjI3NSAxODYuNTIyQzEwNC42MTIgMTg1LjIwNyAxMDYuMjQ0IDE4NC41NSAxMDguMTcxIDE4NC41NUMxMTAuMjExIDE4NC41NSAxMTEuODIgMTg1LjMzMiAxMTIuOTk5IDE4Ni44OTZaTTEwOC40NDMgMTg2LjcyNkMxMDcuMTUxIDE4Ni43MjYgMTA2LjA1MiAxODcuMTkxIDEwNS4xNDUgMTg4LjEyQzEwNC4yNjEgMTg5LjAyNyAxMDMuODE5IDE5MC4yOTYgMTAzLjgxOSAxOTEuOTI4QzEwMy44MTkgMTkzLjQ5MiAxMDQuMjI3IDE5NC43NzMgMTA1LjA0MyAxOTUuNzdDMTA1Ljg4MiAxOTYuNzQ1IDEwNy4wMTUgMTk3LjIzMiAxMDguNDQzIDE5Ny4yMzJDMTA5Ljg3MSAxOTcuMjMyIDExMS4wMDQgMTk2LjcyMiAxMTEuODQzIDE5NS43MDJDMTEyLjcwNCAxOTQuNjgyIDExMy4xMzUgMTkzLjQzNSAxMTMuMTM1IDE5MS45NjJDMTEzLjEzNSAxOTAuMjg1IDExMi42NTkgMTg4Ljk5MyAxMTEuNzA3IDE4OC4wODZDMTEwLjc1NSAxODcuMTc5IDEwOS42NjcgMTg2LjcyNiAxMDguNDQzIDE4Ni43MjZaTTEyNy45MDMgMTg3LjFMMTI1Ljg5NyAxODguMTU0QzEyNS41MTIgMTg3LjIwMiAxMjQuODU1IDE4Ni43MjYgMTIzLjkyNSAxODYuNzI2QzEyMy40NDkgMTg2LjcyNiAxMjMuMDQxIDE4Ni44NjIgMTIyLjcwMSAxODcuMTM0QzEyMi4zODQgMTg3LjQwNiAxMjIuMjI1IDE4Ny44MDMgMTIyLjIyNSAxODguMzI0QzEyMi4yMjUgMTg4LjggMTIyLjM3MyAxODkuMTYzIDEyMi42NjcgMTg5LjQxMkMxMjIuOTg1IDE4OS42MzkgMTIzLjU5NyAxODkuOTQ1IDEyNC41MDMgMTkwLjMzQzEyNi4yOTQgMTkxLjA3OCAxMjcuNDczIDE5MS44MDMgMTI4LjAzOSAxOTIuNTA2QzEyOC41MzggMTkzLjExOCAxMjguNzg3IDE5My44NzcgMTI4Ljc4NyAxOTQuNzg0QzEyOC43ODcgMTk2LjIxMiAxMjguMzIzIDE5Ny4zNDUgMTI3LjM5MyAxOTguMTg0QzEyNi40ODcgMTk5IDEyNS4zMzEgMTk5LjQwOCAxMjMuOTI1IDE5OS40MDhDMTIzLjY1MyAxOTkuNDA4IDEyMy4zNTkgMTk5LjM3NCAxMjMuMDQxIDE5OS4zMDZDMTIyLjcyNCAxOTkuMjYxIDEyMi4yODIgMTk5LjE0NyAxMjEuNzE1IDE5OC45NjZDMTIxLjE3MSAxOTguNzYyIDEyMC42NSAxOTguMzg4IDEyMC4xNTEgMTk3Ljg0NEMxMTkuNjUzIDE5Ny4zIDExOS4yNjcgMTk2LjYyIDExOC45OTUgMTk1LjgwNEwxMjEuMTAzIDE5NC45MkMxMjEuNjcgMTk2LjQ2MSAxMjIuNjIyIDE5Ny4yMzIgMTIzLjk1OSAxOTcuMjMyQzEyNC43MDcgMTk3LjIzMiAxMjUuMjc0IDE5Ny4wMDUgMTI1LjY1OSAxOTYuNTUyQzEyNi4wNjcgMTk2LjA5OSAxMjYuMjcxIDE5NS41NzcgMTI2LjI3MSAxOTQuOTg4QzEyNi4yNzEgMTk0LjY3MSAxMjYuMjE1IDE5NC4zOTkgMTI2LjEwMSAxOTQuMTcyQzEyNi4wMTEgMTkzLjkyMyAxMjUuODQxIDE5My43MDcgMTI1LjU5MSAxOTMuNTI2QzEyNS4zNjUgMTkzLjM0NSAxMjUuMTM4IDE5My4xOTcgMTI0LjkxMSAxOTMuMDg0QzEyNC43MDcgMTkyLjk3MSAxMjQuNDAxIDE5Mi44MjMgMTIzLjk5MyAxOTIuNjQyQzEyMi4xOCAxOTEuODQ5IDEyMS4wMzUgMTkxLjE1NyAxMjAuNTU5IDE5MC41NjhDMTIwLjEyOSAxOTAuMDI0IDExOS45MTMgMTg5LjMzMyAxMTkuOTEzIDE4OC40OTRDMTE5LjkxMyAxODcuMjcgMTIwLjI4NyAxODYuMzA3IDEyMS4wMzUgMTg1LjYwNEMxMjEuODA2IDE4NC45MDEgMTIyLjgwMyAxODQuNTUgMTI0LjAyNyAxODQuNTVDMTI1LjgxOCAxODQuNTUgMTI3LjExIDE4NS40IDEyNy45MDMgMTg3LjFaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxMzQiIGN5PSIxNzciIHI9IjUuNSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTMyLjM1MSAxNzMuNjM0SDEzMy40MTVDMTM0LjEzMiAxNzMuNjM0IDEzNC42NjkgMTczLjc1NyAxMzUuMDI3IDE3NC4wMDJDMTM1LjUxMiAxNzQuMzI3IDEzNS43NTQgMTc0LjgxOCAxMzUuNzU0IDE3NS40NzVDMTM1Ljc1NCAxNzUuOTg2IDEzNS41OTggMTc2LjQxIDEzNS4yODYgMTc2Ljc0OUMxMzQuOTgxIDE3Ny4wODcgMTM0LjU4IDE3Ny4yNzMgMTM0LjA4MiAxNzcuMzA2TDEzNi4xOTIgMTgwLjI3MUgxMzUuMjk2TDEzMy4yNzYgMTc3LjM2NUgxMzMuMDg3VjE4MC4yNzFIMTMyLjM1MVYxNzMuNjM0Wk0xMzMuMDg3IDE3NC4zM1YxNzYuNzA5SDEzMy41NTVDMTM0LjAxMiAxNzYuNzA5IDEzNC4zNzEgMTc2LjYwMyAxMzQuNjI5IDE3Ni4zOUMxMzQuODg4IDE3Ni4xNzggMTM1LjAxOCAxNzUuODc5IDEzNS4wMTggMTc1LjQ5NUMxMzUuMDE4IDE3NS4wNDQgMTM0Ljg0MiAxNzQuNzE4IDEzNC40OSAxNzQuNTE5QzEzNC4yNjUgMTc0LjM5MyAxMzMuOTQ2IDE3NC4zMyAxMzMuNTM1IDE3NC4zM0gxMzMuMDg3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==" style="display:block; height:48px; object-fit:contain; opacity:0.9;" alt="TBK Villas"/>
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
