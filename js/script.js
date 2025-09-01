const searchBar = document.getElementById("search-bar"); 
const searchButton = document.getElementById("search-button");
const errorID = document.getElementById("error-message");

const resultDiv = document.createElement('div');
document.body.appendChild(resultDiv);

document.body.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
        resultDiv.innerHTML = ''
        handleInput();
    }
})

searchButton.addEventListener("click", () => {
    resultDiv.innerHTML = '';
    handleInput();
});

const handleInput = () => {
    const userInput = searchBar.value;
    if (userInput.trim() === '')
        displayError();
    else
        loadRecipes(userInput);
}

const displayError = () => {
    if (errorID === null) {
        createMsg('error');
    }
};

const createMsg = (msgType) => {
    const msg = document.createElement("div");
    
    msg.className = "flex justify-center items-center py-2";

    let icon, text = ''

    if (msgType === 'error') {
        msg.id = "error-message";
        msg.classList.add('text-red-500');
        icon = '<i class="fa-solid fa-triangle-exclamation"></i>'
        text = "<strong>Error:</strong> Input field empty"
    } else {
        msg.id = "warning-message";
        msg.classList.add("text-orange-500");
        icon = '<i class="fa-solid fa-circle-exclamation"></i>';
        text = "<strong>Warning:</strong> No recipes found"
    }

    msg.innerHTML = `
        ${icon}
        <span class="mx-2">${text}</span>`;
        
    resultDiv.appendChild(msg);
}

const loadRecipes = (userInput) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`)
        .then((response) => response.json())
            .then((data) => {
                if (errorID !== null) 
                    errorID.remove();
                if (data?.meals === null) {
                    createMsg('warning');
                } else {
                    displayData(data?.meals)
                }
            }
        )
    };

const displayData = (meals) => {
    const mealsContainer = document.createElement("div");

    mealsContainer.className =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 lg:px-4 xl:px-20 py-4";
    resultDiv.appendChild(mealsContainer);

    meals.forEach((meal) => {
        const mealDiv = document.createElement("div");
        mealDiv.className =
            "place-items-center m-2 border-2 border-dashed rounded-xl";
        mealDiv.style.boxShadow = "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px";
        
        mealDiv.innerHTML = `
            <img class="w-full md:h-80 object-cover rounded-2xl p-2" src="${meal?.strMealThumb}" alt="">
            <h1 class="text-[18px] md:text-[20px] font-semibold text-balance text-center">${meal?.strMeal}</h1>
            <p>Area: ${meal?.strArea}</p>
            <p class=pb-2>Category: ${meal?.strCategory}</p>
        `;
        
        mealsContainer.appendChild(mealDiv);
    });
};