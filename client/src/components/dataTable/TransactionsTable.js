import React from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import './DataTable.css';

function Table({ columns, data }) {
  const {
    page,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  ///format date in table
  const formatDate = (tempdate) => {
    var year = new Date(tempdate).getFullYear();
    var month = (new Date(tempdate).getMonth() + 1).toString().padStart(2, '0');
    var day = new Date(tempdate).getDate().toString().padStart(2, '0');
    var hour = new Date(tempdate).getHours().toString().padStart(2, '0');
    var minute = new Date(tempdate).getMinutes().toString().padStart(2, '0');

    return day + '/' + month + '/' + year + ' ' + hour + ':' + minute;
  };

  return (
    <div>
      <div>
        <h1>History</h1>
        <div className='dataTable'>
          <table className='table' {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      <span
                        className={
                          column.isSorted
                            ? column.isSortedDesc
                              ? 'asc'
                              : 'desc'
                            : ''
                        }
                      ></span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          style={{
                            color:
                              cell.column.Header === 'Type'
                                ? row.values.type === 'Live'
                                  ? 'green'
                                  : 'blue'
                                : null,
                          }}
                          {...cell.getCellProps()}
                        >
                          {cell.column.Header === 'Date & Time'
                            ? formatDate(row.values.transactionDate)
                            : cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p></p>
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

const TransactionsTable = (props) => {
  const columns = [
    {
      Header: 'Date & Time',
      accessor: 'transactionDate',
    },
    {
      Header: 'Currency From',
      accessor: 'currencyFrom',
    },
    {
      Header: 'Amount 1',
      accessor: 'amount1',
    },
    {
      Header: 'Currency To',
      accessor: 'currencyTo',
    },
    {
      Header: 'Amount 2',
      accessor: 'amount2',
    },
    {
      Header: 'Type',
      accessor: 'type',
    },
  ];

  return <Table data={props.transactionsList} columns={columns} />;
};

export default TransactionsTable;
