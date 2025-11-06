
export function askForHeight(onSubmit, onCancel) {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.step = '0.1';
  input.placeholder = 'Enter building height (m)';
  Object.assign(input.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#fff',
    zIndex: 9999,
  });

  document.body.appendChild(input);
  input.focus();

  function handleKey(e) {
    if (e.key === 'Enter') {
      const val = parseFloat(input.value);
      document.body.removeChild(input);
      window.removeEventListener('keydown', handleKey);
      if (!isNaN(val) && val >= 0) {
        onSubmit(val);
      } else {
        onCancel('invalid input');
      }
    } else if (e.key === 'Escape') {
      document.body.removeChild(input);
      window.removeEventListener('keydown', handleKey);
      onCancel("escaped");
    }
  }

  window.addEventListener('keydown', handleKey);
}
