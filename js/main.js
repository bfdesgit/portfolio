/* ============================================
   main.js — Shared interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Inject SVG Squircle Clip Path for iOS corner smoothing (100% continuous curvature)
  const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDefs.setAttribute('width', '0');
  svgDefs.setAttribute('height', '0');
  svgDefs.style.position = 'absolute';
  svgDefs.style.pointerEvents = 'none';
  svgDefs.innerHTML = `
    <defs>
      <!-- 100% iOS Corner Smoothing Squircle -->
      <clipPath id="squircle-clip" clipPathUnits="objectBoundingBox">
        <path d="M 0.5 0 c 0.2357 0 0.3536 0 0.4268 0.0732 a 0.2500 0.2500 0 0 1 0.0000 0.0000 c 0.0732 0.0732 0.0732 0.1911 0.0732 0.4268 L 1 0.5 c 0 0.2357 0 0.3536 -0.0732 0.4268 a 0.2500 0.2500 0 0 1 -0.0000 0.0000 c -0.0732 0.0732 -0.1911 0.0732 -0.4268 0.0732 L 0.5 1 c -0.2357 0 -0.3536 0 -0.4268 -0.0732 a 0.2500 0.2500 0 0 1 -0.0000 -0.0000 c -0.0732 -0.0732 -0.0732 -0.1911 -0.0732 -0.4268 L 0 0.5 c 0 -0.2357 0 -0.3536 0.0732 -0.4268 a 0.2500 0.2500 0 0 1 0.0000 -0.0000 c 0.0732 -0.0732 0.1911 -0.0732 0.4268 -0.0732 Z"></path>
      </clipPath>
    </defs>
  `;
  document.body.appendChild(svgDefs);
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


});
