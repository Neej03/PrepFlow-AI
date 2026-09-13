'use client';

import React, { useEffect, useRef } from 'react';

const FLOATING_TEXTS = [
  'P(A|B) = P(A ∩ B) / P(B)',
  'E = mc²',
  'O(n log n)',
  'W_new = W_old - η∇L',
  '∫ f(x) dx',
  '∇ × B = μ₀J',
  'Softmax(z_i)',
  'Eigenvalues λ',
  'f\'(x) = lim Δx→0',
  'Law of Large Numbers',
  'Convex Loss Landscape',
  'Neural Networks',
  'Chain Rule ∂L/∂w',
  'NPV = ∑ [CF_t / (1+r)^t]',
  'Backpropagation',
  'P(X = k) = (n choose k) p^k (1-p)^(n-k)',
  'σ(z) = 1 / (1 + e^-z)',
  'Matrix Rank & Determinant',
];

interface TextNode {
  id: number;
  text: string;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  fontSize: number;
  opacity: number;
  angle: number;
  rotationSpeed: number;
}

export const BackgroundParticles: React.FC = () => {
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

    // Particle nodes
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(168, 85, 247, ',
    }));

    // Floating text nodes
    const textNodes: TextNode[] = FLOATING_TEXTS.map((text, i) => ({
      id: i,
      text,
      x: Math.random() * width,
      y: Math.random() * height,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      fontSize: Math.floor(Math.random() * 4) + 11,
      opacity: Math.random() * 0.15 + 0.08,
      angle: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color + '0.4)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Render floating moving random text
      textNodes.forEach((node) => {
        node.x += node.speedX;
        node.y += node.speedY;
        node.angle += node.rotationSpeed;

        if (node.x < -150) node.x = width + 50;
        if (node.x > width + 150) node.x = -150;
        if (node.y < -50) node.y = height + 50;
        if (node.y > height + 50) node.y = -50;

        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate((node.angle * Math.PI) / 180);
        ctx.font = `${node.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
        ctx.fillStyle = `rgba(99, 102, 241, ${node.opacity})`;
        ctx.fillText(node.text, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-full h-full opacity-70"
    />
  );
};
