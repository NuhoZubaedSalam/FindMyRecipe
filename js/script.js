// We import our secret code to access our premium API key from the config.js file
import { API_ACCESS } from "./config.js";

// To improve code readability, we use constants for commonly used element IDs
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const navBar = document.getElementById("navbar");
const recipeDiv = document.getElementById("single-meal");

// We create a result div to store search results
const resultDiv = document.createElement("div");
document.body.appendChild(resultDiv);

// **** NAVBAR *****
// We use event propagation to check if the user has clicked any of the links in the navbar
navBar.addEventListener("click", (event) => {
    // If that is the case, we refresh the result and the recipe div
    refreshPage();

    // Based on the target's ID we call the 'loadRecipes()' function with no input
    // and the required API link as parameters

    switch (event.target.id) {
        case "latest-meals":
            loadRecipes(
                null,
                `https://www.themealdb.com/api/json/v2/${API_ACCESS}/latest.php`
            );
            break;
        case "random-meal":
            loadRecipes(
                null,
                "https://www.themealdb.com/api/json/v1/1/random.php"
            );
            break;
        case "meal-selection":
            loadRecipes(
                null,
                `https://www.themealdb.com/api/json/v2/${API_ACCESS}/randomselection.php`
            );
            break;
    }
});

// **** MAIN CONTENT *****
// We check if a keydown event was triggered by the user (they pressed a key)
document.body.addEventListener("keydown", (event) => {
    // We check if the event's code matches the enter key
    if (event.code === "Enter") {
        // If that is the case, we refresh the result and recipe divs and we call the 'handleInput()' function
        refreshPage();
        handleInput();
    }
});

// We check if a click event was fired by the search button
searchButton.addEventListener("click", () => {
    // If that is the case, we call the 'refreshPage()' and 'handleInput()' functions
    refreshPage();
    handleInput();
});

// 'refreshPage()' is an arrow function which clears the recipe and result divs 
const refreshPage = () => {
    // We remove all the HTML contained in the recipe and the result divs
    recipeDiv.innerHTML = "";
    resultDiv.innerHTML = "";

    // We remove all the TailwindCSS classes from the recipe div
    recipeDiv.className = "";
};

const handleInput = () => {
    // We get the get user's input from the search bar
    const userInput = searchBar.value;

    // We trim the user's input to erase unnecessary whitespaces and we check if it's empty
    if (userInput.trim() === "")
        // If that is the case, we call the 'displayMsg()' with the 'error' message type
        displayMsg("error");
    // Otherwise we load the recipes through 'loadRecipes()' with the user's input as parameter
    else loadRecipes(userInput);
};

// 'displayMsg' is an arrow function with the message type as parameter
const displayMsg = (msgType) => {
    // We create a div where to store the message to display to the user
    const msg = document.createElement("div");

    // We add TailwindCSS classes to our message div
    msg.className = "flex justify-center items-center py-2";

    // We create an 'icon' and a 'text' to store different values based on the message
    let icon,
        text = "";

    // Based on the message type, it assigns different attributes and values to the variables
    switch (msgType) {
        case "error":
            msg.id = "error-message";
            msg.classList.add("text-red-500");
            icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
            text = "<strong>Error:</strong> Input field empty";
            break;

        case "warning":
            msg.id = "warning-message";
            msg.classList.add("text-orange-500");
            icon = '<i class="fa-solid fa-circle-exclamation"></i>';
            text = "<strong>Warning:</strong> No recipes found";
    }

    // We add the icon and the text in the HTML of the message div
    msg.innerHTML = `
        ${icon}
        <span class="mx-2 mb-[1px]">${text}</span>`;

    // We appund the message to the result div
    resultDiv.appendChild(msg);
};

// 'loadRecipes()' is an arrow function with the user's input and the API link as a parameters
// The default values for 'API_LINK' is the free MealDB API link with the user's input)
const loadRecipes = (
    userInput,
    API_LINK = `https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`
) => {
    // The fetch function gets the relative information from the database based on the user's input
    fetch(API_LINK)
        .then((response) => response.json())
        .then((data) => {
            // If the 'meals' array is null
            if (data?.meals === null)
                // It displays a warning to the user through the 'displayMsg()' function
                displayMsg("warning");
            // Otherwise, it displays the information contained in the 'meals' array
            else displayAllMeals(data?.meals);
        });
};

// 'displayAllMeals()' is an arrow function with the 'meals' array as a parameter
const displayAllMeals = (meals) => {
    // We create a div to store the user's requested meals
    const mealsContainer = document.createElement("div");

    // We add an ID and the necessary TailwindCSS classes to the meal container
    mealsContainer.id = "meals-container";
    mealsContainer.className =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 lg:px-4 xl:px-20 py-5";

    // We append the mealsContainer to the result div
    resultDiv.appendChild(mealsContainer);

    // For each element of the 'meals array'
    meals.forEach((meal) => {
        // We create a div to store each elements
        const mealDiv = document.createElement("div");

        // We add an ID, the necessary TailwindCSS classes and a custom shadow to each meal div
        mealDiv.id = meal?.idMeal;
        mealDiv.className =
            "bg-orange-200 place-items-center m-2 border-2 border-dashed border-[#7C3E1D] rounded-xl transition hover:scale-105 cursor-pointer";
        mealDiv.style.boxShadow =
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px";

        // We insert the details of each meal in the HTML of the meal div
        mealDiv.innerHTML = `
            <img class="w-full md:h-80 object-cover rounded-2xl p-2" src="${meal?.strMealThumb}" alt="">
            <h1 class="text-[18px] md:text-[20px] font-semibold text-balance text-center">${meal?.strMeal}</h1>
            <p><b><i>Area:</i></b> ${meal?.strArea}</p>
            <p class=pb-2><b><i>Category:</i></b> ${meal?.strCategory}</p>
        `;

        // We add an event listener which checks if the user has clicked on a meal div
        // If that is the case, we call the 'loadSingleRecipe()' function with the meal div's ID
        mealDiv.addEventListener("click", () => loadSingleRecipe(mealDiv.id));

        // We append each newly created div to the meal container
        mealsContainer.appendChild(mealDiv);
    });
};

// **** LOAD SINGLE RECIPES ****

// 'loadSingleRecipe()' is an arrow function with the meal's ID as a parameter
const loadSingleRecipe = (mealID) => {
    // THe fetch function fetches the contents from the API based on the user's selected meals
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        
    // The data is passed to the 'displayRecipe()' function
        .then((response) => response.json())
        .then((data) => displayRecipe(data?.meals[0]));
};

// 'displayRecipe()' is an arrow function with the first element of 'meals' array as a parameter
const displayRecipe = (meal) => {
    // We retrieve the ingredientList from the 'retrieveIngredients()'
    const ingredientList = retrieveIngredients(meal);

    // We apply the necessary classes to the recipe div
    recipeDiv.className =
        "border-3 border-[#7C3E1D] rounded-lg border-dotted mx-4 mt-5 p-2 lg:mx-40 md:w-100 justify-self-center";

    // We add the necessary HTML elements with the required content to the recipe div
    recipeDiv.innerHTML = `
        <img class="w-full md:h-80 object-cover rounded-2xl" src="${meal?.strMealThumb}" alt="">
        <h1 class="text-[18px] md:text-[20px] font-semibold text-balance text-center py-2">${meal?.strMeal}</h1>
        <p><b><i>Area:</i></b> ${meal?.strArea}</p>
        <p class="pb-2"><b><i>Category:</i></b> ${meal?.strCategory}</p>
        <p><b>Ingredients (measures):</b></p>
        <p>${ingredientList}</p>
        <p class="py-2"><b>Instructions:</b></p>
        <p class="whitespace-pre-line text-justify text-pretty">${meal?.strInstructions}</p>
    `;

    // After the contents have been inserted, the recipe div scrolls smoothly into view 
    // block: "start" ensures that the scrolls to the start of the recipe div
    recipeDiv.scrollIntoView({ behavior: "smooth", block: "start" });
};

// 'displayRecipe()' is an arrow function with the parameter as 'displayRecipe()'
const retrieveIngredients = (meal) => {
    // We initialize an empty string to store the ingredient list
    let ingredientList = "";

    // We loop through all 20 ingridients in each meal 
    for (let i = 1; i <= 20; i++) {
        // For each meal, we access the current ingredient and measure
        let currentIngredient = meal[`strIngredient${i}`];
        let currentMeasure = meal[`strMeasure${i}`];

        // if the current ingredient and measure are not empty when trimmed, we add them to the list
        if (currentIngredient.trim() !== "" && currentMeasure.trim() !== "") {
            ingredientList += `&bull; ${currentIngredient.trim()} <i>(${currentMeasure.trim()})</i> <br>`;
        }
    }

    // At the end we return the ingridient list
    return ingredientList;
};