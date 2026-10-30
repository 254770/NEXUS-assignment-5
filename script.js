/* Assignment 4 — JavaScript components by Benazir Myrzakhmetova. */
document.addEventListener("DOMContentLoaded", () => {
  // Task 1: form validation
  const form = document.getElementById("nexusContactForm");
  if (form) {
    const fields = ["name", "email", "password", "confirmPassword"];
    function showError(id, message) {
      const output = document.getElementById(id + "Error");
      if (output) output.textContent = message;
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      fields.forEach(id => showError(id, ""));
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirmPassword").value;
      let valid = true;
      if (!name) { showError("name", "Name is required."); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Enter a valid email address."); valid = false;
      }
      if (password.length < 8) {
        showError("password", "Password must be at least 8 characters."); valid = false;
      }
      if (confirm !== password || !confirm) {
        showError("confirmPassword", "Passwords must match."); valid = false;
      }
      const status = document.getElementById("formStatus");
      if (valid) {
        status.textContent = "Form validated successfully! (Demo: no data is sent.)";
        status.className = "mt-3 text-success";
        form.reset();
      } else {
        status.textContent = "Please correct the highlighted fields.";
        status.className = "mt-3 text-warning";
      }
    });
    form.addEventListener("reset", () => {
      setTimeout(() => {
        fields.forEach(id => showError(id, ""));
        document.getElementById("formStatus").textContent = "";
      }, 0);
    });
  }

  // Task 2: FAQ accordion; answers start hidden via CSS.
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const answer = document.getElementById(button.getAttribute("aria-controls"));
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      answer.classList.toggle("is-open", !isOpen);
    });
  });

  // Task 3: custom subscription modal
  const modal = document.getElementById("subscribeModal");
  const open = document.getElementById("openSubscribe");
  const close = document.getElementById("closeSubscribe");
  if (modal && open && close) {
    let previousFocus;
    const hide = () => {
      modal.hidden = true;
      document.body.classList.remove("modal-active");
      if (previousFocus) previousFocus.focus();
    };
    open.addEventListener("click", () => {
      previousFocus = document.activeElement;
      modal.hidden = false;
      document.body.classList.add("modal-active");
      close.focus();
    });
    close.addEventListener("click", hide);
    modal.addEventListener("click", event => {
      if (event.target === modal) hide();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) hide();
    });
    const subscribeForm = document.getElementById("subscribeForm");
    subscribeForm.addEventListener("submit", event => {
      event.preventDefault();
      document.getElementById("subscribeStatus").textContent =
        "Thanks for subscribing! (Demo only; no data is sent.)";
      subscribeForm.reset();
    });
  }

  // Task 4: cycle through backgrounds
  const themeButton = document.getElementById("themeButton");
  if (themeButton) {
    const colors = ["#0b0d14", "#17223b", "#30204b", "#173b36"];
    let index = 0;
    themeButton.addEventListener("click", () => {
      index = (index + 1) % colors.length;
      document.documentElement.style.setProperty("--bg", colors[index]);
      document.getElementById("themeStatus").textContent =
        "Background color " + (index + 1) + " of " + colors.length;
    });
  }

  // Task 5: live date and time
  const clock = document.getElementById("liveClock");
  if (clock) {
    const updateClock = () => {
      clock.textContent = new Date().toLocaleString("en-US", {
        year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "2-digit", second: "2-digit"
      });
    };
    updateClock();
    setInterval(updateClock, 1000);
  }
});


/* Assignment 5: advanced DOM, event handling, objects, arrays, callbacks, sounds. */
document.addEventListener("DOMContentLoaded", () => {
  const gameList = [
    { title: "Cyberpunk 2077", genre: "rpg", image: "cyberpunk.jpg", detail: "Explore a futuristic open world." },
    { title: "Minecraft", genre: "sandbox", image: "minecraft.jpg", detail: "Create and explore your own world." },
    { title: "Forza Horizon", genre: "racing", image: "forza.jpg", detail: "Experience exciting racing adventures." },
    { title: "Action Arena", genre: "action", image: "gaming.jpg", detail: "Fast-paced gaming challenges." }
  ];
  const gameArea = document.querySelector("#dynamicGames");
  if (!gameArea) return;
  const feedback = document.getElementById("labFeedback");
  const filterSelect = document.getElementById("gameFilter");
  const soundButton = document.getElementById("soundToggle");
  let soundEnabled = true;
  let audioContext;
  function playNotification() {
    if (!soundEnabled) return;
    try {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      if (!AudioEngine) return;
      audioContext = audioContext || new AudioEngine();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 620;
      gain.gain.setValueAtTime(0.055, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.12);
    } catch (error) { console.warn("Sound is unavailable:", error); }
  }
  function updateFeedback(message) { feedback.textContent = message; }
  function animateCards() {
    gameArea.querySelectorAll(".lab-game-card").forEach((card, index) => {
      card.style.transform = "translateY(12px)";
      card.style.opacity = "0";
      requestAnimationFrame(() => {
        card.style.transitionDelay = `${index * 60}ms`;
        card.style.transform = "translateY(0)";
        card.style.opacity = "1";
      });
    });
  }
  function renderGames(genre, callback) {
    const filtered = gameList.filter(game => genre === "all" || game.genre === genre);
    gameArea.replaceChildren();
    filtered.forEach(game => {
      const column = document.createElement("div");
      column.className = "col-sm-12 col-md-6 col-lg-3 lab-game-card";
      const card = document.createElement("article");
      card.className = "card h-100 p-3";
      const picture = document.createElement("img");
      picture.src = game.image;
      picture.alt = game.title;
      picture.className = "lab-game-image";
      const heading = document.createElement("h3");
      heading.className = "h5 mt-3";
      heading.textContent = game.title;
      const description = document.createElement("p");
      description.textContent = game.detail;
      card.append(picture, heading, description);
      column.append(card);
      gameArea.append(column);
    });
    animateCards();
    callback(`Showing ${filtered.length} game(s) in ${genre === "all" ? "all categories" : genre}.`);
  }
  function chooseGenre(genre) {
    switch (genre) {
      case "rpg": case "action": case "racing": case "sandbox": case "all":
        filterSelect.value = genre;
        renderGames(genre, updateFeedback);
        playNotification();
        break;
      default: updateFeedback("Unknown category.");
    }
  }
  filterSelect.addEventListener("change", () => chooseGenre(filterSelect.value));
  document.getElementById("showTime").addEventListener("click", () => {
    updateFeedback("Current time: " + new Date().toLocaleTimeString());
    playNotification();
  });
  soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundButton.textContent = soundEnabled ? "Sound: On" : "Sound: Off";
    soundButton.setAttribute("aria-pressed", String(soundEnabled));
    if (soundEnabled) playNotification();
  });
  const stars = document.querySelectorAll("#ratingStars button");
  stars.forEach(star => star.addEventListener("click", () => {
    const rating = Number(star.dataset.rating);
    stars.forEach(button => {
      const selected = Number(button.dataset.rating) <= rating;
      button.textContent = selected ? "★" : "☆";
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(Number(button.dataset.rating) === rating));
    });
    document.getElementById("ratingMessage").textContent = `Thanks! You rated NEXUS ${rating}/5.`;
    playNotification();
  }));
  const moreButton = document.getElementById("readMoreButton");
  const extra = document.getElementById("extraInfo");
  moreButton.addEventListener("click", () => {
    extra.hidden = !extra.hidden;
    moreButton.textContent = extra.hidden ? "Read More" : "Read Less";
    moreButton.setAttribute("aria-expanded", String(!extra.hidden));
  });
  // Keyboard menu navigation: arrows cycle through links while focus is inside nav.
  document.querySelectorAll("nav").forEach(nav => {
    const links = Array.from(nav.querySelectorAll("a[href]"));
    nav.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const index = links.indexOf(document.activeElement);
      if (index < 0 || links.length < 2) return;
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      links[(index + step + links.length) % links.length].focus();
    });
  });
  document.addEventListener("keydown", event => {
    const tag = event.target.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case "1": chooseGenre("rpg"); break;
      case "2": chooseGenre("action"); break;
      case "3": chooseGenre("racing"); break;
      default: break;
    }
  });
  renderGames("all", updateFeedback);
});
