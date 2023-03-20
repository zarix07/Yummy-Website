
function openSideNav() {
    $(".side-nav").animate({left: 0}, 500)
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
        $(".nav-links li").eq(i).animate({top: 0}, (i + 5) * 100)}
}

function closeSideNav() {
    let boxWidth = $(".side-nav .nav-tab").outerWidth()
    $(".side-nav").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    $(".nav-links li").animate({
        top: 300
    }, 500)
}

closeSideNav()
$(".side-nav i.open-close-icon").click(() => {
    if ($(".side-nav").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})


let showData = document.getElementById("rowData")
let searchPage = document.getElementById("searchPage")
$(document).ready(() => {
    $(".loading").fadeOut(500);
    $("body").css("overflow", "visible");
});

async function getMeals(term){
    $(".loading").fadeIn(300);
    $("body").css("overflow", "hidden");
    let api=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    let response =await api.json()
    displayMeals(response.meals)
    $(".loading").fadeOut(300);
    $("body").css("overflow", "visible");
}
getMeals("")

function displayMeals(arr){
    let meals = ``
    for(let i = 0; i<arr.length ; i++){
        meals+=`<div class="col-md-3">
        <div onclick="getMealDetails(${arr[i].idMeal})" class="meal position-relative rounded-2 overflow-hidden">
            <img class="w-100" src="${arr[i].strMealThumb}" alt="">
            <div class="meal-layer">
                <h3>${arr[i].strMeal}</h3>
            </div>
        </div>
    </div>`
    }
    showData.innerHTML = meals
    closeSideNav()
    $("#mealDetails").fadeOut(300)
}


async function getMealDetails(mealId){
    $(".loadeing").fadeIn(200);
    $("body").css("overflow", "hidden");
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    let response =await api.json()
    displayMealDetails(response.meals[0])
    closeSideNav();
    $(".loading").fadeOut(300);
    $("body").css("overflow", "visible");
}

function displayMealDetails(arr){
    let mealDetails = ``;
    let mealIngredients = ``;
    let mealTags = ``;
    $("#searchPage").addClass("d-none");
    for (let i = 1; i <= 20; i++) {
        if (arr[`strIngredient${i}`]) {
          mealIngredients += `<li class="alert alert-info m-2 p-2">${
            arr[`strMeasure${i}`]
          } ${arr[`strIngredient${i}`]}</li>`;
        }
      }
      if (arr.strTags) {
        let tags = arr.strTags.split(",");
        for (let i = 0; i < tags.length; i++) {
          mealTags += `<li class="alert alert-danger m-2 p-2">${tags[i]}</li>`;
        }
      }
      mealDetails=`<div class="col-md-4">
    <img src="${arr.strMealThumb}" class="w-100 rounded-3" alt="">
    <h2>${arr.strMeal}</h2>
</div>
<div class="col-md-8">
    <h2>Instructions</h2>
    <p>${arr.strInstructions}</p>
    <h3><span class="fw-bolder">Area :</span> ${arr.strArea}</h3>
    <h3><span class="fw-bolder">Category :</span> ${arr.strCategory}</h3>
    <h3 class="my-3">
      <span class="fw-bold">Recipes : </span>
    </h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
    ${mealIngredients}
    </ul>
    <h3 class="my-3">
      <span class="fw-bold">Tags : </span>
    </h3>
    <ul class="recipesList list-unstyled d-flex flex-wrap">
    ${mealTags}
    </ul>
    <a target="_blank" class="btn btn-success" href="${arr.strSource}">Source</a>
    <a target="_blank" class="btn btn-danger" href="${arr.strYoutube}">Youtube</a>
</div>`
showData.innerHTML = mealDetails;
}

function getSearchPage(){
    $(".loading").fadeIn(100);
    $("body").css("overflow", "hidden");
    $("#searchPage").removeClass("d-none")
    showData.innerHTML = ""
    $(".loading").fadeOut(300);
    $("body").css("overflow", "visible");
    closeSideNav();
}

$("#search").click(function(){
    getSearchPage()
})


async function searchByName(term){
    showData.innerHTML = ""
    $(".loading").fadeIn(200)
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    let response =await api.json()
    if (response.meals == null) {
    } else {
      displayMeals(response.meals);
    }
    $(".loading").fadeOut(200)
}

async function searchByFirstLetter(term){
    showData.innerHTML = ""
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    let response =await api.json()
    console.log(response);
    displayMeals(response.meals)
}

$("#categories").click(function(){
    getCategoriesPage()
})

async function getCategoriesPage(){
    $(".loading").fadeIn(100);
    $("body").css("overflow", "hidden");
    $("#searchPage").addClass("d-none")
    showData.innerHTML = ""
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let response =await api.json() 
    displayCategories(response.categories)
    $(".loading").fadeOut(100);
    $("body").css("overflow", "visible");
}

function displayCategories(arr){
    let categories = ``
    for(let i = 0; i<arr.length; i++){
        categories+=`<div class="col-md-3">
        <div class="meals position-relative overflow-hidden rounded-2" onclick="getCategoryMeals('${arr[i].strCategory}')">
            <img src="${arr[i].strCategoryThumb}" class="w-100" alt="">
            <div class="meal2-layer position-absolute text-center text-black p-2">
                <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
    </div>`
    }
    showData.innerHTML = categories
    closeSideNav();
}

async function getCategoryMeals(category){
    $("loading").fadeIn(200)
    $("body").css("overflow","hidden")
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let response =await api.json()
    displayMeals(response.meals.slice(0, 20))
    $("loading").fadeOut(200)
    $("body").css("overflow","visible")
}

$("#area").click(function(){
    getAreaPage()
})
async function getAreaPage(){
    $(".loading").fadeIn(200);
    $("body").css("overflow", "hidden");
    $("#searchPage").addClass("d-none");
    showData.innerHTML = "";
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let response =await api.json()
    displayArea(response.meals)
    $(".loading").fadeOut(200);
    $("body").css("overflow", "visible");
    closeSideNav()
}

function displayArea(arr){
    let area = ``
    for(let i = 0; i<arr.length; i++){
        area +=`<div class="col-md-3">
        <div class="rounded-2 text-center" onclick="getAreaMeals('${arr[i].strArea}')">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${arr[i].strArea}</h3>
        </div>
    </div>`
    }
    showData.innerHTML = area
}

async function getAreaMeals(area){
    $(".loading").fadeIn(200);
    $("body").css("overflow", "hidden");
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let response =await api.json()
    console.log(response);
    displayMeals(response.meals)
    $(".loading").fadeOut(200);
    $("body").css("overflow", "visible");
}

$("#ingredients").click(function(){
    getIngredientsPage()
})

async function getIngredientsPage(){
    $(".loading").fadeIn(200);
    $("body").css("overflow", "hidden");
    $("#searchPage").addClass("d-none");
    showData.innerHTML = ""
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let response =await api.json() 
    displayIngredients(response.meals.slice(0,20))
    $(".loading").fadeOut(200);
    $("body").css("overflow", "visible");
    closeSideNav()
}

function displayIngredients(arr){
    let ingredients = ``
    for(let i = 0 ; i<arr.length; i++){
        ingredients+=`<div class="col-md-3">
        <div class="text-center rounded-2" onclick="getIngredientsMeals('${arr[i].strIngredient}')">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${arr[i].strIngredient}</h3>
            <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
        </div>
    </div>`
    }
    showData.innerHTML = ingredients
}

async function getIngredientsMeals(ingredient){
    $(".loading").fadeIn(200);
    $("body").css("overflow", "hidden");
    let api =await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    let response = await api.json()
    displayMeals(response.meals)
    $(".loading").fadeOut(200);
    $("body").css("overflow", "visible");
}

$("#contactUs").click(function(){
    getContact()
})

function getContact(){
    $(".loading").fadeIn(200);
    $("body").css("overflow", "hidden");
    $("#searchPage").addClass("d-none");
    showData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-1 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-1 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" type="tel" class="form-control" placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-1 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-1 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-1 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input id="repasswordInput" type="password" class="form-control" placeholder="RePassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-1 d-none">
                    Enter valid repassword
                </div>
            </div>
        </div>
        <button id="submitBtn" class="btn btn-outline-danger px-2 mt-3 disabled">Submit</button>
    </div>
</div>`
    $(".loading").fadeOut(200);
    $("body").css("overflow", "visible");
    closeSideNav()

    $("#nameInput").bind("input", function () {
        if (nameValidation()) {
          document
            .getElementById("nameAlert")
            .classList.replace("d-block", "d-none");
          checkContactData();
        } else {
          document
            .getElementById("nameAlert")
            .classList.replace("d-none", "d-block");
        }
      });
      $("#emailInput").bind("input", function () {
        if (emailValidation()) {
          document
            .getElementById("emailAlert")
            .classList.replace("d-block", "d-none");
          checkContactData();
        } else {
          document
            .getElementById("emailAlert")
            .classList.replace("d-none", "d-block");
        }
      });
      $("#phoneInput").bind("input", function () {
        if (phoneValidation()) {
          document
            .getElementById("phoneAlert")
            .classList.replace("d-block", "d-none");
          checkContactData();
        } else {
          document
            .getElementById("phoneAlert")
            .classList.replace("d-none", "d-block");
        }
      });
      $("#ageInput").bind("input", function () {
        if (ageValidation()) {
          document
            .getElementById("ageAlert")
            .classList.replace("d-block", "d-none");
          checkContactData();
        } else {
          document
            .getElementById("ageAlert")
            .classList.replace("d-none", "d-block");
        }
      });
      $("#passwordInput").bind("input", function () {
        if (passwordValidation()) {
          document
            .getElementById("passwordAlert")
            .classList.replace("d-block", "d-none");
          checkContactData();
        } else {
          document
            .getElementById("passwordAlert")
            .classList.replace("d-none", "d-block");
        }
      });
      $("#repasswordInput").bind("input", function () {
        if (repeatPasswordValidation()) {
          document
            .getElementById("repasswordAlert")
            .classList.replace("d-block", "d-none");
          checkContactData();
        } else {
          document
            .getElementById("repasswordAlert")
            .classList.replace("d-none", "d-block");
        }
      });
    }
    
    function nameValidation() {
      return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
    }
    
    function emailValidation() {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        document.getElementById("emailInput").value
      );
    }
    
    function phoneValidation() {
      return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        document.getElementById("phoneInput").value
      );
    }
    
    function ageValidation() {
      return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
        document.getElementById("ageInput").value
      );
    }
    
    function passwordValidation() {
      return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
        document.getElementById("passwordInput").value
      );
    }
    
    function repeatPasswordValidation() {
      return (
        document.getElementById("repasswordInput").value ==
        document.getElementById("passwordInput").value
      );
    }
    function checkContactData() {
      let submitBtn = document.querySelector("#submitBtn");
      if (
        nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repeatPasswordValidation()
      ) {
        submitBtn.classList.remove("disabled");
      } else {
        submitBtn.classList.add("disabled");
      }
}

