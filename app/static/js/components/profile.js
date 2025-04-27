import { getCookie } from "../utils/helper/cookies.js";
import { themeChangeHandler } from "../utils/helper/background.js";
import setupModal from "./modal.js";

const showProfile = (username = null, email = null) => {
    const profileContainer = document.getElementById("main");
    profileContainer.innerHTML = generateProfileContent(username, email);
    profileContainer.className = "";
    profileContainer.classList.add("p-3", "container-fluid");

    themeChangeHandler("theme-container");
    setupLogoutButton();
};

const generateProfileHeader = () => {
    return `
        <div class="mb-4">
            <h2 class="fw-semibold">Profile</h2>
            <p class="text-muted">Update your account information.</p>
        </div>
    `;
};

const generateProfileForm = (username, email) => {
    return `
        <form id="profile-form" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" placeholder="Username" required value="${username}">
                <div class="invalid-feedback">Please enter a valid username.</div>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" placeholder="Email" required value="${email}">
                <div class="invalid-feedback">Please enter a valid email.</div>
            </div>
            <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password" required>
                <div class="invalid-feedback">Please enter your password.</div>
            </div>
            <div class="mb-4">
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    `;
};

const generateAppearanceSection = () => {
    return `
        <hr>
        <div class="row">
            <div class="col-10">
                <h5 class="fw-semibold mb-2">Appearance</h5>
                <p class="text-muted small">Choose your preferred theme.</p>
            </div>
            <div class="col-2 d-flex justify-content-end align-items-center" id="theme-container"></div>
        </div>
        `;
};

const generateLogoutSection = () => {
    return `
        <hr>
        <h5 class="fw-semibold mb-2">Logout</h5>
        <p class="text-muted small">You will be logged out of your account.</p>
        <button class="btn btn-outline-secondary" id="logout">Logout</button>
    `;
};

const generateDangerZoneSection = () => {
    return `
        <hr>
        <h5 class="fw-semibold mb-2">Danger Zone</h5>
        <p class="text-muted small">Deleting your account is permanent and cannot be undone.</p>
        <button class="btn btn-outline-danger" id="delete-account">Delete Account</button>
    `;
};

const generateProfileContent = (username, email) => {
    return `
        <div class="py-4">
            ${generateProfileHeader()}
            ${generateProfileForm(username, email)}
            ${generateAppearanceSection()}
            ${generateLogoutSection()}
            ${generateDangerZoneSection()}
        </div>
    `;
};

const setupLogoutButton = () => {
    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", async () => {
        const modalContent = `
            <h5 class="mb-3">Are you sure you want to log out?</h5>
            <p class="text-muted">You will be logged out of your account.</p>
        `;
        const modalInstance = await setupModal("Logout", modalContent, logout)();
        modalInstance.show();
    });
};

const loadProfile = async () => {
    const request = await fetch("/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await request.json();
    showProfile(data?.user?.username, data?.user?.email);
}

const logout = async () => {
    const request = await fetch("/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": getCookie("csrf_access_token"),
        },
    });

    const data = await request.json();

    if (data.success) {
        window.location.href = "/";
    } else {
        console.error("Logout failed:", request.statusText);
    }
}

export { loadProfile };