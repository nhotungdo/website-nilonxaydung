"use client";

import { useEffect, useRef } from "react";

interface CloudParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  colorType: 'primary' | 'accent' | 'light';
}

export default function CloudCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Check if device is touch-primary / mobile screen
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

    if (prefersReducedMotion || isTouchDevice) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const particles: CloudParticle[] = [];
    const MAX_PARTICLES = 45;

    // Mouse tracking state with lerp
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let lastSpawnTime = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (currentX === -1000) {
        currentX = targetX;
        currentY = targetY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const createCloudParticle = (x: number, y: number): CloudParticle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.0 + 0.3;
      const types: ('primary' | 'accent' | 'light')[] = ['primary', 'accent', 'light'];

      return {
        x: x + (Math.random() - 0.5) * 24,
        y: y + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed * 0.5,
        vy: Math.sin(angle) * speed * 0.5 - 0.3, // slight upward float
        radius: Math.random() * 30 + 40, // Bigger initial cloud radius (40px - 70px)
        maxRadius: Math.random() * 50 + 75, // Expands up to (75px - 125px)
        alpha: Math.random() * 0.18 + 0.18,
        maxAlpha: Math.random() * 0.18 + 0.18,
        life: 0,
        maxLife: Math.random() * 40 + 45, // ~0.8s - 1.4s at 60fps
        colorType: types[Math.floor(Math.random() * types.length)]
      };
    };

    const render = (time: number) => {
      // Smooth lerp follow
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Spawn new particles if mouse moved
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const dist = Math.hypot(dx, dy);

      if (dist > 2 && time - lastSpawnTime > 25 && particles.length < MAX_PARTICLES) {
        particles.push(createCloudParticle(currentX, currentY));
        lastSpawnTime = time;
      }

      ctx.globalCompositeOperation = "lighter";

      // Update and draw cloud particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        const currentRadius = p.radius + (p.maxRadius - p.radius) * progress;
        const currentAlpha = p.maxAlpha * (1 - Math.pow(progress, 1.5));

        if (progress >= 1 || currentAlpha <= 0.005) {
          particles.splice(i, 1);
          continue;
        }

        // Draw soft radial cloud gradient
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, currentRadius
        );

        if (p.colorType === 'primary') {
          gradient.addColorStop(0, `rgba(43, 108, 176, ${currentAlpha * 0.8})`);
          gradient.addColorStop(0.4, `rgba(99, 179, 237, ${currentAlpha * 0.4})`);
          gradient.addColorStop(1, "rgba(43, 108, 176, 0)");
        } else if (p.colorType === 'accent') {
          gradient.addColorStop(0, `rgba(99, 179, 237, ${currentAlpha * 0.9})`);
          gradient.addColorStop(0.5, `rgba(43, 108, 176, ${currentAlpha * 0.3})`);
          gradient.addColorStop(1, "rgba(99, 179, 237, 0)");
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.7})`);
          gradient.addColorStop(0.5, `rgba(99, 179, 237, ${currentAlpha * 0.3})`);
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        }

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none fixed inset-0 z-30 w-full h-full"
      aria-hidden="true"
    />
  );
}
