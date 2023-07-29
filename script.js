const apiKey = "H5gLNKWDpLJqQGi6CrhP6LRuwwewdb1XWLVohXxQquhCAjmzI09MHTMW";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;
const searchInput = document.querySelector(".search input");


const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-images");
const downloadImg = (imgURL) => {
    //converting recieved image into blob & creating the download link & downloading it.
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();  

    }).catch(() => alert("Failed To Download Image!"));
}


const generateHTML = (images) => {

    imagesWrapper.innerHTML += images.map(img => 
        ` <li class="card"><img src="${img.src.large2x}" alt="img">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg(${img.src.large2x})">
                <i class="uil uil-import">
            </i></button>
        </div>
    </li>`).join("");
}

const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    // fetching images by API call with authorization handler
    fetch(apiURL, {
        headers: {Authorization:apiKey}
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed To Load Images!"));
}

loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?pages=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}pages=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

getImages(`https://api.pexels.com/v1/curated?pages=${currentPage}&per_page=${perPage}`);

const loadSearchImages = (e) => {
    if(e.target.value === "") return searchTerm = null;
    // Current Search Term Will Be Invoked!!
    if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}pages=${currentPage}&per_page=${perPage}`);

    }
}


loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);