const searchbox = document.querySelector('.searchbox');
const searchbutton = document.querySelector('.searchbutton');
const recipecontainer = document.querySelector('.recipecontainer');
const recipedetailscontent=document.querySelector('.recipedetailscontent')
const recipeclosebtn=document.querySelector('.recipeclosebtn')

if (searchbox && searchbutton && recipecontainer) {
    const fetchRecipes = async (query) => {
        recipecontainer.innerHTML="<h2>Fetching Recipes....</h2>";
        try {
            const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const response = await data.json();
            recipecontainer.innerHTML="";
            response.meals.forEach(meal => {
                const recipeDiv=document.createElement('div')
                recipeDiv.classList.add('recipe')
                recipeDiv.innerHTML=`
                    <img src="${meal.strMealThumb}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `
                const button=document.createElement('button')
                button.textContent="View Recipe"
                recipeDiv.appendChild(button)
                recipecontainer.appendChild(recipeDiv)
                button.addEventListener('click',()=>{
                    openRecipePopup(meal);
                })
            });

        } catch (error) {
            recipecontainer.innerHTML=`<h2>ERROR!! NO RECIPES FOUND</h2>`
            console.error('Error fetching recipes:', error);
        }
    };
    //function to fetch ingredients and measurements
    const fetchIngredients=(meal)=>{
       let ingredientList=""
        for(i=1;i<=20;i++){
            const ingredients=meal[`strIngredient${i}`]
            if(ingredients){
                const measure=meal[`strMeasure${i}`]
                ingredientList+=`<li>${measure} ${ingredients}</li>`
            }
            else{
                break
            }
        }
        return ingredientList
    }
    const openRecipePopup=(meal)=>{
        recipedetailscontent.innerHTML=`
            <h2 class="recipeName">${meal.strMeal}</h2>
            <h3>Ingredients:</h3>
            <ul class="IngredientList">
            ${fetchIngredients(meal)}
            </ul>
            <div class="recipeInstructions">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>   
            </div>
            `
        recipedetailscontent.parentElement.style.display="block"
    }
recipeclosebtn.addEventListener('click',()=>{
    recipedetailscontent.parentElement.style.display="none"
})
    searchbutton.addEventListener('click', (e) => {
        e.preventDefault();
        const searchInput = searchbox.value.trim();
        if (searchInput) {
            fetchRecipes(searchInput);
        } else {
            console.error('Please enter a search term');
        }
        if(!searchInput){
            recipecontainer.innerHTML=`<h2>Type the Dish Name!!!`
            return
        }
    });
}

