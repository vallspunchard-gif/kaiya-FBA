document.addEventListener("DOMContentLoaded", () => {
  setupSegments();
  setupOrderFilters();
  setupChannelChoices();
  setupTimelineToggle();
  setupCustomSelects();
});

function setupSegments() {
  document.querySelectorAll("[data-segment]").forEach((group) => {
    const buttons = [...group.querySelectorAll("button[data-mode]")];
    const targetSelector = group.getAttribute("data-target");
    const targets = targetSelector ? document.querySelectorAll(targetSelector) : [];

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        if (targets.length) {
          targets.forEach((target) => {
            target.classList.toggle("hidden", target.dataset.mode !== button.dataset.mode);
          });
        }
      });
    });
  });
}

function setupOrderFilters() {
  const container = document.querySelector("[data-orders]");
  if (!container) return;

  const tabs = [...container.querySelectorAll("[data-filter]")];
  const cards = [...container.querySelectorAll("[data-order-card]")];
  const search = container.querySelector("[data-order-search]");

  const render = () => {
    const active = container.querySelector("[data-filter].active")?.dataset.filter || "all";
    const query = (search?.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      const status = card.dataset.status;
      const keywords = (card.dataset.keywords || "").toLowerCase();
      const matchesTab = active === "all" || active === status;
      const matchesQuery = !query || keywords.includes(query);
      card.classList.toggle("hidden", !(matchesTab && matchesQuery));
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      render();
    });
  });

  if (search) {
    search.addEventListener("input", render);
  }

  render();
}

function setupChannelChoices() {
  const cards = [...document.querySelectorAll("[data-channel-card]")];
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
    });
  });
}

function setupTimelineToggle() {
  const trigger = document.querySelector("[data-expand-timeline]");
  if (!trigger) return;

  const hiddenItems = [...document.querySelectorAll("[data-timeline-extra]")];
  let expanded = false;

  trigger.addEventListener("click", () => {
    expanded = !expanded;
    hiddenItems.forEach((item) => item.classList.toggle("hidden", !expanded));
    trigger.textContent = expanded ? "收起部分轨迹" : "查看更多轨迹";
  });
}

function setupCustomSelects() {
  const selects = [...document.querySelectorAll("[data-select]")];
  if (!selects.length) return;

  const closeAll = (except) => {
    selects.forEach((select) => {
      if (select === except) return;
      const shell = select.querySelector(".field-shell.select");
      const menu = select.querySelector(".select-menu");
      shell?.classList.remove("open");
      menu?.classList.add("hidden");
    });
  };

  selects.forEach((select) => {
    const shell = select.querySelector(".field-shell.select");
    const valueNode = select.querySelector("[data-select-value]");
    const menu = select.querySelector(".select-menu");
    const options = [...select.querySelectorAll(".select-menu button")];

    if (!shell || !menu) return;

    shell.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldOpen = menu.classList.contains("hidden");
      closeAll(select);
      menu.classList.toggle("hidden", !shouldOpen);
      shell.classList.toggle("open", shouldOpen);
    });

    options.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        const value = option.dataset.value || option.textContent.trim();
        if (valueNode) valueNode.textContent = value;
        options.forEach((item) => item.classList.remove("active"));
        option.classList.add("active");
        menu.classList.add("hidden");
        shell.classList.remove("open");
      });
    });
  });

  document.addEventListener("click", () => closeAll());
}
