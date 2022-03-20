import TransactionsTable from './TransactionsTable';
import { useState, useEffect } from 'react';
import Axios from 'axios';

export default function DataTable(props) {
  const [listOfTransactions, setlistOfTransactions] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:3001/getTransactions').then((response) => {
      setlistOfTransactions(response.data);
    });
  }, []);
  return (
    <div>
      <TransactionsTable transactionsList={listOfTransactions} />
    </div>
  );
}
