const them = document.querySelector(".clors");
let colorsSvg = document.getElementById("colorsSvg");
let colorsText = document.getElementById("colorsText");

them.addEventListener("click", () => {
  const elRoot = document.documentElement;
  let dataTheme = elRoot.getAttribute("data-theme");

  if (dataTheme === "light") {
    elRoot.setAttribute("data-theme", "dark");

    document.querySelector(".light").classList.toggle("active");
    colorsText.innerHTML = `Light Mode`;
    document.querySelector(".dark").classList.toggle("active");
  } else {
    elRoot.setAttribute("data-theme", "light");
    colorsText.innerHTML = `Dark Mode`;
    document.querySelector(".dark").classList.toggle("active");
    document.querySelector(".light").classList.toggle("active");
  }
});

let countres = document.querySelector(".countres");

// maping
const api_one =
  "https://countries-restapi.vercel.app/all?sort=title&order=desc";
const api = "https://countries-restapi.vercel.app/all";

const fetchData = async (api) => {
  try {
    const result = await fetch(api);
    const data = await result.json();
    fetchCard(data?.data);
    fetchBtn(data?.data);
    Region(data?.data);
    Search(data?.data);
    Sort(data?.data);
  } catch (error) {
    console.log(error);
  }
};
fetchData(api);

let countMus = 16;
let countMis = 0;
function fetchCard(data) {
  let ui = "";
  data?.slice(countMis, countMus).map((el) => {
    ui += `
       <div class="card" onclick="window.location.href='./pages/detailes.html?common=${
         el.name?.common
       }'">

          <div class="card_img">
            <img src="${el?.flags?.png}" alt="${el.name?.commo}" />
          </div>
          <div class="card_item">
            <h3 style="font-family: Nunito Sans;
            font-size: 18px;
            font-weight: 800;
            line-height: 26px;
            letter-spacing: 0px;
            text-align: left;
            ">${el.name?.common}</h3>
            <p>Population: <span>${el?.population}</span></p> 
            <p>Region: <span>${el?.region}</span></p> 
            <p>Capital: <span>${!el.capital ? "" : el?.capital}</span></p> 
          </div>
        </div>`;
  });
  countres.innerHTML = ui;
}


// region

let region1 = document.querySelector(".region1");

function Region(data) {
  region1.addEventListener("change", (e) => {
    let value = e.target.value;
    countMis = 0;
    countMus = 16;
    let countryData = data?.filter((el) => {
      return value === "all" ? el : el?.region == value;
    });
    fetchCard(countryData);
  });
}

// Sort

let sort = document.querySelector(".region");

function Sort(data) {
  sort.addEventListener("change", (e) => {
    let value = e.target.value;
    countMis = 0;
    countMus = 16;
    if (value === "population") {
      data.sort((a, b) => b?.population - a?.population);
    }
    if (value === "all") {
      fetchData(api);
    }
    if (value === "region") {
      data.sort((a, b) => {
        let regionA = a.region.toLowerCase();
        let regionB = b.region.toLowerCase();
        if (regionA < regionB) {
          return -1;
        }
      });
    }
    if (value === "capital") {
      data.sort((a, b) => {
        let capitalA =
          Array.isArray(a.capital) && a.capital.length > 0
            ? a.capital[0].toLowerCase()
            : "";
        let capitalB =
          Array.isArray(b.capital) && b.capital.length > 0
            ? b.capital[0].toLowerCase()
            : "";
        if (capitalA < capitalB) {
          return -1;
        }
      });
    }
    if (value === "title") {
      data.sort((a, b) => {
        let regionA = a.name?.common?.toLowerCase();
        let regionB = b.name?.common?.toLowerCase();
        if (regionA < regionB) {
          return -1;
        }
      });
    }

    fetchCard(data);
  });
}

// Search

let search = document.getElementById("search");
function Search(data) {
  search.addEventListener("input", (e) => {
    countMis = 0;
    countMus = 16;
    let value = e.target.value.toLowerCase(e);
    let searchData = data?.filter((el) => {
      return (
        el?.region?.toLowerCase().includes(value) ||
        el?.name?.common?.toLowerCase().includes(value)
      );
    });
    fetchCard(searchData);
    fetchBtn(searchData);
  });
}




let btns = document.querySelector(".btns");
let nextBtn = document.querySelector(".right_btn");
let backBtn = document.querySelector(".left_btn");
let searchInput = document.querySelector("#search_input");
let currentPage = 1; // Initialize currentPage to 1

const fetchBtn = (data) => {
  let ui = "";
  const numberOfPages = Math.ceil(data?.length / 16);
  for (let index = 1; index <= numberOfPages; index++) {
    ui += `
    <button class="btn ${
      index === currentPage ? "active" : ""
    }" onclick="pagination(${index})">${index}</button>`;
  }
  btns.innerHTML = ui;

  let btn = document.querySelectorAll(".btn");
  btn.forEach((element) => {
    element.addEventListener("click", function () {
      btn.forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");
    });
  });
};

async function pagination(id) {
  try {
    const result = await fetch(api);
    const data = await result.json();
    const Max = Math.ceil(data?.data?.length / 16);
    if (id >= 1 && id <= Max) {
      currentPage = id; // Update currentPage
      countMis = (id - 1) * 16;
      countMus = countMis + 16;
      fetchCard(data?.data);
      fetchBtn(data?.data); // Update buttons
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to handle next button click
nextBtn.addEventListener("click", async () => {
  try {
    const result = await fetch(api);
    const data = await result.json();
    const Max = Math.ceil(data?.data?.length / 16);
    if (currentPage < Max) {
      currentPage++; // Increment currentPage
      pagination(currentPage); // Fetch and display data for the next page
    }
  } catch (error) {
    console.log(error);
  }
});

// Function to handle back button click
backBtn.addEventListener("click", async () => {
  if (currentPage > 1) {
    currentPage--; // Decrement currentPage
    pagination(currentPage); // Fetch and display data for the previous page
  }
});

// Function to handle search input
searchInput.addEventListener("keyup", async (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();
    // Perform search operation using the searchTerm
    // Update data and pagination accordingly
  }
});

// Initial fetch and display of data
fetchBtn(api);
pagination(currentPage);

