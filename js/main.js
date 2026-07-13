// Helper to generate a mathematically precise Figma/iOS squircle path (G2 continuous curvature)
// for any width, height, corner radius, and smoothing percentage.
function getSquirclePath(width, height, cornerRadius, cornerSmoothing) {
  const maxRadius = Math.min(width, height) / 2;
  cornerRadius = Math.min(cornerRadius, maxRadius);

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  
  let p = (1 + cornerSmoothing) * cornerRadius;
  const maxCornerSmoothing = maxRadius / cornerRadius - 1;
  const smoothing = Math.min(cornerSmoothing, maxCornerSmoothing);
  p = Math.min(p, maxRadius);

  const arcMeasure = 90 * (1 - smoothing);
  const arcSectionLength = Math.sin(toRadians(arcMeasure / 2)) * cornerRadius * Math.sqrt(2);

  const angleAlpha = (90 - arcMeasure) / 2;
  const p3ToP4Distance = cornerRadius * Math.tan(toRadians(angleAlpha / 2));

  const angleBeta = 45 * smoothing;
  const c = p3ToP4Distance * Math.cos(toRadians(angleBeta));
  const d = c * Math.tan(toRadians(angleBeta));

  const b = (p - arcSectionLength - c - d) / 3;
  const a = 2 * b;

  const f = (num) => num.toFixed(4);

  const drawTopRight = () => cornerRadius 
    ? `c ${f(a)} 0 ${f(a + b)} 0 ${f(a + b + c)} ${f(d)} a ${f(cornerRadius)} ${f(cornerRadius)} 0 0 1 ${f(arcSectionLength)} ${f(arcSectionLength)} c ${f(d)} ${f(c)} ${f(d)} ${f(b + c)} ${f(d)} ${f(a + b + c)}`
    : `l ${f(p)} 0`;

  const drawBottomRight = () => cornerRadius
    ? `c 0 ${f(a)} 0 ${f(a + b)} ${f(-d)} ${f(a + b + c)} a ${f(cornerRadius)} ${f(cornerRadius)} 0 0 1 ${f(-arcSectionLength)} ${f(arcSectionLength)} c ${f(-c)} ${f(d)} ${f(-(b + c))} ${f(d)} ${f(-(a + b + c))} ${f(d)}`
    : `l 0 ${f(p)}`;

  const drawBottomLeft = () => cornerRadius
    ? `c ${f(-a)} 0 ${f(-(a + b))} 0 ${f(-(a + b + c))} ${f(-d)} a ${f(cornerRadius)} ${f(cornerRadius)} 0 0 1 ${f(-arcSectionLength)} ${f(-arcSectionLength)} c ${f(-d)} ${f(-c)} ${f(-d)} ${f(-(b + c))} ${f(-d)} ${f(-(a + b + c))}`
    : `l ${f(-p)} 0`;

  const drawTopLeft = () => cornerRadius
    ? `c 0 ${f(-a)} 0 ${f(-(a + b))} ${f(d)} ${f(-(a + b + c))} a ${f(cornerRadius)} ${f(cornerRadius)} 0 0 1 ${f(arcSectionLength)} ${f(-arcSectionLength)} c ${f(c)} ${f(-d)} ${f(b + c)} ${f(-d)} ${f(a + b + c)} ${f(-d)}`
    : `l 0 ${f(-p)}`;

  return `
    M ${f(width - p)} 0
    ${drawTopRight()}
    L ${f(width)} ${f(height - p)}
    ${drawBottomRight()}
    L ${f(p)} ${f(height)}
    ${drawBottomLeft()}
    L 0 ${f(p)}
    ${drawTopLeft()}
    Z
  `.replace(/[\s]+/g, ' ').trim();
}

document.addEventListener('DOMContentLoaded', () => {
  // Inject SVG Squircle Clip Paths
  const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDefs.setAttribute('width', '0');
  svgDefs.setAttribute('height', '0');
  svgDefs.style.position = 'absolute';
  svgDefs.style.pointerEvents = 'none';
  svgDefs.innerHTML = `
    <defs>
      <!-- 100% iOS Corner Smoothing Squircle (Object Bound, used for 1:1 square lightbox buttons) -->
      <clipPath id="squircle-clip" clipPathUnits="objectBoundingBox">
        <path d="M 0.5 0 c 0.2357 0 0.3536 0 0.4268 0.0732 a 0.2500 0.2500 0 0 1 0.0000 0.0000 c 0.0732 0.0732 0.0732 0.1911 0.0732 0.4268 L 1 0.5 c 0 0.2357 0 0.3536 -0.0732 0.4268 a 0.2500 0.2500 0 0 1 -0.0000 0.0000 c -0.0732 0.0732 -0.1911 0.0732 -0.4268 0.0732 L 0.5 1 c -0.2357 0 -0.3536 0 -0.4268 -0.0732 a 0.2500 0.2500 0 0 1 -0.0000 -0.0000 c -0.0732 -0.0732 -0.0732 -0.1911 -0.0732 -0.4268 L 0 0.5 c 0 -0.2357 0 -0.3536 0.0732 -0.4268 a 0.2500 0.2500 0 0 1 0.0000 -0.0000 c 0.0732 -0.0732 0.1911 -0.0732 0.4268 -0.0732 Z"></path>
      </clipPath>
      <!-- Contact Button Custom Rectangular Squircle (userSpaceOnUse, prevents corner stretching) -->
      <clipPath id="squircle-clip-contact" clipPathUnits="userSpaceOnUse">
        <path d=""></path>
      </clipPath>
    </defs>
  `;
  document.body.appendChild(svgDefs);

  // Handle contact button iOS corner smoothing path updates (maintaining proportions)
  const btnContact = document.querySelector('.btn-contact');
  const contactPath = svgDefs.querySelector('#squircle-clip-contact path');
  if (btnContact && contactPath) {
    const updateContactClip = () => {
      const width = btnContact.offsetWidth;
      const height = btnContact.offsetHeight;
      
      // Figma specifications: 12px corner radius, 100% corner smoothing (1.0)
      const pathData = getSquirclePath(width, height, 12, 1.0);
      contactPath.setAttribute('d', pathData);
    };

    // Run initially
    updateContactClip();

    // Observe size changes (e.g. window resize, text loading, or hover scaling)
    const resizeObserver = new ResizeObserver(() => {
      updateContactClip();
    });
    resizeObserver.observe(btnContact);
  }

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
