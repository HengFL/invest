const fs = require('fs');

const path = 'src/App.jsx';
const lines = fs.readFileSync(path, 'utf8').split('\n');

const newImports = `
import { API_URL } from './constants/api';
import { sortOptions, PORT_CATEGORIES } from './constants/options';
import { sortSelectStyles } from './constants/styles';
import { sortData } from './utils/sortUtils';
import { parseNumber, formatCurrency, maskFormattedMoney, calculateTargetAmount } from './utils/numberUtils';
import { parseDate } from './utils/dateUtils';
import SummaryCard from './components/SummaryCard';
import StockCard from './components/StockCard';
import UpdateModal from './components/UpdateModal';
import AssetCharts from './components/AssetCharts';
import InteractiveTime from './components/InteractiveTime';
`.trim();

// Keep up to line 7 (index 6)
const topLines = lines.slice(0, 7);

// Find "function App() {"
const appStartIdx = lines.findIndex(line => line.startsWith('function App() {'));

// Find the closing brace of App. It's right before "function SummaryCard"
const summaryCardIdx = lines.findIndex(line => line.startsWith('function SummaryCard('));

let appBodyLines = lines.slice(appStartIdx, summaryCardIdx);

// We should also remove the local PORT_CATEGORIES if it exists in App
const cleanAppBody = [];
let skip = false;
for (let i = 0; i < appBodyLines.length; i++) {
  const line = appBodyLines[i];
  if (line.includes('const PORT_CATEGORIES = {')) {
    skip = true;
  }
  if (!skip) {
    cleanAppBody.push(line);
  }
  if (skip && line.trim() === '};') {
    skip = false;
  }
}

const finalLines = [
  ...topLines,
  '',
  newImports,
  '',
  ...cleanAppBody,
  '',
  'export default App;',
  ''
];

fs.writeFileSync(path, finalLines.join('\n'));
console.log('App.jsx refactored successfully.');
