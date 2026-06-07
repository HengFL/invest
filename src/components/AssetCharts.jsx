import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { COLORS } from '../constants/options';
import { parseNumber, formatCurrency, calculateTargetAmount } from '../utils/numberUtils';

export default function AssetCharts({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
        <p className="text-muted">ไม่มีข้อมูลสำหรับแสดงกราฟ</p>
      </div>
    );
  }

  // Helpers to count frequencies
  const countBy = (arr, keyFn) => {
    return arr.reduce((acc, item) => {
      const key = keyFn(item) || 'ไม่ระบุ';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  };

  const sumBy = (arr, valueFn) => {
    return arr.reduce((acc, item) => {
      const key = item["ชื่อหุ้น"] || 'ไม่ระบุ';
      const val = valueFn(item);
      acc[key] = (acc[key] || 0) + val;
      return acc;
    }, {});
  };

  const toChartData = (counts) => {
    return Object.keys(counts)
      .map(key => ({ name: key, value: counts[key] }))
      .filter(d => d.value !== 0)
      .sort((a, b) => b.value - a.value);
  };

  // Aggregations
  const chartData = {
    port: toChartData(countBy(data, d => d['port'])),
    shariah: toChartData(countBy(data, d => d['หลักชะรีอะฮ์'])),
    status: toChartData(countBy(data, d => d['สถานะ'])),
    market: toChartData(countBy(data, d => d['ตลาด'])),
    sector: toChartData(countBy(data, d => d['หมวดธุรกิจ'])),
    industry: toChartData(countBy(data, d => d['อุตสาหกรรม'])),
    marketValue: toChartData(sumBy(data, d => parseNumber(d["มูลค่าตลาด ($)"]))),
    stockPrice: toChartData(sumBy(data, d => parseNumber(d["ราคาหุ้น ($)"]))),
    targetBuyAmount: toChartData(sumBy(data, d => {
      const targetPrice = parseNumber(d["ราคาตั้งซื้อ ($)"]);
      if (d.port === 'Trade' || targetPrice <= 0) return 0;
      const targetAmount = calculateTargetAmount(d["วันที่กำหนด"], d["ราคาตั้งซื้อ ($)"]);
      return targetAmount - parseNumber(d["ยอดซื้อ ($)"]) + parseNumber(d["ยอดขาย ($)"]);
    })),
    targetClearAmount: toChartData(sumBy(data, d => {
      const dividendAmount = parseNumber(d["ยอดปันผล ($)"]);
      const taxAmount = parseNumber(d["ภาษีปันผล ($)"] || d["ภาษี ($)"] || d["ยอดภาษี ($)"] || 0);
      const clearRateVal = parseFloat(d["อัตรากำจัด (%)"]) || parseFloat(d["clear_rate"]) || 0;
      const clearAmountVal = parseNumber(d["ยอดกำจัด ($)"] || d["clear_amount"] || 0);
      return (dividendAmount - taxAmount) * (clearRateVal / 100) - clearAmountVal;
    })),
    buyAmount: toChartData(sumBy(data, d => parseNumber(d["ยอดซื้อ ($)"]))),
    sellAmount: toChartData(sumBy(data, d => parseNumber(d["ยอดขาย ($)"]))),
    dividendAmount: toChartData(sumBy(data, d => parseNumber(d["ยอดปันผล ($)"]))),
    taxAmount: toChartData(sumBy(data, d => parseNumber(d["ภาษีปันผล ($)"] || d["ภาษี ($)"] || d["ยอดภาษี ($)"]))),
    clearAmount: toChartData(sumBy(data, d => parseNumber(d["ยอดกำจัด ($)"] || d["clear_amount"]))),
    profitAmount: toChartData(sumBy(data, d => {
      return (d["สถานะ"] === "ขายแล้ว" || d["สถานะ"] === "รอซื้อ")
        ? parseNumber(d["ยอดขาย ($)"]) - parseNumber(d["ยอดซื้อ ($)"])
        : 0;
    })),
    grossProfitAmount: toChartData(sumBy(data, d => {
      const profit = (d["สถานะ"] === "ขายแล้ว" || d["สถานะ"] === "รอซื้อ")
        ? parseNumber(d["ยอดขาย ($)"]) - parseNumber(d["ยอดซื้อ ($)"])
        : 0;
      return profit + parseNumber(d["ยอดปันผล ($)"]);
    })),
    netIncomeAmount: toChartData(sumBy(data, d => {
      const profit = (d["สถานะ"] === "ขายแล้ว" || d["สถานะ"] === "รอซื้อ")
        ? parseNumber(d["ยอดขาย ($)"]) - parseNumber(d["ยอดซื้อ ($)"])
        : 0;
      const dividend = parseNumber(d["ยอดปันผล ($)"]);
      const tax = parseNumber(d["ภาษีปันผล ($)"] || d["ภาษี ($)"] || d["ยอดภาษี ($)"]);
      const clearAmount = parseNumber(d["ยอดกำจัด ($)"] || d["clear_amount"]);
      return profit + (dividend - tax) - clearAmount;
    }))
  };

  const renderDonutChart = (title, dataKey, iconClass, isMoney = false, useShortFormat = false) => {
    if (!chartData[dataKey] || chartData[dataKey].length === 0) {
      return (
        <div className="glass-card" style={{ padding: '1.25rem', height: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'rgba(148, 163, 184, 0.1)', padding: '12px', borderRadius: '50%', marginBottom: '1rem' }}>
            <i className={`fa-solid ${iconClass}`} style={{ fontSize: '24px', color: '#94a3b8' }}></i>
          </div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{title}</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>ไม่มีข้อมูล</p>
        </div>
      );
    }

    const series = chartData[dataKey].map(d => Math.abs(d.value));
    const labels = chartData[dataKey].map(d => d.name);
    const total = series.reduce((acc, val) => acc + val, 0);

    const options = {
      chart: {
        type: 'donut',
        fontFamily: "'Outfit', 'Sarabun', sans-serif",
        background: 'transparent',
        animations: { enabled: true }
      },
      labels: labels,
      colors: COLORS,
      stroke: {
        colors: ['#ffffff'],
        width: 1
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(1) + '%';
        },
        dropShadow: {
          enabled: false
        },
        style: {
          fontSize: '10px',
          fontFamily: "'Outfit', 'Sarabun', sans-serif",
          fontWeight: 600
        }
      },
      legend: {
        show: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '12px',
                fontFamily: "'Outfit', 'Sarabun', sans-serif",
                color: 'var(--text-muted)'
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: "'Outfit', 'Sarabun', sans-serif",
                fontWeight: 700,
                color: 'var(--text-main)',
                formatter: function (val, opts) {
                  const originalVal = opts?.seriesIndex !== undefined && chartData[dataKey][opts.seriesIndex] 
                    ? chartData[dataKey][opts.seriesIndex].value 
                    : Number(val);
                  return isMoney 
                    ? (useShortFormat ? formatCurrency(originalVal) : `$${originalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                    : originalVal.toLocaleString();
                }
              },
              total: {
                show: true,
                showAlways: true,
                label: '',
                fontSize: '12px',
                fontFamily: "'Outfit', 'Sarabun', sans-serif",
                color: 'var(--text-muted)',
                formatter: function (w) {
                  const actualTotal = chartData[dataKey].reduce((acc, d) => acc + d.value, 0);
                  return isMoney 
                    ? (useShortFormat ? formatCurrency(actualTotal) : `$${actualTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                    : actualTotal.toLocaleString();
                }
              }
            }
          }
        }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function(val, opts) {
            const originalVal = opts?.seriesIndex !== undefined && chartData[dataKey][opts.seriesIndex] 
              ? chartData[dataKey][opts.seriesIndex].value 
              : val;
            return isMoney 
              ? (useShortFormat ? formatCurrency(originalVal) : `$${originalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) 
              : originalVal;
          }
        }
      }
    };

    return (
      <div className="glass-card" style={{ padding: '1.25rem', height: '320px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '4px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className={`fa-solid ${iconClass}`} style={{ fontSize: '12px', color: '#6366f1' }}></i>
          </div>
          {title}
        </h3>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
          {/* Chart Left (60%) */}
          <div style={{ width: '60%', height: '100%', position: 'relative' }}>
            <ReactApexChart options={options} series={series} type="donut" height="100%" />
          </div>
          {/* Labels Right (40%) */}
          <div className="chart-custom-legend" style={{ width: '40%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.625rem', paddingLeft: '0.75rem', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
            {chartData[dataKey].map((d, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', overflow: 'hidden' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length], flexShrink: 0 }}></div>
                  <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={d.name}>{d.name}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, marginLeft: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {isMoney ? (useShortFormat ? formatCurrency(d.value) : `$${d.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) : d.value}
                  </span>
                  {total > 0 && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{((Math.abs(d.value) / total) * 100).toFixed(1)}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="charts-grid animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}
    >
      {renderDonutChart('พอร์ต', 'port', 'fa-briefcase')}
      {renderDonutChart('สถานะ', 'status', 'fa-signal')}
      {renderDonutChart('หลักชะรีอะฮ์', 'shariah', 'fa-scale-balanced')}
      {renderDonutChart('ตลาด', 'market', 'fa-globe')}
      {renderDonutChart('หมวดธุรกิจ', 'sector', 'fa-building')}
      {renderDonutChart('อุตสาหกรรม', 'industry', 'fa-industry')}
      {renderDonutChart('มูลค่าตลาด', 'marketValue', 'fa-sack-dollar', true, true)}
      {renderDonutChart('ราคาหุ้น', 'stockPrice', 'fa-money-bill-trend-up', true)}
      {renderDonutChart('ยอดตั้งซื้อ', 'targetBuyAmount', 'fa-bars-progress', true)}
      {renderDonutChart('ยอดตั้งกำจัด', 'targetClearAmount', 'fa-filter', true)}
      {renderDonutChart('ยอดซื้อ', 'buyAmount', 'fa-cart-shopping', true)}
      {renderDonutChart('ยอดขาย', 'sellAmount', 'fa-hand-holding-dollar', true)}
      {renderDonutChart('ยอดปันผล', 'dividendAmount', 'fa-coins', true)}
      {renderDonutChart('ยอดภาษี', 'taxAmount', 'fa-file-invoice-dollar', true)}
      {renderDonutChart('ยอดกำจัด', 'clearAmount', 'fa-scissors', true)}
      {renderDonutChart('กำไรขาย', 'profitAmount', 'fa-arrow-trend-up', true)}
      {renderDonutChart('กำไรรวม', 'grossProfitAmount', 'fa-chart-line', true)}
      {renderDonutChart('กำไรสุทธิ', 'netIncomeAmount', 'fa-wallet', true)}
    </motion.div>
  );
}
