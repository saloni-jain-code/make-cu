'use client';
import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkle: number;
}

export default function ParallaxStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const scrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Create stars
    const createStars = () => {
      const stars: Star[] = [];
      const numStars = 150;

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 2, // Make field taller for scrolling
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.5 + 0.1, // Different parallax speeds
          opacity: Math.random() * 0.8 + 0.2,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    };

    // Handle scroll for parallax effect
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        // Apply parallax based on scroll and star speed
        const parallaxY = star.y - scrollY.current * star.speed;
        
        // Wrap stars around when they go off screen
        let wrappedY = parallaxY;
        if (parallaxY < -star.size) {
          wrappedY = canvas.height + star.size;
          star.y = canvas.height + scrollY.current * star.speed + star.size;
        } else if (parallaxY > canvas.height + star.size) {
          wrappedY = -star.size;
          star.y = scrollY.current * star.speed - star.size;
        }

        // Twinkling effect
        star.twinkle += 0.02;
        const twinkleOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle));

        // Draw star
        ctx.save();
        ctx.globalAlpha = twinkleOpacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, wrappedY, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow for larger stars
        if (star.size > 1.5) {
          ctx.globalAlpha = twinkleOpacity * 0.3;
          ctx.beginPath();
          ctx.arc(star.x, wrappedY, star.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    createStars();
    animate();

    // Event listeners
    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars();
    });
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}