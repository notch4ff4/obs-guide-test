function getMeta(name) {
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta ? meta.content.trim() : "";
}

function bindNav() {
  const prev = getMeta("prev");
  const next = getMeta("next");
  const home = getMeta("home") || "../index.html";

  const prevLink = document.getElementById("nav-prev");
  const nextLink = document.getElementById("nav-next");
  const homeLink = document.getElementById("nav-home");

  if (prevLink) {
    prevLink.href = prev || "#";
    prevLink.classList.toggle("btn-hidden", !prev);
    if (!prev) prevLink.setAttribute("aria-disabled", "true");
  }

  if (nextLink) {
    nextLink.href = next || "#";
    nextLink.classList.toggle("btn-hidden", !next);
    if (!next) nextLink.setAttribute("aria-disabled", "true");
  }

  if (homeLink) {
    homeLink.href = home;
  }
}

function bindCommandHints() {
  const links = document.querySelectorAll(".command-hint");
  if (!links.length) return;

  let popup = document.getElementById("command-hint-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "command-hint-popup";
    popup.className = "command-hint-popup";
    popup.hidden = true;
    popup.innerHTML = `
      <p id="command-hint-text" class="command-hint-popup__text"></p>
      <div class="command-hint-popup__row">
        <code id="command-hint-command" class="command-hint-popup__command"></code>
        <button id="command-hint-copy" class="command-hint-popup__copy" type="button">Скопировать</button>
      </div>
    `;
    document.body.appendChild(popup);
  }

  const popupText = document.getElementById("command-hint-text");
  const popupCommand = document.getElementById("command-hint-command");
  const popupCopy = document.getElementById("command-hint-copy");
  if (!popupText || !popupCommand || !popupCopy) return;

  let activeLink = null;

  function closePopup() {
    popup.hidden = true;
    activeLink = null;
  }

  function openPopup(link) {
    const text = link.dataset.text || "";
    const command = link.dataset.command || "";
    popupText.textContent = text;
    popupCommand.textContent = command;
    popupCopy.textContent = "Скопировать";

    popup.hidden = false;
    activeLink = link;

    const rect = link.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const gap = 8;

    let top = rect.bottom + gap;
    let left = rect.left;

    if (left + popupRect.width > window.innerWidth - 8) {
      left = window.innerWidth - popupRect.width - 8;
    }
    if (left < 8) {
      left = 8;
    }
    if (top + popupRect.height > window.innerHeight - 8) {
      top = rect.top - popupRect.height - gap;
    }
    if (top < 8) {
      top = 8;
    }

    popup.style.top = top + "px";
    popup.style.left = left + "px";
  }

  async function copyCommand() {
    const value = popupCommand.textContent || "";
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      popupCopy.textContent = "Скопировано";
    } catch (err) {
      popupCopy.textContent = "Не удалось";
    }
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (activeLink === link && !popup.hidden) {
        closePopup();
        return;
      }
      openPopup(link);
    });
  });

  popupCopy.addEventListener("click", copyCommand);
  document.addEventListener("click", (event) => {
    if (popup.hidden) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (popup.contains(target)) return;
    if (activeLink && activeLink.contains(target)) return;
    closePopup();
  });
  window.addEventListener("resize", closePopup);
}

document.addEventListener("DOMContentLoaded", () => {
  bindNav();
  bindCommandHints();
});
