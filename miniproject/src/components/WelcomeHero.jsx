import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Login from "./Login";
import food1 from "../assets/food-1.jpg";
import food2 from "../assets/food-2.jpg";
import food3 from "../assets/food-3.jpg";
import food4 from "../assets/food-4.jpg";


const images = [food1, food2, food3, food4];

export default function WelcomeHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Slideshow background */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: i === currentIndex ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
            transform: "scale(1.05)",
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        {/* Decorative line */}
        <div className="h-px w-24 bg-[#FFFDD0]" />

        <p
          className="text-sm uppercase tracking-[0.4em] text-muted-foreground text-[#e2c2b1]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Est. 2026
        </p>

        <h1
          className="text-4xl font-bold text-[#FFFDD0] leading-tight tracking-wide text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome to
          <br />
          <span className="text-primary">RAYA'S KITCHEN</span>
        </h1>

        <p
          className="max-w-md text-base text-[#e2c2b1] text-muted-foreground sm:text-lg"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Where every dish tells a story
        </p>

        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-[#FFFDD0] text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <div className="p-2 m-2 bg-amber-500 border rounded-3xl">
          GET STARTED
          </div>
        </Link>

        {/* Decorative line */}
        <div className="h-px w-24 bg-[#FFFDD0]" />

        {/* Slide indicators */}
        <div className="mt-4 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: i === currentIndex ? "2rem" : "0.5rem",
                backgroundColor:
                  i === currentIndex
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                opacity: i === currentIndex ? 1 : 0.4,
              }}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
