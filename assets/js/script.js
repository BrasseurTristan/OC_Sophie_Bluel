import {editionMode, projectsModal} from "./edition.js";

let categories = window.localStorage.getItem('categories');
let projects = window.localStorage.getItem('projects');
let auth = window.sessionStorage.getItem('token');

if (categories === null) {
    const response = await fetch('http://localhost:5678/api/categories')
    categories = await response.json();
    const categoriesJson = JSON.stringify(categories);
    window.localStorage.setItem("categories", categoriesJson);
}else{
    categories = JSON.parse(categories);
}

if (projects === null) {
    const response = await fetch('http://localhost:5678/api/works')
    projects = await response.json();
    const projectsJson = JSON.stringify(projects);
    window.localStorage.setItem("projects", projectsJson);
}else{
    projects = JSON.parse(projects);
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

generateCategories(categories)

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
generateProjects(projects);

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
            generateProjects(projects);
        }, 
        (newProject) => {
            projects.push(newProject);
            generateProjects(projects);
        })
    })
    
}

