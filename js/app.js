document.addEventListener("DOMContentLoaded", () => {
  // Theme management
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Initialize theme based on system preference
  function initializeTheme() {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    function handleThemeChange() {
      const prefersDark = darkModeMediaQuery.matches;

      if (prefersDark) {
        html.setAttribute("data-theme", "dark");
        updateThemeIcon("dark");
      } else {
        html.setAttribute("data-theme", "light");
        updateThemeIcon("light");
      }
    }
    handleThemeChange();
    darkModeMediaQuery.addEventListener("change", handleThemeChange);
  }

  // Update theme toggle icon
  function updateThemeIcon(theme) {
    themeToggle.querySelector("i").className =
      theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  // Toggle theme
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    html.setAttribute("data-theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // Toggle Mobile Menu
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-links a");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  fetch("./assets/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((portfolioData) => {
      // Utility functions
      function formatDate(dateString) {
        if (dateString === "Present") return "Present";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }

      function createSocialLinks(socialData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const socialIcons = {
          github: "fab fa-github",
          linkedin: "fab fa-linkedin",
          leetcode: "fas fa-code",
          twitter: "fab fa-twitter",
          instagram: "fab fa-instagram",
        };

        container.innerHTML = "";

        Object.entries(socialData).forEach(([platform, url]) => {
          if (url && url.trim() !== "") {
            const link = document.createElement("a");
            link.href = url;
            link.className = "social-link";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.innerHTML = `<i class="${
              socialIcons[platform] || "fas fa-link"
            }"></i>`;
            container.appendChild(link);
          }
        });
      }

      function populatePortfolio() {
        // Personal info
        const { personal, social, skills, projects, experience } =
          portfolioData;

        document.getElementById("hero-name").textContent =
          "I'm " + personal.name;
        document.getElementById("hero-title").textContent = personal.title;
        document.getElementById("hero-description").textContent =
          personal.description;

        // Social links
        createSocialLinks(social, "contact-social-links");

        // Skills
        const skillsGrid = document.getElementById("skills-grid");
        skillsGrid.innerHTML = "";

        Object.entries(skills).forEach(([category, skillList]) => {
          if (skillList && skillList.length > 0) {
            const skillCategory = document.createElement("div");
            skillCategory.className = "skill-category";
            skillCategory.innerHTML = `
                                <h3>${category}</h3>
                                <div class="skills-list">
                                    ${skillList
                                      .map(
                                        (skill) =>
                                          `<span class="skill-tag">${skill}</span>`
                                      )
                                      .join("")}
                                </div>
                            `;
            skillsGrid.appendChild(skillCategory);
          }
        });

        // Projects
        const projectsGrid = document.getElementById("projects-grid");
        projectsGrid.innerHTML = "";

        projects.forEach((project) => {
          const projectCard = document.createElement("div");
          projectCard.className = "project-card";
          projectCard.innerHTML = `
                            <div class="project-content">
                                <h3 class="project-title">${project.title}</h3>
                                <p class="project-description">${
                                  project.description
                                }</p>
                                <div class="project-tech">
                                    ${project.technologies
                                      .map(
                                        (tech) =>
                                          `<span class="tech-tag">${tech}</span>`
                                      )
                                      .join("")}
                                </div>
                                <div class="project-links">
                                    ${
                                      project.github
                                        ? `<a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Code</a>`
                                        : ""
                                    }
                                    ${
                                      project.live
                                        ? `<a href="${project.live}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>`
                                        : ""
                                    }
                                </div>
                            </div>
                        `;
          projectsGrid.appendChild(projectCard);
        });

        // Experience & Education Timeline
        const timeline = document.getElementById("timeline");
        timeline.innerHTML = "";

        experience.forEach((item, index) => {
          const timelineItem = document.createElement("div");
          timelineItem.className = "timeline-item";
          timelineItem.innerHTML = `
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h3 class="timeline-title">${item.title}</h3>
                                <div class="timeline-company">${
                                  item.company
                                }</div>
                                <div class="timeline-date">${formatDate(
                                  item.startDate
                                )} - ${formatDate(item.endDate)}</div>
                                <p class="timeline-description">${
                                  item.description
                                }</p>
                            </div>
                        `;
          timeline.appendChild(timelineItem);
        });

        // Contact Info
        const contactInfo = document.getElementById("contact-info");
        contactInfo.innerHTML = `
                        <h3 style="margin-bottom: 30px; color: var(--accent-primary);">Contact Information</h3>
                        ${
                          personal.email
                            ? `
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Email</h4>
                                <p><a href="mailto:${personal.email}" style="color: var(--text-secondary); text-decoration: none;">${personal.email}</a></p>
                            </div>
                        </div>
                        `
                            : ""
                        }
                        ${
                          personal.phone
                            ? `
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Phone</h4>
                                <p><a href="tel:${personal.phone}" style="color: var(--text-secondary); text-decoration: none;">${personal.phone}</a></p>
                            </div>
                        </div>
                        `
                            : ""
                        }
                        ${
                          personal.location
                            ? `
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Location</h4>
                                <p>${personal.location}</p>
                            </div>
                        </div>
                        `
                            : ""
                        }
                        ${
                          personal.website
                            ? `
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-globe"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Website</h4>
                                <p><a href="${personal.website}" target="_blank" rel="noopener noreferrer" style="color: var(--text-secondary); text-decoration: none;">${personal.website}</a></p>
                            </div>
                        </div>
                        `
                            : ""
                        }
                    `;
      }

      // Scroll animations
      function observeElements() {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: "0px 0px -100px 0px",
          }
        );

        document.querySelectorAll(".section").forEach((section) => {
          observer.observe(section);
        });
      }

      // Smooth scrolling for navigation links
      function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
              target.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          });
        });
      }

      // Navbar scroll effect
      function setupNavbarScroll() {
        window.addEventListener("scroll", () => {
          const nav = document.querySelector("nav");
          if (window.scrollY > 100) {
            nav.style.background = "var(--nav-bg-scroll)";
          } else {
            nav.style.background = "var(--nav-bg)";
          }
        });
      }

      // Typing animation for hero text
      function setupTypingAnimation() {
        const heroName = document.getElementById("hero-name");
        const name = "I'm " + portfolioData.personal.name;
        let i = 0;

        heroName.textContent = "";

        function typeWriter() {
          if (i < name.length) {
            heroName.textContent += name.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
          }
        }

        setTimeout(typeWriter, 1000);
      }

      // Add floating animation to skill tags
      function setupSkillAnimations() {
        setTimeout(() => {
          document.querySelectorAll(".skill-tag").forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.1}s`;
            tag.style.animation = "slideInUp 0.6s ease forwards";
          });
        }, 500);
      }

      // Add stagger animation to project cards
      function setupProjectAnimations() {
        setTimeout(() => {
          document.querySelectorAll(".project-card").forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.style.animation = "slideInUp 0.8s ease forwards";
          });
        }, 300);
      }

      // Add entrance animation to timeline items
      function setupTimelineAnimations() {
        setTimeout(() => {
          document.querySelectorAll(".timeline-item").forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            item.style.animation = "slideInUp 0.6s ease forwards";
          });
        }, 200);
      }

      // Particle cursor effect
      function setupParticleEffect() {
        const particles = [];
        const maxParticles = 50;

        function createParticle(x, y) {
          const particle = document.createElement("div");
          particle.style.position = "fixed";
          particle.style.left = x + "px";
          particle.style.top = y + "px";
          particle.style.width = "4px";
          particle.style.height = "4px";
          particle.style.background = "var(--accent-primary)";
          particle.style.borderRadius = "50%";
          particle.style.pointerEvents = "none";
          particle.style.zIndex = "9999";
          particle.style.transition = "all 0.6s ease-out";
          document.body.appendChild(particle);

          setTimeout(() => {
            particle.style.opacity = "0";
            particle.style.transform = "scale(0)";
            setTimeout(() => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
              }
            }, 600);
          }, 100);
        }

        let lastTime = 0;
        document.addEventListener("mousemove", (e) => {
          const now = Date.now();
          if (now - lastTime > 50) {
            createParticle(e.clientX, e.clientY);
            lastTime = now;
          }
        });
      }

      // Initialize everything
      function init() {
        initializeTheme();
        populatePortfolio();

        // Hide loading and show portfolio
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("portfolio").classList.remove("hidden");

        // Setup all animations and interactions
        observeElements();
        setupSmoothScrolling();
        setupNavbarScroll();
        setupTypingAnimation();
        setupSkillAnimations();
        setupProjectAnimations();
        setupTimelineAnimations();
        setupParticleEffect();
      }
      init();
    })
    .catch((error) => console.error("Failed to fetch data:", error));
});
