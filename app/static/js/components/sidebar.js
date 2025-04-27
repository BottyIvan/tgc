import { loadCards, addCard } from "./cards.js";
import { loadProfile } from "./profile.js";

const menuItems = [
    {
        name: "Cards",
        link: null,
        section: "cards",
        icon: "bi bi-card-text",
        action: loadCards,
    },
    {
        name: "Add Card",
        link: null,
        section: "addCard",
        icon: "bi bi-plus-circle",
        action: addCard,
    },
    {
        name: "Profile",
        link: null,
        section: "profile",
        icon: "bi bi-person-circle",
        action: loadProfile,
    },
    {
        name: "About",
        link: "https://www.example.com/about",
        section: "about",
        icon: "bi bi-info-circle",
        action: null,
        target: "_blank",
    }
];

const getWindowWidth = () => {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

const enableSidebarOffCanvas = () => {
    const sidebarToggle = document.getElementById('navbarBrand');

    if (getWindowWidth() < 768) {
        sidebarToggle.setAttribute("data-bs-toggle", "offcanvas");
        sidebarToggle.setAttribute("data-bs-target", "#mobileSidebar");
        sidebarToggle.setAttribute("aria-controls", "mobileSidebar");
    } else {
        sidebarToggle.removeAttribute("data-bs-toggle");
        sidebarToggle.removeAttribute("data-bs-target");
        sidebarToggle.removeAttribute("aria-controls");
    }
}

const handleResize = () => {
    enableSidebarOffCanvas();
}

const renderMenu = (containerId) => {
    const container = document.getElementById(containerId);
    menuItems.forEach((item) => {
        const li = document.createElement("li");
        li.className = "nav-item";

        // Create link or button
        if (item.link) {
            const a = document.createElement("a");
            a.href = item.link;
            a.innerHTML = `<i class="${item.icon} me-2"></i><span>${item.name}</span>`;
            a.className = "nav-link link-body-emphasis d-inline-flex text-decoration-none rounded-3 w-100";
            a.target = item.target || "_self"; // Default to _self if no target is specified
            a.setAttribute("role", "link"); // Accessibility improvement
            a.setAttribute("aria-label", item.name); // Improve accessibility

            li.appendChild(a);
        } else {
            const btn = document.createElement("button");
            btn.className = "nav-link link-body-emphasis d-inline-flex text-decoration-none rounded-3 w-100";
            btn.innerHTML = `<i class="${item.icon} me-2"></i><span>${item.name}</span>`;
            btn.onclick = () => {
                // Call the action associated with the menu item
                if (item.action) {
                    item.action();
                }
                // Add hash link to the URL
                addHashLink(item.section);
            }
            btn.setAttribute("aria-label", item.name); // Improve accessibility

            li.appendChild(btn);
        }

        // Append item to the container
        container.appendChild(li);
    });
}

const addHashLink = (link) => {
    window.location.hash = link || "cards";
    return link || "cards";
}

const actionFromHash = () => {
    const hash = window.location.hash.substring(1) || addHashLink();
    const item = menuItems.find(item => item.section === hash);
    if (item && item.action) {
        item.action();
    }
}

const setSelectedMenuItemFromHash = () => {
    const hash = window.location.hash.substring(1);
    menuItems.map(item => {
        if (item.section === hash) {
            const menuItem = document.querySelector(`[aria-label="${item.name}"]`);
            if (menuItem) {
                menuItem.classList.toggle("active");
            }
        }
    });
}

export {
    handleResize,
    renderMenu,
    addHashLink,
    actionFromHash,
    setSelectedMenuItemFromHash
}