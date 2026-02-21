import { useEffect, useRef } from "react";

export default function PetalsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let petals = [];
    const petalCount = 20;

    const resize = () => {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = document.documentElement.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = 8 + Math.random() * 12;
        this.speed = 0.5 + Math.random() * 1;
        this.opacity = 0.15 + Math.random() * 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.01;
      }

      update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 0.3;
        this.angle += this.spin;

        if (this.y > canvas.height) {
          this.reset();
          this.y = -10;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(141, 170, 145, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        maxWidth: "100%",
        maxHeight: "100%",
        zIndex: 1,
      }}
    />
  );
}
