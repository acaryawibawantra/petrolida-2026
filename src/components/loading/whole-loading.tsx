"use client";
import { useCallback, useEffect, useState } from "react";
import NextImage from "../next-image";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  image: string;
  velocityX: number;
  velocityY: number;
  life: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
}

interface WholeLoadingPageProps {
  opacity?: number; // 0 to 1, default 1 (full opacity)
}

const WholeLoadingPage = ({ opacity = 1 }: WholeLoadingPageProps) => {
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [lastParticleTime, setLastParticleTime] = useState(0);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const particleImages = [
    "/loading/1.png",
    "/loading/2.png",
    "/loading/3.png",
    "/loading/4.png",
    "/loading/5.png",
    "/loading/6.png",
    "/loading/7.png",
    "/loading/8.png",
    "/loading/9.png",
    "/loading/10.png",
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 2 + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastParticleTime < 100) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isComplete) return;

      const randomImage =
        particleImages[Math.floor(Math.random() * particleImages.length)];

      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x,
        y,
        size: Math.random() * 150 + 20,
        image: randomImage,
        velocityX: (Math.random() - 0.5) * 6,
        velocityY: (Math.random() - 0.5) * 6,
        life: 1.5,
        decay: Math.random() * 0.025 + 0.003,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
      };

      setParticles((prev) => [...prev.slice(-20), newParticle]);
      setLastParticleTime(currentTime);
    },
    [isComplete, particleImages, lastParticleTime],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocityX * 0.8,
            y: particle.y + particle.velocityY * 0.8,
            life: particle.life - particle.decay,
            rotation: particle.rotation + particle.rotationSpeed * 0.5,
          }))
          .filter((particle) => particle.life > 0),
      );
    }, 32);

    return () => clearInterval(interval);
  }, []);

  if (windowWidth === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .loading-background {
          background-image: url('/images/loading/bg.png');
        }
        
        @media (max-width: 768px) {
          .loading-background {
            background-image: url('/images/loading/bg-mobile.png');
          }
        }
      `}</style>

      <div
        className="loading-background fixed inset-0 z-[9999] flex min-h-screen w-full select-none items-center justify-center overflow-hidden"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: opacity,
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Particles */}
        <div className="absolute inset-0 z-10">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="pointer-events-none absolute flex items-center justify-center text-center"
              style={{
                left: particle.x - particle.size / 2,
                top: particle.y - particle.size / 2,
                width: particle.size,
                height: particle.size,
                opacity: particle.life,
                transform: `scale(${particle.life}) rotate(${particle.rotation}deg)`,
                filter: `drop-shadow(0 0 10px rgba(255,255,255,0.5))`,
              }}
            >
              <NextImage
                src={particle.image}
                alt="particle"
                width={300}
                height={300}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>

        <div className="relative z-20 flex items-center justify-center md:justify-center">
          <h1
            className="animate-pulse"
            style={{
              transform:
                windowWidth <= 768
                  ? "rotate(-8deg) translateY(80px)"
                  : "rotate(-8deg) translateX(50px) translateY(20px)",
              color: "#26505C",
              textAlign: "center",
              WebkitTextStrokeWidth: "2px",
              WebkitTextStrokeColor: "#F9C313",
              fontFamily: "var(--font-melodrame)",
              fontSize: "clamp(150px, 8vw, 200px)",
              fontStyle: "bold",
              fontWeight: 900,
              lineHeight: "normal",
              letterSpacing: "clamp(2px, 1vw, 6.8px)",
            }}
          >
            {Math.round(progress)}%
          </h1>
        </div>
      </div>
    </>
  );
};

export default WholeLoadingPage;
