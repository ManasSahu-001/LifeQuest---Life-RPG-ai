import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext.js';
import { FogCanvas } from './FogCanvas.js';
import { ParticleSporeCanvas } from './ParticleSporeCanvas.js';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  angle: number;
  rotationSpeed: number;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentThemeId } = useTheme();

  if (currentThemeId === 'theme-g') {
    return <FogCanvas />;
  }
  if (currentThemeId === 'theme-h') {
    return <ParticleSporeCanvas />;
  }

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

    // Dynamic particle count optimized for mobile and desktop
    const isMobile = window.innerWidth < 768;
    const baseCount = isMobile ? 25 : 45;
    const particleCount = currentThemeId === 'theme-e' ? baseCount + 10 : baseCount;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        speedX: currentThemeId === 'theme-e' ? Math.random() * 1.5 + 0.5 : (Math.random() - 0.5) * 0.6,
        speedY: currentThemeId === 'theme-e' ? Math.random() * 1.2 + 0.8 : (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.rotationSpeed;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);

        if (currentThemeId === 'theme-d') {
          // Theme D: Enchanted Forest - Bioluminescent spores
          ctx.beginPath();
          const pulse = (Math.sin(Date.now() * 0.002 + p.x) + 1) / 2;
          const currentRadius = p.radius * (0.8 + pulse * 0.6);
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);

          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius * 2.5);
          gradient.addColorStop(0, `rgba(52, 211, 153, ${p.opacity})`);
          gradient.addColorStop(0.5, `rgba(16, 185, 129, ${p.opacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

          ctx.fillStyle = gradient;
          ctx.fill();
        } else if (currentThemeId === 'theme-e') {
          // Theme E: Last Samurai - Falling Sakura petals
          ctx.rotate(p.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 2.2, p.radius * 1.1, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(244, 114, 182, ${p.opacity * 0.75})`;
          ctx.fill();
        } else if (currentThemeId === 'theme-f') {
          // Theme F: Build Your City - Cyber blueprint sparks
          ctx.beginPath();
          ctx.rect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          ctx.fillStyle = p.radius > 2 ? `rgba(14, 165, 233, ${p.opacity})` : `rgba(245, 158, 11, ${p.opacity * 0.7})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#38bdf8';
          ctx.fill();
        } else if (currentThemeId === 'theme-b') {
          // Theme B: High Fantasy - Golden stardust
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity * 0.8})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#f0c048';
          ctx.fill();
        } else if (currentThemeId === 'theme-c') {
          // Theme C: Solarpunk - Sunlit chlorophyll motes
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity * 0.7})`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#34d399';
          ctx.fill();
        } else {
          // Theme A: Cyberpunk Synthwave - Neon cyan sparks
          ctx.beginPath();
          ctx.rect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          ctx.fillStyle = p.radius > 2 ? `rgba(0, 240, 255, ${p.opacity})` : `rgba(255, 0, 127, ${p.opacity * 0.8})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00f0ff';
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentThemeId]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
