/* ============================================
   about.js — Hover-reveal interaction for about page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // On touch devices, tap to reveal instead of hover
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    const revealBlocks = document.querySelectorAll('.about__block-half, .about__block');

    revealBlocks.forEach(block => {
      block.addEventListener('click', (e) => {
        // Toggle revealed state
        const wasRevealed = block.classList.contains('is-revealed');

        // Close all others
        revealBlocks.forEach(b => b.classList.remove('is-revealed'));

        // Toggle this one
        if (!wasRevealed) {
          block.classList.add('is-revealed');
        }
      });
    });
  }
});
