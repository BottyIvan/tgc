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
  const content = card.map((card) => `
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

  const modalInstance = await setupModal('TCG: ' + card[0]?.name, content, null, null, remove, "Drop this card")();
  modalInstance.show();
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