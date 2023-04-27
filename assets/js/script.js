const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const yourSearchResult = document.getElementById("your-search-result")

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe")
});

// get meal list
function getMealList() {
    let searchInput = document.getElementById("search-input").value.trim();
    //console.log(searchInput)
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        
        if(data.meals) {
            data.meals.forEach(meal => {
                console.log(meal)
                html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                    </div>
                </div>
                `
            });
            mealList.classList.remove('notFound')
            yourSearchResult.style.display = "inline"
        } else {
            html="Sorry, we didn't find any meal matching the searched ingredient!"
            mealList.classList.add('notFound')
        }

        mealList.innerHTML = html;
    })
}

// get recipe for meal
function getMealRecipe(event) {
    event.preventDefault();
    if(event.target.classList.contains("recipe-btn")) {
        let mealItem = event.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals))
    }
}

// modal
function mealRecipeModal(meal) {
    console.log(meal)
    meal = meal[0]
    console.log(meal.strInstructions)

    let count = 1;
    let ingredients = [];
    for (let i in meal) {
        let ingredient = ""
        let measure = ""
        if(i.startsWith("strIngredient") && meal[i]) {
            ingredient = meal[i]
            measure = meal["strMeasure" + count];
            count += 1
            ingredients.push(`${measure} ${ingredient}`)
        }
    }
    console.log(ingredients)
    let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-ingredient" id="recipe-ingredient">
        <h3>Ingredients Needed:</h3>
    </div>
    <div class="recipe-instruction">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank"><i class='bx bxs-video' ></i> Watch Video </a>
    </div>
    `
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
    let ingredientContent = document.getElementById("recipe-ingredient")
    let parent = document.createElement("ul")
    ingredients.forEach((i) => {
        let child = document.createElement("li")
        child.innerText = i
        parent.appendChild(child)
        ingredientContent.appendChild(parent)
    })
}