// To improve code readability, we use constants for commonly used element IDs
const searchBar = document.getElementById("search-bar"); 
const searchButton = document.getElementById("search-button");
const errorID = document.getElementById("error-message");

// We create a result div to store search results
const resultDiv = document.createElement('div');
document.body.appendChild(resultDiv);

// We check if a keydown event was triggered by the user (they pressed a key)
document.body.addEventListener("keydown", (event) => {
    // We check if the event's code matches the enter key
    if (event.code === "Enter") {
        // If that is the case, we refresh the result div and we call the 'handleInput()' function
        resultDiv.innerHTML = ''
        handleInput();
    }
})

// We check if a click event was fired by the search button 
searchButton.addEventListener("click", () => {
    // If that is the case, we refresh the result div and we call the 'handleInput()' function
    resultDiv.innerHTML = '';
    handleInput();
});

const handleInput = () => {
    // We get the get user's input from the search bar
    const userInput = searchBar.value;

    // We trim the user's input to erase unnecessary whitespaces and we check if it's empty
    if (userInput.trim() === '')
        // If that is the case, we call the 'displayMsg()' with the 'error' message type
        displayMsg('error');
    else
        // Otherwise we load the recipes through 'loadRecipes()' with the user's input as parameter
        loadRecipes(userInput);
}

// 'displayMsg' is an arrow function with the message type as parameter
const displayMsg = (msgType) => {
    // We create a div where to store the message to display to the user
    const msg = document.createElement("div");
    
    // We add TailwindCSS classes to our message div
    msg.className = "flex justify-center items-center py-2";

    // We create an 'icon' and a 'text' to store different values based on the message
    let icon, text = ''

    // Based on the message type, it assigns different attributes and values to the variables 
    switch (msgType) {
        case 'error':
            msg.id = "error-message";
            msg.classList.add('text-red-500');
            icon = '<i class="fa-solid fa-triangle-exclamation"></i>'
            text = "<strong>Error:</strong> Input field empty"
            break;
    
        case 'warning':
            msg.id = "warning-message";
            msg.classList.add("text-orange-500");
            icon = '<i class="fa-solid fa-circle-exclamation"></i>';
            text = "<strong>Warning:</strong> No recipes found"
    }
    
    // We add the icon and the text in the HTML of the message div
    msg.innerHTML = `
        ${icon}
        <span class="mx-2 mb-[1px]">${text}</span>`;
    
    // We appund the message to the result div
    resultDiv.appendChild(msg);
}

// 'loadRecipes()' is an arrow function with the user's input as parameter
const loadRecipes = (userInput) => {
    // The fetch function gets the relative information from the database based on the user's input
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`)
        .then((response) => response.json())
        .then((data) => {
            // If the 'meals' array is null
            if (data?.meals === null)
                // It displays a warning to the user through the 'displayMsg()' function
                displayMsg('warning');
            else 
                // Otherwise, it displays the information contained in the 'meals' array 
                displayData(data?.meals)
            }
        )
};

// 'displayData()' is an arrow function with the 'meals' array as a parameter
const displayData = (meals) => {
    // We create a div to store the user's requested meals
    const mealsContainer = document.createElement("div");

    // We add the necessary TailwindCSS classes to the meal container
    mealsContainer.className =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 lg:px-4 xl:px-20 py-4";
    resultDiv.appendChild(mealsContainer);

    // For each element of the 'meals array'
    meals.forEach((meal) => {
        // We create a div to store each elements
        const mealDiv = document.createElement("div");

        // We add the necessary TailwindCSS classes and a custom shadow
        mealDiv.className =
            "place-items-center m-2 border-2 border-dashed rounded-xl";
        mealDiv.style.boxShadow = "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px";
        
        // We insert the details of each meal in the HTML of the meal div 
        mealDiv.innerHTML = `
            <img class="w-full md:h-80 object-cover rounded-2xl p-2" src="${meal?.strMealThumb}" alt="">
            <h1 class="text-[18px] md:text-[20px] font-semibold text-balance text-center">${meal?.strMeal}</h1>
            <p><b><i>Area:</i></b> ${meal?.strArea}</p>
            <p class=pb-2><b><i>Category:</i></b> ${meal?.strCategory}</p>
        `;
        
        // We append each newly created div to the meal container
        mealsContainer.appendChild(mealDiv);
    });
};