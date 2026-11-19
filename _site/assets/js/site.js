// Site behaviour: mobile menu, accessibility panel, documentation accordion, project filters.
// From the designer's script.js. The p5 hero loader is gone: sketches are rendered to images at build time.

// =========================
// ELEMENTEN OPHALEN
// =========================

const panel = document.getElementById("accessibilityPanel");
const overlay = document.getElementById("overlay");

const openButton = document.getElementById("accessibilityToggle");
const closeButton = document.getElementById("closeAccessibility");
const menuButton = document.querySelector(".menu-toggle");
const headerInner = document.querySelector(".header-inner");

const fontNormal = document.getElementById("fontNormal");
const fontLarge = document.getElementById("fontLarge");
const fontXLarge = document.getElementById("fontXLarge");

const contrastToggle = document.getElementById("contrastToggle");
const motionToggle = document.getElementById("motionToggle");
const desktopPanelParent = panel?.parentElement;
const mobileMenuQuery = window.matchMedia("(max-width: 700px)");

function isMobileMenu() {

    return mobileMenuQuery.matches;
}

function syncPanelLocation() {

    if(!panel || !headerInner || !desktopPanelParent) {
        return;
    }

    if(isMobileMenu()) {
        headerInner.appendChild(panel);
        return;
    }

    desktopPanelParent.appendChild(panel);
}

function closeMenu() {

    headerInner?.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open menu");
}

function toggleMenu() {

    if(!headerInner || !menuButton) {
        return;
    }

    const isOpen = !headerInner.classList.contains("menu-open");

    headerInner.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Sluit menu" : "Open menu");

    if(!isOpen) {
        closePanel();
    }
}

const filters = document.querySelector(".project-overview .filters");
const projectGrid = document.querySelector(".project-overview .project-grid");
const projectCount = document.querySelector(".project-overview .project-count");
const noResults = document.querySelector(".project-overview .no-results");
// =========================
// PANEL OPENEN
// =========================

function openPanel() {

    panel.classList.add("active");
    overlay.classList.toggle("active", !isMobileMenu());

    if(!isMobileMenu()) {
        document.body.style.overflow = "hidden";
    }

    openButton.setAttribute("aria-expanded", "true");
}

// =========================
// PANEL SLUITEN
// =========================

function closePanel() {

    panel.classList.remove("active");
    overlay.classList.remove("active");

    document.body.style.overflow = "";

    openButton.setAttribute("aria-expanded", "false");
}

syncPanelLocation();

menuButton?.addEventListener("click", toggleMenu);

mobileMenuQuery.addEventListener("change", () => {

    syncPanelLocation();
    closePanel();
    closeMenu();
});

openButton.addEventListener("click", () => {

    if(isMobileMenu() && panel.classList.contains("active")) {
        closePanel();
        return;
    }

    openPanel();
});

closeButton.addEventListener("click", closePanel);

overlay.addEventListener("click", closePanel);

// =========================
// ESC SLUIT PANEL
// =========================

document.addEventListener("keydown", (event) => {

    if(event.key === "Escape") {
        closePanel();
    }

});

// =========================
// LETTERGROOTTE
// =========================

fontNormal.addEventListener("click", () => {

    document.documentElement.classList.remove(
        "font-large",
        "font-xlarge"
    );

    localStorage.setItem("fontSize", "normal");
});

fontLarge.addEventListener("click", () => {

    document.documentElement.classList.remove("font-xlarge");
    document.documentElement.classList.add("font-large");

    localStorage.setItem("fontSize", "large");
});

fontXLarge.addEventListener("click", () => {

    document.documentElement.classList.remove("font-large");
    document.documentElement.classList.add("font-xlarge");

    localStorage.setItem("fontSize", "xlarge");
});

// =========================
// CONTRAST
// =========================

contrastToggle.addEventListener("click", () => {

    document.body.classList.toggle("high-contrast");

    localStorage.setItem(
        "highContrast",
        document.body.classList.contains("high-contrast")
    );
});

// =========================
// ANIMATIES
// =========================

motionToggle.addEventListener("click", () => {

    document.body.classList.toggle("reduce-motion");

    localStorage.setItem(
        "reduceMotion",
        document.body.classList.contains("reduce-motion")
    );
});

// =========================
// INSTELLINGEN LADEN
// =========================

function loadSettings() {

    const fontSize = localStorage.getItem("fontSize");

    if(fontSize === "large") {
        document.documentElement.classList.add("font-large");
    }

    if(fontSize === "xlarge") {
        document.documentElement.classList.add("font-xlarge");
    }

    const highContrast =
        localStorage.getItem("highContrast") === "true";

    if(highContrast) {
        document.body.classList.add("high-contrast");
    }

    const reduceMotion =
        localStorage.getItem("reduceMotion") === "true";

    if(reduceMotion) {
        document.body.classList.add("reduce-motion");
    }
}

loadSettings();


// =========================
// SMOOTH SCROLL BUTTONS (data-scroll="<id>")
// =========================

document.querySelectorAll("[data-scroll]").forEach(button => {

    button.addEventListener("click", (event) => {

        const target = document.getElementById(button.dataset.scroll);

        if(!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
    });

});

// =========================
// EXTRA PROJECTEN
// =========================

const toggleProjectsBtn =
    document.getElementById("toggleProjects");

const hiddenProjects =
    document.querySelector(".extra-projects");

if(toggleProjectsBtn && hiddenProjects){

    toggleProjectsBtn.addEventListener("click", () => {

        const isOpen =
        hiddenProjects.classList.toggle("active");
    
    toggleProjectsBtn.textContent =
        isOpen
            ? "Verberg projecten ▲"
            : "Bekijk projecten ▼";

    });

}

// =========================
// ACCORDION + TIMELINE (per documentation block)
// =========================

document.querySelectorAll(".documentation").forEach(block => {

    const accordionItems = Array.from(block.querySelectorAll(".accordion-item"));
    const timelineItems = Array.from(block.querySelectorAll(".timeline-item"));

    function setOpen(item, open) {

        const content = item.querySelector(".accordion-content");

        item.classList.toggle("active", open);
        item.querySelector(".accordion-header")?.setAttribute("aria-expanded", String(open));
        content.style.maxHeight = open ? content.scrollHeight + "px" : null;
    }

    function updateTimeline(activeIndex) {

        timelineItems.forEach((item, index) => {
            item.classList.toggle("active", index <= activeIndex);
        });
    }

    function open(index, scroll) {

        const isOpen = accordionItems[index].classList.contains("active");

        accordionItems.forEach(item => setOpen(item, false));

        if(isOpen && !scroll) {
            return;
        }

        setOpen(accordionItems[index], true);
        updateTimeline(index);

        if(scroll) {
            accordionItems[index].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    accordionItems.forEach((item, index) => {
        item.querySelector(".accordion-header").addEventListener("click", () => open(index, false));
    });

    timelineItems.forEach((item, index) => {
        item.addEventListener("click", () => open(index, true));
    });

    // Open the first item by default.
    window.addEventListener("load", () => {
        if(accordionItems.length) {
            open(0, false);
        }
    });
});

if (filters && projectGrid && projectCount && noResults) {

    const cards = Array.from(projectGrid.children);

    filters.addEventListener("change", () => {

        const opleiding = filters.elements.opleiding?.value ?? "";
        const jaar = filters.elements.jaar.value;
        const sortering = filters.elements.sorteren.value;

        const sortedCards = [...cards].sort((a, b) => {

            if (sortering === "titel") {
                return a.dataset.title.localeCompare(b.dataset.title, "nl");
            }

            if (sortering === "oudste") {
                return Number(a.dataset.jaar) - Number(b.dataset.jaar);
            }

            if (sortering === "nieuwste") {
                return Number(b.dataset.jaar) - Number(a.dataset.jaar);
            }

            return 0;
        });

        sortedCards.forEach(card => projectGrid.appendChild(card));

        let visible = 0;

        sortedCards.forEach(card => {

            const opleidingOK =
                !opleiding || card.dataset.opleiding === opleiding;

            const jaarOK =
                !jaar || card.dataset.jaar === jaar;

            const show = opleidingOK && jaarOK;

            card.hidden = !show;

            if (show) visible++;

        });

        projectCount.textContent =
            visible === 1
                ? "1 project"
                : `${visible} projecten`;

        noResults.hidden = visible !== 0;

    });

}