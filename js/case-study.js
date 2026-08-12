/* ============================================
   case-study.js — Scroll animations for case studies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const tl = gsap.timeline({
        delay: -0.1,
        scrollTrigger: {
          trigger: '.case__hero',
          start: 'top top',
          end: '+=300',
          scrub: 0.6, // 0.6s smooth interpolation lag
        }
      });

      // Left card animates from being rotated left and shifted right (towards center)
      tl.from('.case__hero-images .case__hero-img:nth-child(1)', {
        xPercent: 105,
        rotation: -10,
        transformOrigin: 'bottom center',
        duration: 1
      }, 0);

      // Right card animates from being rotated right and shifted left (towards center)
      tl.from('.case__hero-images .case__hero-img:nth-child(3)', {
        xPercent: -105,
        rotation: 10,
        transformOrigin: 'bottom center',
        duration: 1
      }, 0);

      // Process section cards scroll animation
      if (document.querySelector('.case__process-cards')) {
        const tlProcess = gsap.timeline({
          scrollTrigger: {
            trigger: '.case__process-cards',
            start: 'top 85%',
            end: 'bottom center',
            scrub: 0.6,
          }
        });

        tlProcess.from('.case__process-cards .info-card:nth-child(1)', {
          xPercent: 30,
          rotation: -5,
          transformOrigin: 'bottom center',
          duration: 1
        }, 0);

        tlProcess.from('.case__process-cards .info-card:nth-child(3)', {
          xPercent: -30,
          rotation: 5,
          transformOrigin: 'bottom center',
          duration: 1
        }, 0);
      }

      // Results section cards scroll animation
      if (document.querySelector('.case__results-cards')) {
        const tlResults = gsap.timeline({
          scrollTrigger: {
            trigger: '.case__results-cards',
            start: 'top 85%',
            end: 'bottom center',
            scrub: 0.6,
          }
        });

        tlResults.from('.case__results-cards .info-card:nth-child(1)', {
          xPercent: 30,
          rotation: -5,
          transformOrigin: 'bottom center',
          duration: 1
        }, 0);

        tlResults.from('.case__results-cards .info-card:nth-child(3)', {
          xPercent: -30,
          rotation: 5,
          transformOrigin: 'bottom center',
          duration: 1
        }, 0);
      }
    });
  }

  // ============================================
  // Lightbox Modal Component
  // ============================================
  const images = Array.from(document.querySelectorAll('.case img'))
    .filter(img => !img.closest('.case__next') && !img.closest('.project-card') && !img.closest('.header') && !img.closest('.footer'));

  if (images.length > 0 && typeof gsap !== 'undefined') {
    // Create Lightbox DOM Elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox__content">
        <button class="lightbox__close" aria-label="Close lightbox">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button class="lightbox__btn lightbox__btn--prev" aria-label="Previous image">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="20" y1="12" x2="4" y2="12"></line>
            <polyline points="10 18 4 12 10 6"></polyline>
          </svg>
        </button>
        <picture class="lightbox__picture">
          <source class="lightbox__source" srcset="" type="image/webp">
          <img class="lightbox__image" src="" alt="">
        </picture>
        <button class="lightbox__btn lightbox__btn--next" aria-label="Next image">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <polyline points="14 6 20 12 14 18"></polyline>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox__image');
    const lightboxSource = lightbox.querySelector('.lightbox__source');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__btn--prev');
    const nextBtn = lightbox.querySelector('.lightbox__btn--next');

    let currentIndex = 0;
    let isZoomed = false;
    let isDragging = false;
    let startX = 0, startY = 0;
    let translateX = 0, translateY = 0;

    const resetZoom = (immediate = false) => {
      if (!isZoomed) return;
      isZoomed = false;
      isDragging = false;
      translateX = 0;
      translateY = 0;
      lightbox.classList.remove('is-zoomed');
      if (immediate) {
        gsap.set(lightboxImg, { scale: 1, x: 0, y: 0 });
      } else {
        gsap.to(lightboxImg, {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.25,
          ease: 'power2.out'
        });
      }
    };

    const updateLightboxImage = () => {
      const currentImg = images[currentIndex];
      if (!currentImg) return;

      resetZoom(true); // Reset zoom immediately on image change

      const fallbackSrc = currentImg.getAttribute('src') || currentImg.src;
      let webpSrc = '';

      if (currentImg.parentElement && currentImg.parentElement.tagName.toLowerCase() === 'picture') {
        const sourceEl = currentImg.parentElement.querySelector('source[type="image/webp"]');
        if (sourceEl) {
          webpSrc = sourceEl.srcset || sourceEl.getAttribute('srcset');
        }
      }

      if (!webpSrc && /\.(png|jpe?g)$/i.test(fallbackSrc.split('?')[0])) {
        webpSrc = fallbackSrc.replace(/\.(png|jpe?g)(\?.*)?$/i, '.webp$2');
      }

      // Animate out previous image
      gsap.to(lightboxImg, {
        opacity: 0,
        scale: 0.95,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          lightboxImg.alt = currentImg.alt || 'Full size image';

          const applyImageSources = (useWebp) => {
            if (lightboxSource) {
              lightboxSource.srcset = useWebp ? webpSrc : '';
            }
            lightboxImg.src = fallbackSrc;

            lightboxImg.onload = () => {
              gsap.to(lightboxImg, {
                opacity: 1,
                scale: 1,
                duration: 0.25,
                ease: 'power2.out'
              });
            };
          };

          if (webpSrc) {
            const testImg = new Image();
            testImg.onload = () => applyImageSources(true);
            testImg.onerror = () => applyImageSources(false);
            testImg.src = webpSrc;
          } else {
            applyImageSources(false);
          }
        }
      });
    };

    const openLightbox = () => {
      updateLightboxImage();
      lightbox.classList.add('is-active');
      document.body.style.overflow = 'hidden';

      gsap.to(lightbox, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          gsap.set(lightbox, { pointerEvents: 'auto' });
        }
      });
    };

    const closeLightbox = () => {
      document.body.style.overflow = '';
      resetZoom(true); // Reset zoom immediately on close

      gsap.to(lightbox, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          lightbox.classList.remove('is-active');
          gsap.set(lightbox, { pointerEvents: 'none' });
          lightboxImg.src = '';
        }
      });
    };

    const showNextImage = () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxImage();
    };

    const showPrevImage = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    };

    // Open events
    images.forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = index;
        openLightbox();
      });
    });

    // Button controls
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextImage();
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevImage();
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox__content')) {
        closeLightbox();
      }
    });

    // Image Zoom and Pan Controls
    lightboxImg.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent backdrop close trigger
      if (!isZoomed) {
        isZoomed = true;
        lightbox.classList.add('is-zoomed');
        gsap.to(lightboxImg, {
          scale: 2.0,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        resetZoom();
      }
    });

    lightboxImg.addEventListener('mousedown', (e) => {
      if (!isZoomed) return;
      e.preventDefault();
      isDragging = true;
      lightboxImg.classList.add('is-dragging');
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;

      // Restrict panning boundary limits
      const boundX = window.innerWidth * 0.8;
      const boundY = window.innerHeight * 0.8;
      translateX = Math.max(-boundX, Math.min(boundX, translateX));
      translateY = Math.max(-boundY, Math.min(boundY, translateY));

      gsap.set(lightboxImg, { x: translateX, y: translateY });
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        lightboxImg.classList.remove('is-dragging');
      }
    });

    // Touch event listeners for mobile panning
    lightboxImg.addEventListener('touchstart', (e) => {
      if (!isZoomed) return;
      if (e.touches.length > 1) return; // Prevent interference with pinch gestures
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }, { passive: true });

    lightboxImg.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;

      const boundX = window.innerWidth * 0.8;
      const boundY = window.innerHeight * 0.8;
      translateX = Math.max(-boundX, Math.min(boundX, translateX));
      translateY = Math.max(-boundY, Math.min(boundY, translateY));

      gsap.set(lightboxImg, { x: translateX, y: translateY });
    }, { passive: true });

    lightboxImg.addEventListener('touchend', () => {
      isDragging = false;
    }, { passive: true });

    // Swipe navigation for touch screens
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      if (isZoomed) return; // Prevent navigation swipe while zooming
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        showNextImage();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        showPrevImage();
      }
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
    });
  }
});
