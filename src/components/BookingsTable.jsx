import React, { useState } from 'react';

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

export default BookingsTable;