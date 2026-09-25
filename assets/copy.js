if (navigator.clipboard) {
  document.querySelectorAll('[aria-labelledby="prompt-title"] pre').forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'prompt-copy';
    pre.before(wrapper);
    wrapper.append(pre);
    pre.tabIndex = 0;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';
    button.textContent = 'コピー';
    button.setAttribute('aria-live', 'polite');
    wrapper.append(button);
    let timer;
    button.addEventListener('click', async () => {
      clearTimeout(timer);
      try {
        await navigator.clipboard.writeText(pre.textContent);
        button.textContent = 'コピーしました';
      } catch {
        button.textContent = 'コピーできませんでした';
      }
      timer = setTimeout(() => { button.textContent = 'コピー'; }, 2000);
    });
  });
}
