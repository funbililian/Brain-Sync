// Smooth scroll — Quiz nav link
document.querySelector('a[href="#categories"]')
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("categories")
      .scrollIntoView({ behavior: "smooth" });
  });

// Highlight nav link when categories section is in view
const section = document.getElementById("categories");
const quizLink = document.querySelector('a[href="#categories"]');

const observer = new IntersectionObserver(
  ([entry]) => {
    quizLink.style.color = entry.isIntersecting
      ? "var(--primary)"
      : "";
  },
  { threshold: 0.2 }
);
observer.observe(section);

// Card click ripple effect
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = card.getBoundingClientRect();

    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      background:rgba(212,164,24,.25);
      width:120px; height:120px;
      left:${e.clientX - rect.left - 60}px;
      top:${e.clientY - rect.top - 60}px;
      transform:scale(0);
      animation:ripple .5s ease-out forwards;
      pointer-events:none;
    `;
    card.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

// Ripple keyframe
const style = document.createElement("style");
style.textContent = `@keyframes ripple { to { transform:scale(3); opacity:0; } }`;
document.head.appendChild(style);
