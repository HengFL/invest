import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate, getRelativeTime } from '../utils/dateUtils';

export default function InteractiveTime({ label, dateStr, colorClass, customDisplay, customStyle }) {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  if (!dateStr) return null;

  const formattedDate = formatDate(dateStr);
  const relativeTime = getRelativeTime(dateStr);
  
  const displayVal = customDisplay || relativeTime || formattedDate;

  return (
    <div className={colorClass} style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', position: 'relative' }}>
      {label && <span className="detail-label" style={{ fontSize: '0.7rem' }}>{label}</span>}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} ref={popoverRef}>
        <span 
          className="relative-time" 
          onClick={(e) => {
            e.stopPropagation();
            setShowPopover(!showPopover);
          }}
          style={{ 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            padding: '0.2rem 0.6rem',
            borderRadius: '20px',
            transition: 'background 0.2s',
            userSelect: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            ...customStyle
          }}
          title="คลิกเพื่อดูวันที่"
        >
          {displayVal}
        </span>
        
        <AnimatePresence>
          {showPopover && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                background: '#1e293b',
                color: '#ffffff',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                zIndex: 10,
              }}
            >
              {formattedDate}
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '5px solid #1e293b'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
