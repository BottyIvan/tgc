import { saveToLocalStorage, getFromLocalStorage } from "./localStorage.js";

// Utility function to get the current theme
const theme = () => {
    const savedTheme = getFromLocalStorage("theme");
    if (savedTheme && ["light", "dark"].includes(savedTheme)) {
        return savedTheme;
    }
    return (
        document.documentElement.getAttribute("data-bs-theme") ||
        document.body.getAttribute("data-bs-theme") ||
        "light"
    );
};

const setTheme = (theme) => {
    if (document.documentElement.hasAttribute("data-bs-theme")) {
        document.documentElement.setAttribute("data-bs-theme", theme);
    } else if (document.body.hasAttribute("data-bs-theme")) {
        document.body.setAttribute("data-bs-theme", theme);
    } else {
        console.warn("No theme attribute found on document or body.");
    }
};

// Function to create a random image element with specific styles
const createRandomImage = () => {
    const imageElement = document.createElement("img");
    imageElement.src = "/static/images/svg/noun-trading-card-1032128.svg";
    imageElement.alt = "Logo";
    imageElement.style.position = "absolute";
    imageElement.style.width = `${50 + Math.random() * 100}px`;
    imageElement.style.height = `${50 + Math.random() * 100}px`;
    imageElement.style.top = `${Math.random() * 100}%`;
    imageElement.style.left = `${Math.random() * 100}%`;
    imageElement.style.opacity = `${0.3 + Math.random() * 0.7}`;
    imageElement.style.transition =
        "transform 5s ease-in-out, top 5s ease-in-out, left 5s ease-in-out";

    // Set the image color based on the current theme
    imageElement.style.filter =
        theme() === "dark" ? "brightness(0) invert(1)" : "brightness(1) invert(0)";

    const animateElement = () => {
        imageElement.style.transform = `rotate(${Math.random() * 360}deg)`;
        imageElement.style.top = `${Math.random() * 100}%`;
        imageElement.style.left = `${Math.random() * 100}%`;
    };

    setInterval(animateElement, 5000);
    animateElement(); // Initial animation

    return imageElement;
};

// Function to handle theme changes
const themeChange = (selectedTheme = "light") => {
    try {
        const sanitizedTheme = ["light", "dark"].includes(selectedTheme)
            ? selectedTheme
            : "light";

        if (document.documentElement.hasAttribute("data-bs-theme")) {
            document.documentElement.setAttribute("data-bs-theme", sanitizedTheme);
        } else if (document.body.hasAttribute("data-bs-theme")) {
            document.body.setAttribute("data-bs-theme", sanitizedTheme);
        } else {
            console.warn("No theme attribute found on document or body.");
        }

        // Save the selected theme to local storage
        saveToLocalStorage("theme", sanitizedTheme);

        // Update the image color based on the selected theme
        document.querySelectorAll("img").forEach((img) => {
            img.style.filter =
                sanitizedTheme === "dark"
                    ? "brightness(0) invert(1)"
                    : "brightness(1) invert(0)";
        });
    } catch (error) {
        console.error("Error setting theme:", error);
    }
};

// Function to create a theme dropdown and handle theme changes
const themeChangeHandler = (containerId = null) => {
    // Avoid creating multiple dropdowns
    if (document.querySelector("#theme-dropdown")) return;

    const container = containerId
        ? document.getElementById(containerId)
        : document.body;

    const dropdownHTML = `
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" id="theme-dropdown" data-bs-toggle="dropdown">
                ${theme() === "dark" ? "🌙" : "☀️"}
            </button>
            <ul class="dropdown-menu shadow">
                <li class="px-1"><button class="dropdown-item rounded" data-theme="light">☀️ Light Theme</button></li>
                <li class="px-1"><button class="dropdown-item rounded" data-theme="dark">🌙 Dark Theme</button></li>
            </ul>
        </div>
    `;

    const dropdownContainer = document.createElement("div");
    if (container === document.body) {
        dropdownContainer.classList.add("position-fixed", "top-0", "end-0", "p-3");
    }
    dropdownContainer.innerHTML = dropdownHTML;

    dropdownContainer.querySelector(".dropdown-menu").addEventListener("click", (event) => {
        const selectedTheme = event.target.getAttribute("data-theme");
        if (selectedTheme) {
            themeChange(selectedTheme);
            dropdownContainer.querySelector("#theme-dropdown").textContent = `${selectedTheme === "dark" ? "🌙" : "☀️"}`;
        }
    });

    container.appendChild(dropdownContainer);
};

export {
    theme,
    setTheme,
    createRandomImage,
    themeChangeHandler
};