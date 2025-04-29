const setupModal = (title = null, content = null, action = null, actionText = null, actionDanger = null, actionDangerText = null) => {
  return async () => {
    const modal = document.querySelector(".modal");
    const modalInstance = new bootstrap.Modal(modal, {
      backdrop: "static",
      keyboard: false,
    });

    const modalTitle = modal.querySelector(".modal-title");
    const modalBody = modal.querySelector(".modal-body");
    const confirmButton = modal.querySelector(".btn-primary");
    const confirmButtonDanger = modal.querySelector(".btn-danger");

    modalTitle.innerHTML = title;
    modalBody.innerHTML = content;
    confirmButton.textContent = actionText || "Confirm";
    confirmButtonDanger.textContent = actionDangerText || "Delete";
    confirmButton.classList.toggle("d-none", action === null);
    confirmButtonDanger.classList.toggle("d-none", actionDanger === null);

    if (action) {
      confirmButton.addEventListener(
        "click",
        async () => {
          if (typeof action === "function") {
            try {
              const result = await action();
              if (result !== false) {
                modalInstance.hide();
              }
            } catch (error) {
              console.error("Error executing action:", error);
            }
          }
        },
        { once: true }
      );
    }

    if (actionDanger) {
      confirmButtonDanger.addEventListener(
        "click",
        async () => {
          if (typeof actionDanger === "function") {
            try {
              const result = await actionDanger();
              if (result !== false) {
                modalInstance.hide();
              }
            } catch (error) {
              console.error("Error executing action:", error);
            }
          }
        },
        { once: true }
      );
    }

    return modalInstance;
  };
};

export default setupModal;