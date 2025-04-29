import { getCookie } from "../utils/helper/cookies.js";
import setupModal from "./modal.js";

const fetchCards = async () => {
  try {
    const response = await fetch("/cards");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const cards = await response.json();
    return cards;
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
};

const emptyCards = () => {
  const main = document.getElementById("main");
  main.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <img src="/static/images/svg/noun-trading-card-1032128.svg" alt="No Cards" class="img-fluid mb-4" style="max-width: 180px; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));">
      <h2 class="text-muted mb-2 fw-bold" style="font-size: 1.8rem;">No Cards Found</h2>
      <p class="text-muted mb-4" style="font-size: 1rem; max-width: 400px;">It looks like your collection is empty. Start building your collection by adding new cards to showcase.</p>
      <button type="button" class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" id="addCardBtn" style="font-size: 1rem;">
        <i class="bi bi-plus-circle-fill" style="font-size: 1.2rem;"></i>
        Add Your First Card
      </button>
    </div>
  `;

  main.classList.remove("row", "row-cols-1", "row-cols-sm-2", "row-cols-md-3", "g-4");
  document.getElementById("addCardBtn").addEventListener("click", () => {
    addCard();
  });
};

const renderCards = (cards) => {
  const main = document.getElementById("main");
  const cardHtml = cards.map(
    ({ id, image, name, description, card_type, rarity, card_set, set_number }) => `
      <div class="col">
        <div class="card h-100 border-0 shadow-sm">
          <img src="${image}" class="card-img-top p-3" alt="${name}" style="max-height: 200px; object-fit: contain;">
          <div class="card-body">
            <h5 class="card-title text-truncate" style="font-size: 1.1rem;">${name}</h5>
            <p class="card-text text-muted small text-truncate">${description}</p>
            <div class="d-flex flex-wrap gap-2 small mb-3">
              <span class="badge bg-info text-dark border border-info" style="font-size: 0.85rem; font-weight: 500;">
                <strong class="me-1">Type:</strong> ${card_type}
              </span>
              <span class="badge bg-warning text-dark border border-warning" style="font-size: 0.85rem; font-weight: 500;">
                <strong class="me-1">Rarity:</strong> ${rarity}
              </span>
              <span class="badge bg-success text-light border border-success" style="font-size: 0.85rem; font-weight: 500;">
                <strong class="me-1">Set:</strong> ${card_set}
              </span>
              <span class="badge bg-secondary text-light border border-secondary" style="font-size: 0.85rem; font-weight: 500;">
                <strong class="me-1">Set #:</strong> ${set_number}
              </span>
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary rounded-pill view-details-btn" data-id="${id}">
              View Details
            </button>
          </div>
        </div>
      </div>
    `
  );
  main.innerHTML = cardHtml.join("");
  main.className = "";
  main.classList.add("p-3", "row", "row-cols-1", "row-cols-sm-2", "row-cols-md-3", "g-4");

  document.querySelectorAll(".view-details-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const cardId = event.target.getAttribute("data-id");
      viewCardDetails(cardId);
    });
  });
};

const viewCardDetails = async (cardId) => {
  const request = await fetch(`/cards/${cardId}`)
  if (!request.ok) {
    console.error("Error fetching card details:", request.statusText);
    return;
  }
  const card = await request.json();
  if (!card) {
    console.error("Card not found");
    return;
  }

  const cardTabs = `
    <ul class="nav nav-underline small" id="cardDetailsTabs" role="tablist">
      ${["view", "edit"].map(
    (tab, i) => `
          <li class="nav-item" role="presentation">
            <button class="nav-link ${i === 0 ? "active" : ""}" 
              id="${tab}-tab" data-bs-toggle="tab" data-bs-target="#${tab}" 
              type="button" role="tab" aria-controls="${tab}" aria-selected="${i === 0}">
              <i class="bi bi-${tab === "view" ? "eye" : "pencil"} me-1"></i> 
              ${tab === "view" ? "View" : "Edit"}
            </button>
          </li>
        `
  ).join("")}
    </ul>
  `;

  const content = card.map((card) => `
    <div class="tab-content">
      <div class="tab-pane fade show active" id="view" role="tabpanel" aria-labelledby="view-tab">
        <div class="text-center">
          <img src="${card.image}" alt="${card.name}" class="img-fluid rounded mb-3 w-25">
          <p class="text-muted mb-4">${card.description}</p>
          <div class="text-start">
            <p><strong>ID:</strong> ${card.id}</p>
            <p><strong>Type:</strong> ${card.card_type}</p>
            <p><strong>Rarity:</strong> ${card.rarity}</p>
            <p><strong>Set:</strong> ${card.card_set}</p>
            <p><strong>Set Number:</strong> ${card.set_number}</p>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="edit" role="tabpanel" aria-labelledby="edit-tab">
        <form id="editCardForm">
          <div class="mb-3">
            <label for="editCardName" class="form-label">Card Name</label>
            <input type="text" class="form-control" id="editCardName" value="${card.name}" required>
          </div>
          <div class="mb-3">
            <label for="editCardDescription" class="form-label">Description</label>
            <textarea class="form-control" id="editCardDescription" rows="3" required>${card.description}</textarea>
          </div>
          <div class="mb-3">
            <label for="editCardImage" class="form-label">Image URL</label>
            <input type="url" class="form-control" id="editCardImage" value="${card.image}" required>
          </div>
          <div class="mb-3">
            <label for="editCardType" class="form-label">Card Type</label>
            <input type="text" class="form-control" id="editCardType" value="${card.card_type}" required>
          </div>
          <div class="mb-3">
            <label for="editCardRarity" class="form-label">Rarity</label>
            <input type="text" class="form-control" id="editCardRarity" value="${card.rarity}" required>
          </div>
          <div class="mb-3">
            <label for="editCardSet" class="form-label">Card Set</label>
            <input type="text" class="form-control" id="editCardSet" value="${card.card_set}" required>
          </div>
          <div class="mb-3">
            <label for="editCardSetNumber" class="form-label">Set Number</label>
            <input type="text" class="form-control" id="editCardSetNumber" value="${card.set_number}" required>
          </div>
        </form>
      </div>
    </div>
  `).join("");

  const remove = async () => {
    try {
      const request = await fetch(`/cards/delete/${cardId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCookie("csrf_access_token"),
        },
      });

      if (!request.ok) {
        console.error("Error deleting card:", request.statusText);
        return false;
      }
      const response = await request.json();
      if (response.message) {
        console.log(response.message);
        window.location.hash = "#cards";
        loadCards();
      } else if (response[0]?.error) {
        alert(response[0]?.error);
      }
      return true;
    } catch (error) {
      console.error("Error deleting card:", error);
      return false;
    }
  }

  const edit = async () => {
    if (!document.getElementById("editCardForm")) {
      console.error("Edit form not found");
      return false;
    }

    const form = document.getElementById("editCardForm");
    const url = `/cards/edit/${cardId}`;
    const method = "PUT";
    try {
      const request = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCookie("csrf_access_token"),
        },
        body: JSON.stringify({
          name: form.editCardName.value,
          description: form.editCardDescription.value,
          image: form.editCardImage.value,
          card_type: form.editCardType.value,
          rarity: form.editCardRarity.value,
          card_set: form.editCardSet.value,
          set_number: form.editCardSetNumber.value,
        }),
      });
      if (!request.ok) {
        console.error("Error editing card:", request.statusText);
        return false;
      }
      const card = await request.json();
      if (card.message) {
        console.log(card.message);
        window.location.hash = "#cards";
        loadCards();
      } else if (card[0]?.error) {
        alert(card[0]?.error);
      }
      return true;
    } catch (error) {
      console.error("Error editing card:", error);
      return false;
    }
  };

  const modalInstance = await setupModal(cardTabs, content, edit, "Edit this card", remove, "Drop this card")();
  modalInstance.show();

  modalInstance._element.addEventListener("shown.bs.modal", () => {
    const editTab = document.getElementById("edit-tab");
    const saveButton = document.querySelector(".btn-primary");

    const toggleSaveButton = () => {
      saveButton.classList.toggle("d-none", !editTab.classList.contains("active"));
    };

    toggleSaveButton(); // Initial check
    document.getElementById("cardDetailsTabs").addEventListener("click", toggleSaveButton);
  });
}

const addCard = async () => {
  const content = `
    <form id="addCardForm" action="/cards/add" method="POST">
      <div class="mb-3">
        <label for="cardName" class="form-label">Card Name</label>
        <input type="text" class="form-control" id="cardName" required>
      </div>
      <div class="mb-3">
        <label for="cardDescription" class="form-label">Description</label>
        <textarea class="form-control" id="cardDescription" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label for="cardImage" class="form-label">Image URL</label>
        <input type="url" class="form-control" id="cardImage" required>
      </div>
      <div class="mb-3">
        <label for="cardType" class="form-label">Card Type</label>
        <input type="text" class="form-control" id="cardType" required>
      </div>
      <div class="mb-3">
        <label for="cardRarity" class="form-label">Rarity</label>
        <input type="text" class="form-control" id="cardRarity" required>
      </div>
      <div class="mb-3">
        <label for="cardSet" class="form-label">Card Set</label>
        <input type="text" class="form-control" id="cardSet" required>
      </div>
      <div class="mb-3">
        <label for="cardSetNumber" class="form-label">Set Number</label>
        <input type="text" class="form-control" id="cardSetNumber" required>
      </div>
    </form>
  `;

  const action = async () => {
    const form = document.getElementById("addCardForm");
    const url = form.action;
    const method = form.method;

    try {
      const request = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCookie("csrf_access_token"),
        },
        body: JSON.stringify({
          name: form.cardName.value,
          description: form.cardDescription.value,
          image: form.cardImage.value,
          card_type: form.cardType.value,
          rarity: form.cardRarity.value,
          card_set: form.cardSet.value,
          set_number: form.cardSetNumber.value,
        }),
      });

      if (!request.ok) {
        console.error("Error adding card:", request.statusText);
        return false;
      }

      const card = await request.json();
      if (card.message) {
        console.log(card.message);
        window.location.hash = "#cards";
        loadCards();
      } else if (card[0]?.error) {
        alert(card[0]?.error);
      }
      return true;
    } catch (error) {
      console.error("Error adding card:", error);
      return false;
    }
  };

  const modalInstance = await setupModal("Add Card", content, action, "Add card")();
  modalInstance.show();
};

const loadCards = async () => {
  const cards = await fetchCards();

  if (!cards || cards.length === 0) {
    emptyCards();
    console.error("No cards found");
    return;
  }

  if (cards) {
    renderCards(cards);
  }
};

export { loadCards, addCard };