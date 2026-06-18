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
});
