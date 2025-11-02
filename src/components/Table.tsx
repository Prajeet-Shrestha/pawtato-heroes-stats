import React, { useState, useMemo } from "react";
import "./Table.css";

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  title: string;
  columns: TableColumn[];
  data: any[];
  itemsPerPage?: number;
}

const Table: React.FC<TableProps> = ({ title, columns, data, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className='table-container'>
      <div className='table-header'>
        <h3 className='table-title'>{title}</h3>
        <div className='table-info'>
          Showing {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of {sortedData.length} players
        </div>
      </div>

      <div className='table-wrapper'>
        <table className='data-table'>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={column.sortable ? "sortable" : ""} onClick={() => column.sortable && handleSort(column.key)}>
                  <div className='th-content'>
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && <span className='sort-icon'>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row[column.key], row) : row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='table-pagination'>
        <button className='pagination-btn' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>

        <div className='pagination-numbers'>
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <button key={index} className={`pagination-number ${currentPage === page ? "active" : ""}`} onClick={() => handlePageChange(page)}>
                {page}
              </button>
            ) : (
              <span key={index} className='pagination-ellipsis'>
                {page}
              </span>
            )
          )}
        </div>

        <button className='pagination-btn' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
