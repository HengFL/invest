import React from 'react';
import { motion } from 'framer-motion';

export default function SummaryCard({ label, value, subValue, icon, delay, numValue, colorMode = 'financial', iconBgColor }) {
  const getValueColor = () => {
    if (numValue === undefined || numValue === null) return '';
    if (numValue < 0) return 'color-red';
    if (colorMode === 'binary') {
      return numValue === 0 ? 'color-grey' : 'color-black';
    }
    if (colorMode === 'orange') {
      return numValue === 0 ? 'color-grey' : 'color-orange';
    }
    if (colorMode === 'financial-dark') {
      if (numValue === 0) return 'color-grey';
      if (numValue > 0) return 'color-green-dark';
      return 'color-red';
    }
    if (numValue === 0) return 'color-grey';
    if (numValue > 0) return 'color-green';
    return 'color-red';
  };

  return (
    <motion.div 
      className="glass-card summary-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <span className="summary-label">{label}</span>
        <div style={{ background: iconBgColor || '#f1f5f9', padding: '4px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <div className={`summary-value ${getValueColor()}`}>{value}</div>
      {subValue && (
        <div className={`summary-sub-value ${getValueColor()}`}>{subValue}</div>
      )}
    </motion.div>
  );
}
