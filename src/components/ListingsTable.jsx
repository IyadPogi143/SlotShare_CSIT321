import React, { useState } from 'react';

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

export default ListingsTable;