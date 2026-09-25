// Pixel works scale themselves by whole multiples only; size the iframe to that exact multiple so no black letterbox shows.
const fit = () => document.querySelectorAll('iframe[data-pixel]').forEach(f => {
  const [w, h] = f.dataset.pixel.split('x').map(Number), d = devicePixelRatio || 1;
  const s = Math.max(1, Math.floor(f.parentElement.parentElement.clientWidth * d / w));
  f.style.width = Math.ceil(w * s / d) + 'px';
  f.style.height = Math.ceil(h * s / d) + 'px';
});
fit();
addEventListener('resize', fit);
