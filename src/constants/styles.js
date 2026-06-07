export const sortSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    minHeight: 'auto',
    height: '100%',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: '100px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 4px',
    color: 'var(--text-main)',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-main)',
    margin: 0,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: '100%',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: 'var(--text-muted)',
    padding: '2px',
    '&:hover': {
      color: 'var(--text-main)',
    },
    transform: state.isFocused ? 'rotate(180deg)' : 'none',
    transition: 'transform 0.2s ease',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 30px -10px rgba(31, 38, 135, 0.15)',
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'var(--primary)' 
      : state.isFocused 
        ? 'rgba(99, 102, 241, 0.08)' 
        : 'transparent',
    color: state.isSelected ? '#ffffff' : 'var(--text-main)',
    fontWeight: state.isSelected ? '700' : '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    padding: '6px 12px',
    '&:active': {
      backgroundColor: state.isSelected ? 'var(--primary)' : 'rgba(99, 102, 241, 0.15)',
    }
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--text-main)',
    margin: 0,
    padding: 0,
  }),
};

export const statusSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '100%',
    padding: '0.125rem 0.375rem',
    borderRadius: '0.75rem',
    border: state.isFocused 
      ? '1px solid var(--primary)' 
      : '1px solid rgba(255, 255, 255, 0.8)',
    borderBottomColor: state.isFocused 
      ? 'var(--primary)' 
      : 'rgba(255, 255, 255, 0.4)',
    backgroundColor: state.isFocused 
      ? 'rgba(255, 255, 255, 0.85)' 
      : 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(8px)',
    color: 'var(--text-main)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    fontWeight: '600',
    boxShadow: state.isFocused 
      ? '0 0 0 3px rgba(99, 102, 241, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.9)' 
      : 'inset 0 1px 2px rgba(255,255,255,0.4)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    cursor: 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--primary)' : 'rgba(255, 255, 255, 0.9)',
    }
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-main)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#94a3b8',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: 'var(--text-muted)',
    transform: state.isFocused ? 'rotate(180deg)' : 'none',
    transition: 'transform 0.2s ease',
    '&:hover': {
      color: 'var(--text-main)',
    }
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: 'var(--text-muted)',
    '&:hover': {
      color: 'var(--error)',
    }
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 30px -10px rgba(31, 38, 135, 0.15)',
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'var(--primary)' 
      : state.isFocused 
        ? 'rgba(99, 102, 241, 0.08)' 
        : 'transparent',
    color: state.isSelected ? '#ffffff' : 'var(--text-main)',
    fontWeight: state.isSelected ? '700' : '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    padding: '8px 12px',
    '&:active': {
      backgroundColor: state.isSelected ? 'var(--primary)' : 'rgba(99, 102, 241, 0.15)',
    }
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--text-main)',
  }),
};
