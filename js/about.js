/* ============================================
   about.js — Hover image reveal follow cursor for bio blocks
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  const triggers = document.querySelectorAll('.about__block-trigger');

  triggers.forEach((trigger, index) => {
    const imgContainer = trigger.querySelector('.about__hover-image');
    if (!imgContainer) return;

    // Rotation angle: alternate between positive and negative (slight angle: 4 degrees)
    const rotationAngle = index % 2 === 0 ? 4 : -4;

    // Desktop Hover: Mouse Enter
    const onMouseEnter = (e) => {
      if (window.innerWidth <= 1024) return;
      const rect = trigger.getBoundingClientRect();
      const initialX = e.clientX - rect.left;
      const initialY = e.clientY - rect.top;

      gsap.set(imgContainer, {
        x: initialX,
        y: initialY,
        xPercent: -50,
        yPercent: -50,
        scale: 0.8,
        rotation: 0
      });

      gsap.to(imgContainer, {
        opacity: 1,
        scale: 1,
        rotation: rotationAngle,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    // Desktop Hover: Mouse Move
    const onMouseMove = (e) => {
      if (window.innerWidth <= 1024) return;
      const rect = trigger.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(imgContainer, {
        x: x,
        y: y,
        duration: 0.4,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    };

    // Desktop Hover: Mouse Leave
    const onMouseLeave = () => {
      if (window.innerWidth <= 1024) return;
      gsap.to(imgContainer, {
        opacity: 0,
        scale: 0.8,
        rotation: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        overwrite: 'auto'
      });
    };

    // Mobile/Tablet: Click (Tap) Trigger with 0.5s delay before fade-out
    const onClick = (e) => {
      if (window.innerWidth > 1024) return;

      const rect = trigger.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Position the container at click location
      gsap.set(imgContainer, {
        x: clickX,
        y: clickY,
        xPercent: -50,
        yPercent: -50,
        scale: 0.8,
        rotation: 0
      });

      // Timeline to fade in, wait 0.5s, then fade out
      const tl = gsap.timeline({ overwrite: 'auto' });
      tl.to(imgContainer, {
        opacity: 1,
        scale: 1,
        rotation: rotationAngle,
        duration: 0.45,
        ease: 'power2.out'
      })
      .to(imgContainer, {
        opacity: 0,
        scale: 0.8,
        rotation: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        delay: 0.5 // Delay 0.5 seconds before starting the fade-out
      });
    };

    // Attach listeners
    trigger.addEventListener('mouseenter', onMouseEnter);
    trigger.addEventListener('mousemove', onMouseMove);
    trigger.addEventListener('mouseleave', onMouseLeave);
    trigger.addEventListener('click', onClick);
  });
});
