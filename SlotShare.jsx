import { useState } from "react";

// ── SVG Paths from Figma ──────────────────────────────────────────────────────
const svgPaths = {
  arrow: "M9.25 5.21494V6.97509L4.75 11.4751L0.25 6.9917V5.23155L4.73339 9.71494L9.25 5.21494ZM4.1024 0.25H5.3976V10.6448H4.1024V0.25Z",
  globe: "M21 0C32.598 0 42 9.40202 42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0ZM27.8994 30.4619C25.7349 30.8104 23.412 31 21 31C18.5876 31 16.2644 30.8105 14.0996 30.4619C14.4947 32.0411 14.9836 33.4776 15.5479 34.7314C17.1484 38.2881 19.1533 40 21 40C22.8467 40 24.8516 38.2881 26.4521 34.7314C27.0163 33.4776 27.5043 32.041 27.8994 30.4619ZM2.65332 25.9541C4.40717 32.4652 9.53403 37.5915 16.0449 39.3457C15.1512 38.2958 14.3726 36.995 13.7236 35.5527C13 33.9446 12.4001 32.0876 11.9482 30.0508C9.91185 29.5989 8.05507 28.9999 6.44727 28.2764C5.00456 27.6271 3.70336 26.8482 2.65332 25.9541ZM39.3457 25.9541C38.2958 26.848 36.9952 27.6273 35.5527 28.2764C33.9447 29 32.0875 29.5989 30.0508 30.0508C29.5989 32.0875 29 33.9447 28.2764 35.5527C27.6273 36.9952 26.848 38.2958 25.9541 39.3457C32.4653 37.5917 37.5917 32.4653 39.3457 25.9541ZM21 13C18.3867 13 15.9042 13.2318 13.6455 13.6455C13.2318 15.9042 13 18.3867 13 21C13 23.613 13.2319 26.0951 13.6455 28.3535C15.9043 28.7672 18.3866 29 21 29C23.613 29 26.095 28.7671 28.3535 28.3535C28.7671 26.095 29 23.613 29 21C29 18.3866 28.7672 15.9043 28.3535 13.6455C26.0951 13.2319 23.613 13 21 13ZM11.5371 14.0996C9.95825 14.4947 8.52217 14.9837 7.26855 15.5479C3.71186 17.1484 2 19.1533 2 21C2 22.8467 3.71186 24.8516 7.26855 26.4521C8.52211 27.0162 9.95834 27.5043 11.5371 27.8994C11.1886 25.7349 11 23.412 11 21C11 18.5877 11.1885 16.2644 11.5371 14.0996ZM30.4619 14.0996C30.8105 16.2644 31 18.5876 31 21C31 23.412 30.8104 25.7349 30.4619 27.8994C32.041 27.5043 33.4776 27.0163 34.7314 26.4521C38.2881 24.8516 40 22.8467 40 21C40 19.1533 38.2881 17.1484 34.7314 15.5479C33.4776 14.9836 32.0411 14.4947 30.4619 14.0996ZM16.0449 2.65332C9.53422 4.40743 4.40743 9.53422 2.65332 16.0449C3.70328 15.151 5.00478 14.3728 6.44727 13.7236C8.05512 13.0001 9.91177 12.4001 11.9482 11.9482C12.4001 9.91177 13.0001 8.05512 13.7236 6.44727C14.3728 5.00478 15.151 3.70328 16.0449 2.65332ZM25.9541 2.65332C26.8482 3.70336 27.6271 5.00456 28.2764 6.44727C28.9999 8.05507 29.5989 9.91185 30.0508 11.9482C32.0876 12.4001 33.9446 13 35.5527 13.7236C36.995 14.3726 38.2958 15.1512 39.3457 16.0449C37.5915 9.53403 32.4652 4.40717 25.9541 2.65332ZM21 2C19.1533 2 17.1484 3.71186 15.5479 7.26855C14.9837 8.52217 14.4947 9.95825 14.0996 11.5371C16.2644 11.1885 18.5877 11 21 11C23.412 11 25.7349 11.1886 27.8994 11.5371C27.5043 9.95834 27.0162 8.52211 26.4521 7.26855C24.8516 3.71186 22.8467 2 21 2Z",
  arrowOut: "M21 0C32.598 0 42 9.40202 42 21C42 32.598 32.598 42 21 42C9.40202 42 0 32.598 0 21C0 9.40202 9.40202 0 21 0ZM21 2C10.5066 2 2 10.5066 2 21C2 31.4934 10.5066 40 21 40C31.4934 40 40 31.4934 40 21C40 10.5066 31.4934 2 21 2ZM30 26.4951H28V15.4141L13.707 29.707L12.293 28.293L26.5859 14H15.5049V12H30V26.4951Z",
};

// ── Palette & fonts (matching Figma) ─────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Radio+Canada+Big:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&family=Geist+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #fff;
    --surface: #f6f8fb;
    --border: #dbe0ec;
    --text: #000;
    --muted: #6c6c6c;
    --accent: #000;
    --danger: #e53e3e;
    --success: #38a169;
    --warning: #d69e2e;
    --font-display: 'Radio Canada Big', sans-serif;
    --font-body: 'Source Serif 4', serif;
    --font-mono: 'Geist Mono', monospace;
    --radius-sm: 8px;
    --radius-md: 16px;
    --radius-lg: 42px;
    --nav-h: 60px;
    --transition: 0.2s ease;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--bg); color: var(--text); }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: var(--nav-h);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    backdrop-filter: blur(32px);
    background: rgba(255,255,255,0.7);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    transition: var(--transition);
  }
  .nav-logo {
    font-family: var(--font-display); font-weight: 700; font-size: 20px;
    letter-spacing: -0.5px; cursor: pointer;
  }
  .nav-links { display: flex; gap: 24px; align-items: center; }
  .nav-link {
    font-family: var(--font-display); font-weight: 500; font-size: 15px;
    cursor: pointer; transition: opacity var(--transition);
    background: none; border: none; color: var(--text);
  }
  .nav-link:hover { opacity: 0.6; }
  .nav-btn {
    display: flex; align-items: center; gap: 6px;
    font-family: var(--font-display); font-weight: 500; font-size: 15px;
    cursor: pointer; border: none; background: var(--text); color: var(--bg);
    padding: 8px 18px; border-radius: 100px;
    transition: opacity var(--transition);
  }
  .nav-btn:hover { opacity: 0.8; }

  /* ── Page scaffolding ── */
  .page { min-height: 100vh; }
  .section { width: 100%; }
  .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }

  /* ── Hero ── */
  .hero {
    padding-top: calc(var(--nav-h) + 40px);
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
    gap: 0;
  }
  .hero-image-wrap {
    width: 100%; max-width: 1261px; height: 560px;
    border-radius: var(--radius-lg); overflow: hidden; position: relative;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .hero-image-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
  }
  .hero-text {
    position: relative; z-index: 1; text-align: center; color: white; padding: 0 40px;
  }
  .hero-eyebrow {
    font-family: var(--font-mono); font-size: 13px; letter-spacing: 2px;
    text-transform: uppercase; opacity: 0.7; margin-bottom: 20px;
  }
  .hero-title {
    font-family: var(--font-display); font-size: clamp(40px, 6vw, 80px);
    font-weight: 700; line-height: 1; letter-spacing: -2px; margin-bottom: 20px;
  }
  .hero-sub {
    font-family: var(--font-body); font-size: 20px; opacity: 0.85;
    max-width: 560px; margin: 0 auto 36px; line-height: 1.4;
  }
  .hero-cta {
    display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;
  }
  .btn-primary {
    font-family: var(--font-display); font-weight: 600; font-size: 15px;
    background: white; color: black; border: none; border-radius: 100px;
    padding: 12px 28px; cursor: pointer; transition: opacity var(--transition);
  }
  .btn-primary:hover { opacity: 0.85; }
  .btn-outline {
    font-family: var(--font-display); font-weight: 500; font-size: 15px;
    background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.5);
    border-radius: 100px; padding: 12px 28px; cursor: pointer; transition: border-color var(--transition);
  }
  .btn-outline:hover { border-color: white; }

  /* ── Values section ── */
  .values {
    padding: 120px 24px 160px;
    display: flex; flex-direction: column; align-items: center; gap: 40px;
  }
  .values-title {
    font-family: var(--font-display); font-size: 40px; font-weight: 500;
    letter-spacing: -1.2px; text-align: center;
  }
  .values-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; max-width: 1400px;
  }
  @media (max-width: 768px) { .values-grid { grid-template-columns: 1fr; } }
  .value-card {
    background: var(--surface); border-radius: var(--radius-md);
    padding: 40px; display: flex; flex-direction: column; gap: 24px;
    min-height: 246px;
  }
  .value-icon { width: 42px; height: 42px; }
  .value-card-title {
    font-family: var(--font-display); font-size: 20px; font-weight: 500;
    letter-spacing: -0.4px; margin-bottom: 8px;
  }
  .value-card-body {
    font-family: var(--font-body); font-size: 18px; line-height: 1.4;
    color: var(--muted);
  }

  /* ── Founder section ── */
  .founder { padding: 0 24px 120px; }
  .founder-inner {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    max-width: 1400px; margin: 0 auto; min-height: 560px;
    border-radius: var(--radius-md); overflow: hidden;
  }
  @media (max-width: 768px) { .founder-inner { grid-template-columns: 1fr; } }
  .founder-image {
    background: linear-gradient(135deg, #89b5d4 0%, #4a90d9 50%, #2176ae 100%);
    position: relative; min-height: 400px;
    display: flex; align-items: flex-end;
  }
  .founder-image::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  }
  .founder-quote {
    padding: 64px 80px; display: flex; flex-direction: column; justify-content: center; gap: 40px;
    background: var(--bg);
  }
  .founder-eyebrow { font-family: var(--font-body); font-size: 18px; color: var(--muted); letter-spacing: -0.4px; }
  .founder-heading {
    font-family: var(--font-display); font-size: 52px; font-weight: 500;
    letter-spacing: -1.5px; line-height: 1;
  }
  .founder-text {
    font-family: var(--font-body); font-size: 18px; line-height: 1.5;
    color: #333; display: flex; flex-direction: column; gap: 16px;
  }

  /* ── Team section ── */
  .team { background: var(--surface); padding: 120px 24px; }
  .team-inner { max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }
  .team-title { font-family: var(--font-display); font-size: 52px; font-weight: 500; letter-spacing: -1.5px; }
  .team-table { width: 100%; }
  .team-labels {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    font-family: var(--font-mono); font-size: 13px; padding-bottom: 12px;
    border-bottom: 1px solid var(--border); margin-bottom: 4px;
  }
  .team-labels span:last-child { text-align: right; }
  .team-row {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    padding: 18px 0; border-bottom: 1px solid var(--border);
    align-items: center;
  }
  .team-name { font-family: var(--font-display); font-weight: 500; font-size: 18px; letter-spacing: -0.4px; }
  .team-role { font-family: var(--font-body); font-size: 17px; }
  .team-email { font-family: var(--font-body); font-size: 16px; text-align: right; text-decoration: underline; color: var(--text); }

  /* ── CTA Banner ── */
  .cta-banner {
    background: var(--text); color: var(--bg); padding: 100px 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center; gap: 32px;
  }
  .cta-title { font-family: var(--font-display); font-size: clamp(36px, 5vw, 64px); font-weight: 700; letter-spacing: -2px; }
  .cta-sub { font-family: var(--font-body); font-size: 20px; opacity: 0.7; max-width: 480px; }
  .cta-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
  .btn-white { background: white; color: black; border: none; border-radius: 100px; padding: 14px 32px; font-family: var(--font-display); font-weight: 600; font-size: 16px; cursor: pointer; transition: opacity var(--transition); }
  .btn-white:hover { opacity: 0.85; }
  .btn-ghost-white { background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.4); border-radius: 100px; padding: 14px 32px; font-family: var(--font-display); font-weight: 500; font-size: 16px; cursor: pointer; transition: border-color var(--transition); }
  .btn-ghost-white:hover { border-color: white; }

  /* ── Footer ── */
  .footer { background: var(--surface); padding: 40px 24px; display: flex; justify-content: center; }
  .footer-inner { max-width: 1400px; width: 100%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .footer-brand { font-family: var(--font-display); font-weight: 700; font-size: 18px; }
  .footer-copy { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }

  /* ── Auth Pages ── */
  .auth-page {
    min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }
  @media (max-width: 768px) { .auth-page { grid-template-columns: 1fr; } .auth-visual { display: none !important; } }
  .auth-visual {
    background: linear-gradient(150deg, #0a0a0a 0%, #1a1a2e 50%, #0f3460 100%);
    position: relative; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 60px; gap: 32px;
  }
  .auth-visual-title {
    color: white; font-family: var(--font-display); font-size: 48px; font-weight: 700;
    letter-spacing: -1.5px; line-height: 1; text-align: center;
  }
  .auth-visual-sub {
    color: rgba(255,255,255,0.6); font-family: var(--font-body); font-size: 18px;
    line-height: 1.4; text-align: center; max-width: 340px;
  }
  .auth-dots {
    display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px;
    opacity: 0.15; position: absolute; inset: 0; padding: 40px;
    pointer-events: none;
  }
  .auth-dot { width: 4px; height: 4px; border-radius: 50%; background: white; margin: auto; }
  .auth-form-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 48px;
  }
  .auth-form {
    width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 24px;
  }
  .auth-title { font-family: var(--font-display); font-size: 36px; font-weight: 700; letter-spacing: -1px; }
  .auth-subtitle { font-family: var(--font-body); font-size: 17px; color: var(--muted); margin-top: -12px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.5px; color: var(--muted); text-transform: uppercase; }
  .form-input {
    font-family: var(--font-body); font-size: 16px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 12px 16px; background: var(--bg); color: var(--text);
    outline: none; transition: border-color var(--transition);
  }
  .form-input:focus { border-color: var(--text); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .btn-submit {
    font-family: var(--font-display); font-weight: 600; font-size: 16px;
    background: var(--text); color: var(--bg); border: none; border-radius: var(--radius-sm);
    padding: 14px; cursor: pointer; transition: opacity var(--transition); width: 100%;
    margin-top: 8px;
  }
  .btn-submit:hover { opacity: 0.85; }
  .auth-switch {
    font-family: var(--font-body); font-size: 15px; text-align: center; color: var(--muted);
  }
  .auth-switch button { background: none; border: none; cursor: pointer; font-family: inherit; font-size: inherit; color: var(--text); text-decoration: underline; }
  .auth-divider { display: flex; align-items: center; gap: 12px; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .auth-divider span { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }

  /* ── Dashboard ── */
  .dash-layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  @media (max-width: 900px) { .dash-layout { grid-template-columns: 1fr; } .dash-sidebar { display: none !important; } }
  .dash-sidebar {
    background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 28px 0; position: sticky; top: 0; height: 100vh;
  }
  .dash-logo { font-family: var(--font-display); font-weight: 700; font-size: 20px; padding: 0 24px 28px; border-bottom: 1px solid var(--border); }
  .dash-nav { padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .dash-nav-item {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-display); font-weight: 500; font-size: 14px;
    padding: 10px 12px; border-radius: var(--radius-sm); cursor: pointer;
    transition: background var(--transition); border: none; background: none; text-align: left; width: 100%;
    color: var(--text);
  }
  .dash-nav-item:hover { background: var(--border); }
  .dash-nav-item.active { background: var(--text); color: var(--bg); }
  .dash-user { padding: 16px; border-top: 1px solid var(--border); font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .dash-main { display: flex; flex-direction: column; }
  .dash-header {
    padding: 24px 32px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    background: var(--bg); position: sticky; top: 0; z-index: 10;
  }
  .dash-page-title { font-family: var(--font-display); font-size: 22px; font-weight: 600; letter-spacing: -0.4px; }
  .dash-content { padding: 32px; display: flex; flex-direction: column; gap: 28px; }

  /* ── Stats ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
  .stat-card { background: var(--surface); border-radius: var(--radius-md); padding: 24px; display: flex; flex-direction: column; gap: 8px; }
  .stat-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value { font-family: var(--font-display); font-size: 32px; font-weight: 700; letter-spacing: -1px; }
  .stat-change { font-family: var(--font-mono); font-size: 12px; }
  .stat-change.up { color: var(--success); }
  .stat-change.down { color: var(--danger); }

  /* ── Table Card ── */
  .table-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
  .table-card-header {
    padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid var(--border);
  }
  .table-card-title { font-family: var(--font-display); font-weight: 600; font-size: 16px; }
  .table-search {
    font-family: var(--font-body); font-size: 14px; border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); padding: 8px 14px; outline: none; transition: border-color var(--transition);
    width: 220px;
  }
  .table-search:focus { border-color: var(--text); }
  .table-actions { display: flex; gap: 10px; align-items: center; }
  .btn-add {
    font-family: var(--font-display); font-weight: 600; font-size: 14px;
    background: var(--text); color: var(--bg); border: none; border-radius: var(--radius-sm);
    padding: 9px 18px; cursor: pointer; transition: opacity var(--transition); white-space: nowrap;
  }
  .btn-add:hover { opacity: 0.8; }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
    color: var(--muted); text-align: left; padding: 12px 24px; border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .data-table td { padding: 14px 24px; border-bottom: 1px solid var(--border); font-family: var(--font-body); font-size: 15px; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: var(--surface); }
  .td-name { font-family: var(--font-display); font-weight: 500; font-size: 15px; }
  .td-mono { font-family: var(--font-mono); font-size: 13px; }
  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.3px;
  }
  .badge-active { background: #d4edda; color: #155724; }
  .badge-inactive { background: #f8d7da; color: #721c24; }
  .badge-pending { background: #fff3cd; color: #856404; }
  .row-actions { display: flex; gap: 8px; }
  .btn-edit, .btn-delete {
    font-family: var(--font-mono); font-size: 12px; padding: 5px 12px;
    border-radius: var(--radius-sm); cursor: pointer; border: 1.5px solid var(--border);
    transition: all var(--transition);
  }
  .btn-edit { background: var(--bg); color: var(--text); }
  .btn-edit:hover { background: var(--text); color: var(--bg); border-color: var(--text); }
  .btn-delete { background: var(--bg); color: var(--danger); border-color: rgba(229,62,62,0.3); }
  .btn-delete:hover { background: var(--danger); color: white; border-color: var(--danger); }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 24px;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--bg); border-radius: var(--radius-md); width: 100%; max-width: 520px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.2);
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-header { padding: 24px 28px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .modal-title { font-family: var(--font-display); font-size: 20px; font-weight: 600; letter-spacing: -0.4px; }
  .modal-close { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--muted); line-height: 1; }
  .modal-body { padding: 28px; display: flex; flex-direction: column; gap: 18px; }
  .modal-footer { padding: 20px 28px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 12px; }
  .btn-cancel { font-family: var(--font-display); font-size: 14px; background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 10px 20px; cursor: pointer; transition: background var(--transition); }
  .btn-cancel:hover { background: var(--surface); }
  .btn-save { font-family: var(--font-display); font-weight: 600; font-size: 14px; background: var(--text); color: var(--bg); border: none; border-radius: var(--radius-sm); padding: 10px 24px; cursor: pointer; transition: opacity var(--transition); }
  .btn-save:hover { opacity: 0.8; }
  .btn-danger { font-family: var(--font-display); font-weight: 600; font-size: 14px; background: var(--danger); color: white; border: none; border-radius: var(--radius-sm); padding: 10px 24px; cursor: pointer; transition: opacity var(--transition); }
  .btn-danger:hover { opacity: 0.85; }
  .form-select { font-family: var(--font-body); font-size: 15px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 11px 14px; background: var(--bg); outline: none; transition: border-color var(--transition); width: 100%; }
  .form-select:focus { border-color: var(--text); }
  .toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 999;
    background: var(--text); color: var(--bg);
    font-family: var(--font-mono); font-size: 13px;
    padding: 14px 20px; border-radius: var(--radius-sm);
    animation: fadeIn 0.2s ease;
    max-width: 300px;
  }
`;

// ── Data ─────────────────────────────────────────────────────────────────────
const INITIAL_LISTINGS = [
  { id: 1, name: "IT Park Lot A", address: "Cebu IT Park, Apas", owner: "Maria Santos", price: 50, slots: 8, available: 5, status: "active" },
  { id: 2, name: "Capitol Site Garage", address: "Capitol Site, Cebu City", owner: "Juan dela Cruz", price: 40, slots: 12, available: 0, status: "inactive" },
  { id: 3, name: "Ayala Overflow", address: "Cebu Business Park", owner: "Ana Reyes", price: 60, slots: 4, available: 2, status: "active" },
  { id: 4, name: "Lahug Driveway", address: "Lahug, Cebu City", owner: "Pedro Bautista", price: 35, slots: 2, available: 2, status: "active" },
  { id: 5, name: "Banilad Compound", address: "Banilad, Cebu City", owner: "Lucia Torres", price: 45, slots: 6, available: 3, status: "pending" },
];

const INITIAL_BOOKINGS = [
  { id: 1, listing: "IT Park Lot A", renter: "John Smith", date: "2026-05-15", time: "9:00 AM", duration: "4 hrs", amount: 200, status: "confirmed" },
  { id: 2, listing: "Ayala Overflow", renter: "Jane Lee", date: "2026-05-15", time: "8:00 AM", duration: "8 hrs", amount: 480, status: "confirmed" },
  { id: 3, listing: "Banilad Compound", renter: "Carlos Go", date: "2026-05-16", time: "7:00 AM", duration: "2 hrs", amount: 90, status: "pending" },
];

// ── Icon components ───────────────────────────────────────────────────────────
const ParkingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
  </svg>
);
const BookingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const OverviewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useState(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); });
  return <div className="toast">{message}</div>;
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ onLogin, onSignup }) {
  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-logo">SlotShare</div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => document.getElementById('values')?.scrollIntoView({ behavior: 'smooth' })}>About</button>
          <button className="nav-link" onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}>Team</button>
          <button className="nav-btn" onClick={onSignup}>Get started ↗</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div style={{ padding: '40px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <div className="hero-image-wrap">
            <div className="hero-image-overlay" />
            <div className="hero-text">
              <p className="hero-eyebrow">Cebu City · Parking Marketplace</p>
              <h1 className="hero-title">Find. Book. Park.</h1>
              <p className="hero-sub">SlotShare connects commuters with private parking spaces across Cebu's busiest districts.</p>
              <div className="hero-cta">
                <button className="btn-primary" onClick={onSignup}>Create account</button>
                <button className="btn-outline" onClick={onLogin}>Sign in</button>
              </div>
            </div>
            {/* decorative parking grid */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none', opacity: 0.15 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '2px', width: '100%', padding: '0 40px 0' }}>
                {Array.from({length: 24}).map((_,i) => (
                  <div key={i} style={{ height: '60px', background: 'white', borderRadius: '4px 4px 0 0' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div id="values" className="values">
        <h2 className="values-title">What is SlotShare</h2>
        <div className="values-grid" style={{ maxWidth: '1400px', width: '100%' }}>
          <div className="value-card">
            <svg className="value-icon" viewBox="0 0 42 42" fill="none"><path d="M21 0C32.598 0 42 9.402 42 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0zM20 2.025C9.971 2.545 2 10.842 2 21s7.971 18.454 18 18.974V2.025zM22 22v17.974C31.697 39.471 39.472 31.697 39.975 22H22zm0-2h17.975C39.472 10.303 31.697 2.528 22 2.025V20z" fill="currentColor"/></svg>
            <div>
              <div className="value-card-title">AirBnB Style</div>
              <div className="value-card-body">An AirBnB-style platform tailored for commuters — an alternative solution for limited parking spaces.</div>
            </div>
          </div>
          <div className="value-card">
            <svg className="value-icon" viewBox="0 0 42 42" fill="none"><path d="M21 0C32.598 0 42 9.402 42 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0zm0 2C10.507 2 2 10.507 2 21s8.507 19 19 19 19-8.507 19-19S31.493 2 21 2zm9 8v14.495h-2V15.414L13.707 29.707 12.293 28.293 26.586 14H15.505V12H30z" fill="currentColor"/></svg>
            <div>
              <div className="value-card-title">CCTO Compliance</div>
              <div className="value-card-body">Coordinated with CCTO to maintain parking rates and avoid disrupting established price structures.</div>
            </div>
          </div>
          <div className="value-card">
            <svg className="value-icon" viewBox="0 0 42 42" fill="none"><path d="M21 0C32.598 0 42 9.402 42 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0zm6.9 30.462c-2.165.348-4.488.538-6.9.538s-4.735-.19-6.9-.538c.395 1.579.884 3.016 1.448 4.269C17.148 38.288 19.153 40 21 40s3.852-1.712 5.452-5.269c.564-1.253 1.052-2.69 1.448-4.269z" fill="currentColor"/></svg>
            <div>
              <div className="value-card-title">Parking Space Renting</div>
              <div className="value-card-body">Private parking spaces rented to commuters easily with in-app booking and digital payment integration.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder story */}
      <div className="founder">
        <div className="founder-inner">
          <div className="founder-image">
            <div style={{ position: 'relative', zIndex: 1, padding: '40px', color: 'white' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', opacity: 0.6, marginBottom: '12px' }}>CIT-U · BACOLOD</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.8px', lineHeight: 1.1 }}>A student-built<br/>marketplace for<br/>real-world impact</div>
            </div>
            {/* parking icon decoration */}
            <div style={{ position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', opacity: 0.2 }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
            </div>
          </div>
          <div className="founder-quote">
            <p className="founder-eyebrow">Founder's story</p>
            <h2 className="founder-heading">A CIT Project</h2>
            <div className="founder-text">
              <p>SlotShare is a parking marketplace platform developed by students from the Cebu Institute of Technology – University (CIT-U) as part of their academic project in systems analysis and design.</p>
              <p>The platform was conceptualized to address growing parking congestion in busy urban areas such as IT Park and Capitol Site in Cebu City, where BPO employees spend 30+ minutes daily searching for parking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div id="team" className="team">
        <div className="team-inner">
          <h2 className="team-title">Meet the team</h2>
          <div className="team-table">
            <div className="team-labels">
              <span>Name</span><span>Title</span><span style={{ textAlign: 'right' }}>Contact</span>
            </div>
            {[
              { name: "Jac Gary F. Canete", title: "Director of Technology", email: "jacgary.canete@cit.edu" },
              { name: "Keith Charven S. Canada", title: "Director of Technology", email: "keithcharven.canada@cit.edu" },
              { name: "Gerad Emeka T. Macopia", title: "Director of Technology", email: "gerademeka.macopia@cit.edu" },
            ].map(m => (
              <div key={m.email} className="team-row">
                <span className="team-name">{m.name}</span>
                <span className="team-role">{m.title}</span>
                <a className="team-email" href={`mailto:${m.email}`}>{m.email}</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-banner">
        <h2 className="cta-title">Get Started Now!</h2>
        <p className="cta-sub">Join the parking revolution. List your space or find a spot in seconds.</p>
        <div className="cta-actions">
          <button className="btn-white" onClick={onSignup}>Create free account</button>
          <button className="btn-ghost-white" onClick={onLogin}>Sign in</button>
        </div>
      </div>

      <div className="footer">
        <div className="footer-inner">
          <div className="footer-brand">SlotShare</div>
          <div className="footer-copy">© 2026 CIT-U Systems Project. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onSignup, onBack }) {
  const [email, setEmail] = useState("admin@slotshare.ph");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const handle = () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    onLogin();
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-dots">{Array.from({length: 200}).map((_,i) => <div key={i} className="auth-dot" />)}</div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, background: 'white', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
          </div>
          <h2 className="auth-visual-title">SlotShare</h2>
          <p className="auth-visual-sub">The smartest way to find and list parking spaces in Cebu City.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, width: '100%', maxWidth: 280, marginTop: 24 }}>
            {["8 listings", "120+ users", "4.9★ rating"].map(s => (
              <div key={s} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 10px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'white' }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', alignSelf: 'flex-start', marginBottom: 8 }}>← Back to home</button>
          <div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your SlotShare account</p>
          </div>
          {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger)', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 6, padding: '10px 14px' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn-submit" onClick={handle}>Sign in</button>
          <div className="auth-divider"><span>or</span></div>
          <p className="auth-switch">Don't have an account? <button onClick={onSignup}>Sign up free</button></p>
        </div>
      </div>
    </div>
  );
}

// ── Signup Page ───────────────────────────────────────────────────────────────
function SignupPage({ onSignup, onLogin, onBack }) {
  const [form, setForm] = useState({ first: "", last: "", email: "", password: "", confirm: "", role: "renter" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handle = () => {
    if (!form.first || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setError("");
    onSignup();
  };

  return (
    <div className="auth-page">
      <div className="auth-visual" style={{ background: 'linear-gradient(150deg, #0f3460 0%, #533483 60%, #e94560 100%)' }}>
        <div className="auth-dots">{Array.from({length: 200}).map((_,i) => <div key={i} className="auth-dot" />)}</div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          <h2 className="auth-visual-title">Join the community</h2>
          <p className="auth-visual-sub">List your parking space and start earning, or find affordable parking near you.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
            {["✓ Free to join", "✓ Book in seconds", "✓ CCTO compliant", "✓ Secure payments"].map(s => (
              <div key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', alignSelf: 'flex-start', marginBottom: 8 }}>← Back to home</button>
          <div>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Start sharing or finding parking spaces</p>
          </div>
          {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger)', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 6, padding: '10px 14px' }}>{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name *</label>
              <input className="form-input" value={form.first} onChange={set('first')} placeholder="Juan" />
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input className="form-input" value={form.last} onChange={set('last')} placeholder="dela Cruz" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="juan@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">I want to</label>
            <select className="form-select" value={form.role} onChange={set('role')}>
              <option value="renter">Find parking (Renter)</option>
              <option value="owner">List my space (Owner)</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm *</label>
              <input className="form-input" type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" />
            </div>
          </div>
          <button className="btn-submit" onClick={handle}>Create account</button>
          <p className="auth-switch">Already have an account? <button onClick={onLogin}>Sign in</button></p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const EMPTY_LISTING = { name: "", address: "", owner: "", price: "", slots: "", available: "", status: "active" };
const EMPTY_BOOKING = { listing: "", renter: "", date: "", time: "", duration: "", amount: "", status: "pending" };

function Modal({ title, children, onClose, onConfirm, confirmLabel = "Save", danger = false }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className={danger ? "btn-danger" : "btn-save"} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ListingsTable({ listings, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const filtered = listings.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.address.toLowerCase().includes(search.toLowerCase()) ||
    l.owner.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="table-card">
      <div className="table-card-header">
        <span className="table-card-title">Parking Listings</span>
        <div className="table-actions">
          <input className="table-search" placeholder="Search listings…" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-add" onClick={onAdd}>+ Add Listing</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Address</th><th>Owner</th><th>Price/hr</th><th>Slots</th><th>Available</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 13, padding: '40px 24px' }}>No listings found</td></tr>
            ) : filtered.map(l => (
              <tr key={l.id}>
                <td className="td-name">{l.name}</td>
                <td>{l.address}</td>
                <td>{l.owner}</td>
                <td className="td-mono">₱{l.price}</td>
                <td className="td-mono">{l.slots}</td>
                <td className="td-mono" style={{ color: l.available === 0 ? 'var(--danger)' : 'var(--success)' }}>{l.available}</td>
                <td>
                  <span className={`badge badge-${l.status}`}>{l.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn-edit" onClick={() => onEdit(l)}>Edit</button>
                    <button className="btn-delete" onClick={() => onDelete(l)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingsTable({ bookings, listings, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const filtered = bookings.filter(b =>
    b.listing.toLowerCase().includes(search.toLowerCase()) ||
    b.renter.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="table-card">
      <div className="table-card-header">
        <span className="table-card-title">Bookings</span>
        <div className="table-actions">
          <input className="table-search" placeholder="Search bookings…" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-add" onClick={onAdd}>+ Add Booking</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Listing</th><th>Renter</th><th>Date</th><th>Time</th><th>Duration</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 13, padding: '40px 24px' }}>No bookings found</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id}>
                <td className="td-name">{b.listing}</td>
                <td>{b.renter}</td>
                <td className="td-mono">{b.date}</td>
                <td className="td-mono">{b.time}</td>
                <td className="td-mono">{b.duration}</td>
                <td className="td-mono">₱{b.amount}</td>
                <td>
                  <span className={`badge badge-${b.status === 'confirmed' ? 'active' : b.status === 'pending' ? 'pending' : 'inactive'}`}>{b.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn-edit" onClick={() => onEdit(b)}>Edit</button>
                    <button className="btn-delete" onClick={() => onDelete(b)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [modal, setModal] = useState(null); // { type, data, isEdit }
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (msg) => { setToast(msg); };
  const setField = (k) => (e) => setFormData(f => ({ ...f, [k]: e.target.value }));

  // Listings CRUD
  const openAddListing = () => { setFormData({ ...EMPTY_LISTING }); setModal({ type: 'listing', isEdit: false }); };
  const openEditListing = (l) => { setFormData({ ...l }); setModal({ type: 'listing', isEdit: true }); };
  const saveListing = () => {
    if (!formData.name || !formData.address) return;
    if (modal.isEdit) {
      setListings(ls => ls.map(l => l.id === formData.id ? { ...formData, price: +formData.price, slots: +formData.slots, available: +formData.available } : l));
      showToast("Listing updated successfully");
    } else {
      setListings(ls => [...ls, { ...formData, id: Date.now(), price: +formData.price, slots: +formData.slots, available: +formData.available }]);
      showToast("Listing added successfully");
    }
    setModal(null);
  };
  const confirmDeleteListing = (l) => { setDeleteTarget({ type: 'listing', item: l }); };
  const doDeleteListing = () => {
    setListings(ls => ls.filter(l => l.id !== deleteTarget.item.id));
    showToast("Listing deleted");
    setDeleteTarget(null);
  };

  // Bookings CRUD
  const openAddBooking = () => { setFormData({ ...EMPTY_BOOKING }); setModal({ type: 'booking', isEdit: false }); };
  const openEditBooking = (b) => { setFormData({ ...b }); setModal({ type: 'booking', isEdit: true }); };
  const saveBooking = () => {
    if (!formData.listing || !formData.renter) return;
    if (modal.isEdit) {
      setBookings(bs => bs.map(b => b.id === formData.id ? { ...formData, amount: +formData.amount } : b));
      showToast("Booking updated successfully");
    } else {
      setBookings(bs => [...bs, { ...formData, id: Date.now(), amount: +formData.amount }]);
      showToast("Booking added successfully");
    }
    setModal(null);
  };
  const confirmDeleteBooking = (b) => { setDeleteTarget({ type: 'booking', item: b }); };
  const doDeleteBooking = () => {
    setBookings(bs => bs.filter(b => b.id !== deleteTarget.item.id));
    showToast("Booking deleted");
    setDeleteTarget(null);
  };

  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.amount, 0);
  const activeListings = listings.filter(l => l.status === 'active').length;
  const totalSlots = listings.reduce((s, l) => s + l.slots, 0);
  const availableSlots = listings.reduce((s, l) => s + l.available, 0);

  const NAV = [
    { id: 'overview', label: 'Overview', icon: <OverviewIcon /> },
    { id: 'listings', label: 'Listings', icon: <ParkingIcon /> },
    { id: 'bookings', label: 'Bookings', icon: <BookingsIcon /> },
  ];

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-logo">SlotShare</div>
        <nav className="dash-nav">
          {NAV.map(n => (
            <button key={n.id} className={`dash-nav-item ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="dash-nav-item" onClick={onLogout} style={{ marginTop: 'auto', color: 'var(--danger)' }}>
            <LogoutIcon /> Sign out
          </button>
        </nav>
        <div className="dash-user">Signed in as admin</div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-header">
          <span className="dash-page-title">
            {tab === 'overview' && 'Overview'}
            {tab === 'listings' && 'Parking Listings'}
            {tab === 'bookings' && 'Bookings'}
          </span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>May 15, 2026</div>
            <button onClick={onLogout} style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: 6, padding: '6px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer' }}>Sign out</button>
          </div>
        </div>

        <div className="dash-content">
          {/* Overview tab */}
          {tab === 'overview' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value">₱{totalRevenue.toLocaleString()}</div>
                  <div className="stat-change up">↑ confirmed bookings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Listings</div>
                  <div className="stat-value">{activeListings}</div>
                  <div className="stat-change">{listings.length} total</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Bookings</div>
                  <div className="stat-value">{bookings.length}</div>
                  <div className="stat-change up">↑ {bookings.filter(b=>b.status==='confirmed').length} confirmed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Available Slots</div>
                  <div className="stat-value">{availableSlots}/{totalSlots}</div>
                  <div className="stat-change">{Math.round(availableSlots/totalSlots*100)||0}% availability</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="table-card">
                  <div className="table-card-header" style={{ justifyContent: 'space-between' }}>
                    <span className="table-card-title">Recent Listings</span>
                    <button className="btn-add" onClick={() => setTab('listings')}>View all</button>
                  </div>
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>Status</th><th>Price</th></tr></thead>
                    <tbody>
                      {listings.slice(0,4).map(l => (
                        <tr key={l.id}>
                          <td className="td-name">{l.name}</td>
                          <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                          <td className="td-mono">₱{l.price}/hr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-card">
                  <div className="table-card-header">
                    <span className="table-card-title">Recent Bookings</span>
                    <button className="btn-add" onClick={() => setTab('bookings')}>View all</button>
                  </div>
                  <table className="data-table">
                    <thead><tr><th>Renter</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {bookings.slice(0,4).map(b => (
                        <tr key={b.id}>
                          <td className="td-name">{b.renter}</td>
                          <td className="td-mono">₱{b.amount}</td>
                          <td><span className={`badge badge-${b.status==='confirmed'?'active':b.status==='pending'?'pending':'inactive'}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Listings tab */}
          {tab === 'listings' && (
            <ListingsTable listings={listings} onAdd={openAddListing} onEdit={openEditListing} onDelete={confirmDeleteListing} />
          )}

          {/* Bookings tab */}
          {tab === 'bookings' && (
            <BookingsTable bookings={bookings} listings={listings} onAdd={openAddBooking} onEdit={openEditBooking} onDelete={confirmDeleteBooking} />
          )}
        </div>
      </main>

      {/* Listing Modal */}
      {modal?.type === 'listing' && (
        <Modal title={modal.isEdit ? "Edit Listing" : "Add Listing"} onClose={() => setModal(null)} onConfirm={saveListing} confirmLabel={modal.isEdit ? "Save changes" : "Add listing"}>
          <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={formData.name || ''} onChange={setField('name')} placeholder="IT Park Lot A" /></div>
          <div className="form-group"><label className="form-label">Address *</label><input className="form-input" value={formData.address || ''} onChange={setField('address')} placeholder="Cebu IT Park, Apas" /></div>
          <div className="form-group"><label className="form-label">Owner</label><input className="form-input" value={formData.owner || ''} onChange={setField('owner')} placeholder="Maria Santos" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Price / hr (₱)</label><input className="form-input" type="number" value={formData.price || ''} onChange={setField('price')} placeholder="50" /></div>
            <div className="form-group"><label className="form-label">Total Slots</label><input className="form-input" type="number" value={formData.slots || ''} onChange={setField('slots')} placeholder="8" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Available Slots</label><input className="form-input" type="number" value={formData.available || ''} onChange={setField('available')} placeholder="5" /></div>
            <div className="form-group"><label className="form-label">Status</label>
              <select className="form-select" value={formData.status || 'active'} onChange={setField('status')}>
                <option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Booking Modal */}
      {modal?.type === 'booking' && (
        <Modal title={modal.isEdit ? "Edit Booking" : "Add Booking"} onClose={() => setModal(null)} onConfirm={saveBooking} confirmLabel={modal.isEdit ? "Save changes" : "Add booking"}>
          <div className="form-group"><label className="form-label">Listing *</label>
            <select className="form-select" value={formData.listing || ''} onChange={setField('listing')}>
              <option value="">Select a listing…</option>
              {listings.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Renter name *</label><input className="form-input" value={formData.renter || ''} onChange={setField('renter')} placeholder="John Smith" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={formData.date || ''} onChange={setField('date')} /></div>
            <div className="form-group"><label className="form-label">Time</label><input className="form-input" value={formData.time || ''} onChange={setField('time')} placeholder="9:00 AM" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Duration</label><input className="form-input" value={formData.duration || ''} onChange={setField('duration')} placeholder="4 hrs" /></div>
            <div className="form-group"><label className="form-label">Amount (₱)</label><input className="form-input" type="number" value={formData.amount || ''} onChange={setField('amount')} placeholder="200" /></div>
          </div>
          <div className="form-group"><label className="form-label">Status</label>
            <select className="form-select" value={formData.status || 'pending'} onChange={setField('status')}>
              <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
            </select>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal title={`Delete ${deleteTarget.type}`} onClose={() => setDeleteTarget(null)} onConfirm={deleteTarget.type === 'listing' ? doDeleteListing : doDeleteBooking} confirmLabel="Delete" danger>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.5 }}>
            Are you sure you want to delete <strong>{deleteTarget.item.name || deleteTarget.item.listing}</strong>? This action cannot be undone.
          </p>
        </Modal>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // home | login | signup | dashboard

  return (
    <>
      <style>{STYLE}</style>
      {page === "home" && <HomePage onLogin={() => setPage("login")} onSignup={() => setPage("signup")} />}
      {page === "login" && <LoginPage onLogin={() => setPage("dashboard")} onSignup={() => setPage("signup")} onBack={() => setPage("home")} />}
      {page === "signup" && <SignupPage onSignup={() => setPage("dashboard")} onLogin={() => setPage("login")} onBack={() => setPage("home")} />}
      {page === "dashboard" && <Dashboard onLogout={() => setPage("home")} />}
    </>
  );
}
