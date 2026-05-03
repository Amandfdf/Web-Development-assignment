/* ============================================================
   FOLIO BLOG — script.js
   All JavaScript functionality for the blog website.
   ============================================================ */

/* ============================================================
   1. BLOG DATA
   Array of blog post objects used to dynamically render cards.
   ============================================================ */
const blogPosts = [
  {
    id: 1,
    title: "The Quiet Revolution of Ambient Computing",
    description:
      "Technology is disappearing into the background of our lives — and that might be the best thing that's ever happened to us. A deep look at calm tech.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    author: "Ananya Sharma",
    date: "May 1, 2025",
    readTime: "7 min read",
  },
  {
    id: 2,
    title: "Slow Travel: Why I Stopped Collecting Countries",
    description:
      "After visiting 40 countries in three years I felt empty. Staying in one place for three months changed my relationship with travel forever.",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
    author: "Marco Ricci",
    date: "Apr 24, 2025",
    readTime: "9 min read",
  },
  {
    id: 3,
    title: "The Art of Doing Nothing: A Case for Boredom",
    description:
      "Our addiction to stimulation is killing creativity. Neuroscience says boredom is when the brain's best work begins. Here's how to reclaim it.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    author: "Priya Nair",
    date: "Apr 18, 2025",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Design Systems Are Product Strategy",
    description:
      "Most teams treat design systems as a component library. The best ones use them as a competitive moat. A conversation about what separates the two.",
    category: "Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    author: "Kai Nakamura",
    date: "Apr 10, 2025",
    readTime: "8 min read",
  },
  {
    id: 5,
    title: "Tokyo in Cherry Blossom Season: A First-Timer's Guide",
    description:
      "Crowds, timing, hidden spots, and the unexpected philosophy behind hanami — everything I wish I'd known before my first April in Japan.",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&q=80",
    author: "Sara Chen",
    date: "Apr 3, 2025",
    readTime: "11 min read",
  },
  {
    id: 6,
    title: "Open Source AI: The Democratization We Didn't Expect",
    description:
      "A year ago, cutting-edge AI required billion-dollar compute budgets. Today, powerful models run on a laptop. What does that mean for the future?",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    author: "Rahul Mehta",
    date: "Mar 28, 2025",
    readTime: "10 min read",
  },
  {
    id: 7,
    title: "The Morning Ritual That Actually Works",
    description:
      "Forget 5AM wake-ups and ice baths. The research on effective morning routines points to something far simpler — and deeply personal.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    author: "Priya Nair",
    date: "Mar 20, 2025",
    readTime: "5 min read",
  },
  {
    id: 8,
    title: "Typography in the Age of Variable Fonts",
    description:
      "Variable fonts promised to change web typography forever. Five years in, are designers actually using them? An honest assessment.",
    category: "Design",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    author: "Kai Nakamura",
    date: "Mar 14, 2025",
    readTime: "7 min read",
  },
  {
    id: 9,
    title: "How I Learned to Cook by Eating Alone in Bologna",
    description:
      "A week of eating solo in Italy's food capital, watching strangers cook, and making friends with a 72-year-old nonna who changed my kitchen forever.",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    author: "Marco Ricci",
    date: "Mar 7, 2025",
    readTime: "12 min read",
  },
];

/* ============================================================
   2. STATE
   Tracks the current category filter and search query.
   ============================================================ */
let currentCategory = "all";
let currentSearch   = "";

/* ============================================================
   3. DOM REFERENCES
   Cache frequently accessed elements for performance.
   ============================================================ */
const blogGrid     = document.getElementById("blogGrid");
const emptyState   = document.getElementById("emptyState");
const searchInput  = document.getElementById("searchInput");
const searchClear  = document.getElementById("searchClear");
const categoryBtns = document.querySelectorAll(".category-btn");
const header       = document.getElementById("header");
const hamburger    = document.getElementById("hamburger");
const navLinks     = document.getElementById("navLinks");
const themeToggle  = document.getElementById("themeToggle");
const backToTop    = document.getElementById("backToTop");
const footerYear   = document.getElementById("footerYear");

/* ============================================================
   4. LOADING SCREEN
   Hides the loading overlay once the page is ready.
   ============================================================ */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  // Give the animation time to complete before removing
  setTimeout(() => {
    loader.classList.add("hidden");
    // Once loader is gone, trigger initial reveal animations
    triggerReveal();
  }, 1600);
});

/* ============================================================
   5. RENDER BLOG CARDS
   Filters posts by category + search, then renders the grid.
   ============================================================ */
function renderBlogs() {
  // Filter posts
  const filtered = blogPosts.filter((post) => {
    const matchesCategory =
      currentCategory === "all" || post.category === currentCategory;

    const matchesSearch =
      currentSearch === "" ||
      post.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      post.description.toLowerCase().includes(currentSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Clear current grid
  blogGrid.innerHTML = "";

  if (filtered.length === 0) {
    // Show empty state
    emptyState.hidden = false;
    blogGrid.hidden   = true;
    return;
  }

  // Hide empty state, show grid
  emptyState.hidden = false; // keep in DOM for aria-live
  emptyState.hidden = true;
  blogGrid.hidden   = false;

  // Create and append a card for each filtered post
  filtered.forEach((post, index) => {
    const card = createCard(post, index);
    blogGrid.appendChild(card);
  });
}

/* ============================================================
   6. CREATE BLOG CARD
   Builds a single card DOM element from a post object.
   ============================================================ */
function createCard(post, index) {
  // Generate author initials for the avatar fallback
  const initials = post.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Build card element
  const card = document.createElement("article");
  card.className = "blog-card";
  card.style.animationDelay = `${index * 60}ms`;
  card.setAttribute("aria-label", `Blog post: ${post.title}`);

  card.innerHTML = `
    <!-- Card Image -->
    <div class="blog-card__img-wrap">
      <img
        class="blog-card__img"
        src="${post.image}"
        alt="${post.title}"
        loading="lazy"
      />
      <span class="blog-card__category">${post.category}</span>
    </div>

    <!-- Card Body -->
    <div class="blog-card__body">
      <div class="blog-card__meta">
        <span>${post.date}</span>
        <span class="blog-card__meta-dot"></span>
        <span>${post.readTime}</span>
      </div>

      <h3 class="blog-card__title">${post.title}</h3>
      <p class="blog-card__desc">${post.description}</p>
    </div>

    <!-- Card Footer -->
    <div class="blog-card__footer">
      <div class="blog-card__author">
        <div class="blog-card__avatar" aria-hidden="true">${initials}</div>
        <span>${post.author}</span>
      </div>
      <a href="#" class="blog-card__read-more" aria-label="Read more: ${post.title}">
        Read More →
      </a>
    </div>
  `;

  return card;
}

/* ============================================================
   7. SEARCH FUNCTIONALITY
   Filters blog posts in real-time as the user types.
   ============================================================ */
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value.trim();

  // Show/hide clear button
  searchClear.hidden = currentSearch === "";

  renderBlogs();
});

// Clear button resets the search
searchClear.addEventListener("click", () => {
  searchInput.value = "";
  currentSearch     = "";
  searchClear.hidden = true;
  searchInput.focus();
  renderBlogs();
});

/* ============================================================
   8. CATEGORY FILTER
   Switches active category and re-renders the grid.
   ============================================================ */
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button state
    categoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Update state and re-render
    currentCategory = btn.dataset.category;
    renderBlogs();
  });
});

/* ============================================================
   9. MOBILE NAVIGATION (HAMBURGER MENU)
   Toggles the nav overlay on small screens.
   ============================================================ */
hamburger.addEventListener("click", () => {
  const isOpen = hamburger.getAttribute("aria-expanded") === "true";

  hamburger.setAttribute("aria-expanded", String(!isOpen));
  navLinks.classList.toggle("open", !isOpen);

  // Prevent background scroll when menu is open
  document.body.style.overflow = isOpen ? "" : "hidden";
});

// Close mobile menu when a nav link is clicked
navLinks.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  });
});

// Close menu on outside click (overlay)
document.addEventListener("click", (e) => {
  if (
    navLinks.classList.contains("open") &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  }
});

/* ============================================================
   10. DARK MODE TOGGLE
   Persists theme preference to localStorage.
   ============================================================ */
// Load saved preference on startup
(function initTheme() {
  const saved = localStorage.getItem("folio-theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
})();

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next    = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("folio-theme", next);
});

/* ============================================================
   11. SCROLL-AWARE HEADER
   Adds a "scrolled" class to the header once the user scrolls.
   Also manages the active nav link based on section in view.
   ============================================================ */
function onScroll() {
  // Sticky header shadow
  if (window.scrollY > 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Back-to-top visibility
  backToTop.hidden = window.scrollY < 400;

  // Active nav link based on scroll position
  const sections = document.querySelectorAll("section[id]");
  let currentSection = "";

  sections.forEach((sec) => {
    const top    = sec.offsetTop - 120;
    const height = sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      currentSection = sec.id;
    }
  });

  document.querySelectorAll(".nav__link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

/* ============================================================
   12. BACK-TO-TOP BUTTON
   Smooth scroll to the top of the page.
   ============================================================ */
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============================================================
   13. REVEAL ON SCROLL ANIMATIONS
   Uses IntersectionObserver for performant scroll-triggered
   animations (applied via the .reveal CSS class).
   ============================================================ */
function triggerReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ============================================================
   14. ANIMATED NUMBER COUNTER (Hero stats)
   Counts up from 0 to the target number on page load.
   ============================================================ */
function animateCounters() {
  const counters = document.querySelectorAll(".stat__number[data-target]");

  counters.forEach((counter) => {
    const target   = parseInt(counter.dataset.target, 10);
    const duration = 1800; // ms
    const step     = target / (duration / 16); // ~60fps
    let current    = 0;

    const tick = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(tick);
      } else {
        counter.textContent = target;
      }
    };

    requestAnimationFrame(tick);
  });
}

/* ============================================================
   15. CONTACT FORM VALIDATION
   Client-side validation with accessible error messages.
   ============================================================ */
const contactForm    = document.getElementById("contactForm");
const nameInput      = document.getElementById("contactName");
const emailInput     = document.getElementById("contactEmail");
const messageInput   = document.getElementById("contactMessage");
const nameError      = document.getElementById("nameError");
const emailError     = document.getElementById("emailError");
const messageError   = document.getElementById("messageError");
const formSuccess    = document.getElementById("formSuccess");

// Utility: show inline error
function setError(input, errorEl, message) {
  input.classList.add("error");
  errorEl.textContent = message;
}

// Utility: clear inline error
function clearError(input, errorEl) {
  input.classList.remove("error");
  errorEl.textContent = "";
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Real-time validation: clear error on input
[nameInput, emailInput, messageInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
  });
});

// Form submit handler
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Reset previous errors
  clearError(nameInput, nameError);
  clearError(emailInput, emailError);
  clearError(messageInput, messageError);
  formSuccess.hidden = true;

  const name    = nameInput.value.trim();
  const email   = emailInput.value.trim();
  const message = messageInput.value.trim();
  let hasError  = false;

  // Validate name
  if (name.length < 2) {
    setError(nameInput, nameError, "Please enter your full name.");
    hasError = true;
  }

  // Validate email
  if (!email) {
    setError(emailInput, emailError, "Email address is required.");
    hasError = true;
  } else if (!isValidEmail(email)) {
    setError(emailInput, emailError, "Please enter a valid email address.");
    hasError = true;
  }

  // Validate message
  if (message.length < 10) {
    setError(
      messageInput,
      messageError,
      "Message must be at least 10 characters long."
    );
    hasError = true;
  }

  if (hasError) {
    // Focus the first field with an error
    const firstError = contactForm.querySelector(".form-input.error");
    if (firstError) firstError.focus();
    return;
  }

  // Simulate form submission (replace with real API call)
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.textContent = "Sending…";
  submitBtn.disabled    = true;

  setTimeout(() => {
    // Reset form
    contactForm.reset();
    submitBtn.innerHTML = `
      Send Message
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn__icon">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    `;
    submitBtn.disabled = false;
    formSuccess.hidden = false;

    // Auto-hide success message after 6 seconds
    setTimeout(() => {
      formSuccess.hidden = true;
    }, 6000);
  }, 1400);
});

/* ============================================================
   16. FOOTER YEAR
   Automatically keeps the copyright year current.
   ============================================================ */
footerYear.textContent = new Date().getFullYear();

/* ============================================================
   17. SMOOTH SCROLL FOR ANCHOR LINKS
   Handles all internal # links with a slight offset for the
   fixed header so sections aren't hidden beneath it.
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;

    e.preventDefault();

    const headerHeight = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ============================================================
   18. INIT
   Run all initialisation tasks after DOM is ready.
   ============================================================ */
(function init() {
  // Render blog posts immediately
  renderBlogs();

  // Animate the hero stat counters after a short delay
  setTimeout(animateCounters, 1800);

  // Initial scroll check (in case page is reloaded mid-scroll)
  onScroll();
})();
