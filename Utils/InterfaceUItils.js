
export function askForHeight(onSubmit, onCancel) {
  document.getElementById('create-building-infobox').style.display = 'flex';
  const input = document.getElementById('building-height-input');
  input.focus();
  const button = document.getElementById('building-info-button');
  function handleKey(e) {
    if (e.key === 'Enter') {
      handleClick();
    } else if (e.key === 'Escape') {
      document.body.removeChild(input);
      window.removeEventListener('keydown', handleKey);
      button.removeEventListener('click', handleClick);
      onCancel("escaped");
    }
  }
  function handleClick() {
    const val = parseFloat(input.value);
    document.getElementById('create-building-infobox').style.display = 'none';
    window.removeEventListener('keydown', handleKey);
    button.removeEventListener('click', handleClick);
    if (!isNaN(val) && val >= 0) {
      onSubmit(val / 10);
    } else {
      onCancel('invalid input');
    }
  }
  button.addEventListener('click', handleClick);
  window.addEventListener('keydown', handleKey);

}
