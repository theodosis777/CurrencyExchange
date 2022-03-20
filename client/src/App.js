import DataTable from './components/dataTable/DataTable';
import CurrencyExchange from './components/exchange/CurrencyExchange';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div>
        <CurrencyExchange />
      </div>
      <div>
        <DataTable />
      </div>
    </div>
  );
}

export default App;
