export default function ResultTable({ rows }) {
  if (!rows?.length) return <div className="empty-state small">No table rows available.</div>
  const headers = Object.keys(rows[0])
  return (
    <div className="table-scroll">
      <table className="result-table">
        <thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.slice(0, 12).map((row, index) => <tr key={index}>{headers.map(header => <td key={header}>{row[header]}</td>)}</tr>)}</tbody>
      </table>
      {rows.length > 12 && <small className="table-note">Showing the first 12 of {rows.length} rows.</small>}
    </div>
  )
}
