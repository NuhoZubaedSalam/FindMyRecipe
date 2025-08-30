document.body.addEventListener("keydown", (event) => {
    if (event.code === 'Enter')
        loadRecipes();
})

document.getElementById('search-button').addEventListener("click", () => {
    loadRecipes();
})

const loadRecipes = () => {
    const userInput = document.getElementById('search-bar').value; 
    if (userInput.trim() === "") {

    } else {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`)
            .then(response => response.json())
            .then(data => displayData(data?.meals))
    }
}

function displayData(meals) {
    console.log(meals)
    const mealsContainer = document.createElement('div');
    
    mealsContainer.classList.add()
    mealsContainer.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 lg:px-4 xl:px-20"
    document.body.appendChild(mealsContainer);
    
    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = "place-items-center m-2 border-2 border-dashed rounded-xl"
        mealDiv.innerHTML = `
            <img class="w-full h-60 md:h-80 object-cover rounded-2xl p-2" src="${meal?.strMealThumb}" alt="">
            <h1 class="text-[18px] md:text-[20px] font-semibold text-balance text-center">${meal?.strMeal}</h1>
            <p>Area: ${meal?.strArea}</p>
            <p class=pb-2>Category: ${meal?.strCategory}</p>
        `
        mealsContainer.appendChild(mealDiv);
    });
}