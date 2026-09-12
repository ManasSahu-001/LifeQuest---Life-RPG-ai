import React, { useEffect, useRef } from 'react';

export const FogCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ethereal graveyard mist clouds
    const wisps = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: height - Math.random() * 320,
      radius: Math.random() * 120 + 80,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.08 + 0.03,
      color: Math.random() > 0.4 ? '16, 185, 129' : '139, 92, 246', // Spectral green or cursed purple
      angle: Math.random() * Math.PI * 2,
    }));

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      wisps.forEach((w) => {
        w.angle += 0.005;
        w.x += w.speedX;
        w.y += w.speedY + Math.sin(w.angle) * 0.15;

        if (w.x < -w.radius) w.x = width + w.radius;
        if (w.x > width + w.radius) w.x = -w.radius;

        const gradient = ctx.createRadialGradient(w.x, w.y, 10, w.x, w.y, w.radius);
        gradient.addColorStop(0, `rgba(${w.color}, ${w.opacity})`);
        gradient.addColorStop(0.6, `rgba(${w.color}, ${w.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${w.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
      aria-hidden="true"
    />
  );
};
