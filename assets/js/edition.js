
export function editionMode(){
    const bodyContainer = document.querySelector(".container");
    const banner = document.createElement("div");
    banner.classList.add("main-banner");
    const bannerText = document.createElement("span");
    const bannerIcon = document.createElement("i");
    bannerIcon.classList.add("fa-solid", "fa-pen-to-square", "white-icon");
    bannerText.innerText = "Mode édition";
    banner.appendChild(bannerIcon);
    banner.appendChild(bannerText);
    bodyContainer.insertAdjacentElement("beforebegin", banner);

    const portfolioTitle = document.querySelector(".portfolio-title");
    const projectEditionBtn = document.createElement("button");
    projectEditionBtn.classList.add("editionBtn");
    const editionIcon = document.createElement("i");
    editionIcon.classList.add("fa-solid", "fa-pen-to-square");
    projectEditionBtn.append(editionIcon, "modifier");
    portfolioTitle.appendChild(projectEditionBtn);

    const loginBtn = document.querySelector("#loginBtn");
    loginBtn.innerText = "Logout";
}

export function projectsModal(projects, categories, onDelete, onAdd) {
    const overlay = document.createElement("div");
    overlay.classList.add("dark-bg");
    const modal = document.createElement("div");
    modal.classList.add("projects-modal");
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    function closeModal() {
        overlay.remove();
    }

    function showGallery() {
        modal.innerHTML = "";

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("modal-close");
        closeBtn.innerHTML = "&times;";
        closeBtn.addEventListener("click", closeModal);

        const modalTitle = document.createElement("h2");
        modalTitle.innerText = "Galerie Photo";

        const gallery = document.createElement("div");
        gallery.classList.add("modal-gallery");
        projects.forEach(project => {
            const figure = document.createElement("figure");
            figure.classList.add("modal-figure");
            const img = document.createElement("img");
            img.src = project.imageUrl;
            img.alt = project.title;
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("modal-delete");
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteBtn.addEventListener("click", async () => {
                const token = window.sessionStorage.getItem("token");
                const response = await fetch(`http://localhost:5678/api/works/${project.id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    figure.remove();
                    if (onDelete) onDelete(project.id);
                }
            });
            figure.appendChild(img);
            figure.appendChild(deleteBtn);
            gallery.appendChild(figure);
        });

        const separator = document.createElement("hr");
        separator.classList.add("modal-separator");

        const addBtn = document.createElement("button");
        addBtn.classList.add("modal-add-btn");
        addBtn.innerText = "Ajouter une photo";
        addBtn.addEventListener("click", showAddForm);

        modal.appendChild(closeBtn);
        modal.appendChild(modalTitle);
        modal.appendChild(gallery);
        modal.appendChild(separator);
        modal.appendChild(addBtn);
    }

    function showAddForm() {
        modal.innerHTML = "";

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("modal-close");
        closeBtn.innerHTML = "&times;";
        closeBtn.addEventListener("click", closeModal);

        const backBtn = document.createElement("button");
        backBtn.classList.add("modal-back");
        backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        backBtn.addEventListener("click", showGallery);

        const modalTitle = document.createElement("h2");
        modalTitle.innerText = "Ajout photo";

        const form = document.createElement("form");
        form.classList.add("modal-form");

        const uploadArea = document.createElement("div");
        uploadArea.classList.add("modal-upload-area");

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = "image";
        fileInput.accept = "image/*";
        fileInput.classList.add("modal-file-input");

        const uploadIcon = document.createElement("i");
        uploadIcon.classList.add("fa-regular", "fa-image", "modal-upload-icon");

        const uploadBtn = document.createElement("button");
        uploadBtn.type = "button";
        uploadBtn.classList.add("modal-upload-btn");
        uploadBtn.innerText = "+ Ajouter photo";
        uploadBtn.addEventListener("click", () => fileInput.click());

        const uploadHint = document.createElement("p");
        uploadHint.classList.add("modal-upload-info");
        uploadHint.innerText = "jpg, png : 4mo max";

        const imgPreview = document.createElement("img");
        imgPreview.classList.add("modal-upload-preview");

        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (file) {
                imgPreview.src = URL.createObjectURL(file);
                uploadArea.innerHTML = "";
                uploadArea.appendChild(imgPreview);
                checkForm();
            }
        });

        uploadArea.appendChild(uploadIcon);
        uploadArea.appendChild(uploadBtn);
        uploadArea.appendChild(uploadHint);

        const titleLabel = document.createElement("label");
        titleLabel.innerText = "Titre";
        titleLabel.classList.add("modal-form-label");
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.name = "title";
        titleInput.classList.add("modal-form-input");

        const categoryLabel = document.createElement("label");
        categoryLabel.innerText = "Catégorie";
        categoryLabel.classList.add("modal-form-label");
        const categorySelect = document.createElement("select");
        categorySelect.name = "category";
        categorySelect.classList.add("modal-form-input","select");
        categorySelect.appendChild(new Option("", ""));
        categories.forEach(cat => categorySelect.appendChild(new Option(cat.name, cat.id)));

        const separator = document.createElement("hr");
        separator.classList.add("modal-separator");

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.classList.add("modal-add-btn");
        submitBtn.innerText = "Valider";
        submitBtn.disabled = true;

        function checkForm() {
            submitBtn.disabled = !(fileInput.files.length > 0 && titleInput.value.trim() !== "" && categorySelect.value !== "");
        }

        fileInput.addEventListener("change", checkForm);
        titleInput.addEventListener("input", checkForm);
        categorySelect.addEventListener("change", checkForm);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const token = window.sessionStorage.getItem("token");
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: new FormData(form)
            });
            if (response.ok) {
                const newProject = await response.json();
                if (onAdd) onAdd(newProject);
                showAddForm();
            }
        });

        form.appendChild(fileInput);
        form.appendChild(uploadArea);
        form.appendChild(titleLabel);
        form.appendChild(titleInput);
        form.appendChild(categoryLabel);
        form.appendChild(categorySelect);
        form.appendChild(separator);
        form.appendChild(submitBtn);

        modal.appendChild(closeBtn);
        modal.appendChild(backBtn);
        modal.appendChild(modalTitle);
        modal.appendChild(form);
    }

    showGallery();
}
