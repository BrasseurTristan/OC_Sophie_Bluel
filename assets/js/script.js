import {editionMode, projectsModal} from "./edition.js";

let categories = window.localStorage.getItem('categories');
let projects = window.localStorage.getItem('projects');
let auth = window.sessionStorage.getItem('token');

function showServerError() {
    const categories = document.querySelector('#categories');
    if (categories) {
        categories.innerHTML = "";
        const errorContainer = document.createElement("div");
        errorContainer.classList.add("error-container");
        const errorMsg = document.createElement("p");
        errorMsg.classList.add("server-error");
        errorMsg.innerText = "Une erreur est survenue, nous nous excusons de la gène occasionné.";
        errorContainer.appendChild(errorMsg);
        categories.appendChild(errorContainer);
    }
}

try {
    if (categories === null) {
        const response = await fetch('http://localhost:5678/api/categories');
        categories = await response.json();
        window.localStorage.setItem("categories", JSON.stringify(categories));
    } else {
        categories = JSON.parse(categories);
    }

    if (projects === null) {
        const response = await fetch('http://localhost:5678/api/works');
        projects = await response.json();
        window.localStorage.setItem("projects", JSON.stringify(projects));
    } else {
        projects = JSON.parse(projects);
    }
} catch (error) {
    showServerError();
    throw error;
}

function generateCategories(el){
    const categories = document.querySelector("#categories");
    const allCategoriesElement = document.createElement("button");
    allCategoriesElement.dataset.id = 0;
    allCategoriesElement.innerText ="Tous";
    allCategoriesElement.classList.add('category-btn','selected');
    categories.appendChild(allCategoriesElement);
    el.forEach(element => {
        const categoryElement = document.createElement("button");
        categoryElement.dataset.id = element.id;
        categoryElement.innerText = element.name;
        categoryElement.classList.add('category-btn');
        categories.appendChild(categoryElement);
    });
}


const allCategoriesBtn = document.querySelectorAll('.category-btn');
allCategoriesBtn.forEach(btn => {
    btn.addEventListener('click',() =>{
        allCategoriesBtn.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        sortByCategory(btn.dataset.id)
    })
})

function generateProjects(el){
    const projectsList= document.querySelector('.gallery');
    projectsList.innerHTML = ''; 
    el.forEach(element => {
        const projectElement = document.createElement('figure');
        const projectImg = document.createElement('img');
        projectImg.src = element.imageUrl;
        projectImg.alt = element.title
        const projectFigCaption = document.createElement('figcaption');
        projectFigCaption.innerText = element.title;
        projectElement.appendChild(projectImg);
        projectElement.appendChild(projectFigCaption);
        projectsList.appendChild(projectElement);
    })
}

function sortByCategory(categoryId){
    if (categoryId == 0) {
        generateProjects(projects);
    } else {
        const filteredProjects = projects.filter(project => project.categoryId == categoryId);
        generateProjects(filteredProjects);
    }
}

if(auth){
    editionMode();
    const loginBtn = document.querySelector("#loginBtn");
    loginBtn.addEventListener("click",()=>{
        window.sessionStorage.removeItem("token");
        window.location.href= "http://127.0.0.1:5500/index.html";
    })
    const editionProjectBtn = document.querySelector(".editionBtn");
    editionProjectBtn.addEventListener("click", ()=> {
        projectsModal(projects, categories, (deletedId) => {
            projects = projects.filter(p => p.id !== deletedId);
            window.localStorage.setItem("projects", JSON.stringify(projects));
            generateProjects(projects);
        },
        (newProject) => {
            projects.push(newProject);
            window.localStorage.setItem("projects", JSON.stringify(projects));
            generateProjects(projects);
        })
    })
    
}


generateCategories(categories)
generateProjects(projects);