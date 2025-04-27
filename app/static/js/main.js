// Import components
import { handleResize, renderMenu, actionFromHash, setSelectedMenuItemFromHash } from "./components/sidebar.js";
import setupModal from "./components/modal.js";
import makeCall from "./utils/helper/api.js";
import { createRandomImage, setTheme, theme, themeChangeHandler } from "./utils/helper/background.js";

// Initialize components
window.addEventListener("DOMContentLoaded", () => {

  // Set the theme based on local storage or default to light
  setTheme(theme());

  // Check if the URL contains "auth" to determine if we are on the authentication page
  // If we are on the authentication page, we don't want to run the sidebar code
  // and we want to set up the background with random images
  // and handle the form submission for login
  // and registration
  if (window.location.href.includes("auth")) {
    // If the URL contains "auth", do not run the sidebar code
    const tcgBackground = document.querySelector(".tcgBackground");
    const textureContainer = document.createElement("div");
    textureContainer.classList.add(
      "vh-100",
      "position-absolute",
      "top-0",
      "z-n1",
      "w-100",
      "overflow-hidden"
    );

    Array.from({ length: 20 }).forEach(() => {
      textureContainer.appendChild(createRandomImage());
    });

    tcgBackground.appendChild(textureContainer);

    document.querySelectorAll("[type='submit']").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        button.setAttribute("disabled", "true");
        button.innerHTML =
          '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Loading...</span>';

        const form = button.closest("form");
        const formData = new FormData(form);
        const url = form.action;
        const requestOptions = {
          method: form.method,
          body: JSON.stringify(Object.fromEntries(formData)),
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await makeCall(url, requestOptions);

        if (response?.success) {
          window.location.href = "/";
        } else if (response?.error) {
          alert(response.error);
        } else {
          alert("An unexpected error occurred.");
        }

        // Reset button state
        button.removeAttribute("disabled");
        button.innerHTML = button.innerHTML.replace(
          '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Loading...</span>',
          "Login"
        );
      });
    });


    themeChangeHandler();
    return;
  }

  // Enable off-canvas sidebar for mobile
  window.addEventListener("resize", () => {
    handleResize();
  });

  // Initial call to set up the sidebar
  handleResize();
  renderMenu("menuContainerDesktop");
  renderMenu("menuContainerMobile");

  // Set up initial hash link
  // This will set the hash to "cards" if no hash is present
  actionFromHash();

  // Set selected menu item based on hash
  setSelectedMenuItemFromHash();

  // Set up modal
  setupModal();

  // This will create the copyright year
  if (document.getElementById("yeadCopyright")) {
    document.getElementById("yeadCopyright").textContent = new Date().getFullYear();
  }

});
