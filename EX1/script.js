const fruits = [
    { name: "Apple", img: "https://cff2.earth.com/uploads/2019/06/19132041/How-the-apple-became-such-a-ubiquitous-iconic-fruit-across-the-globe.jpg", desc: "Fresh juicy apples from Kashmir.", qty: 50, price: 120, rating: 4.5 },
    { name: "Mango", img: "https://i.pinimg.com/originals/12/da/4b/12da4b095b8597762dabeacf12820121.jpg", desc: "Sweet Alphonso mangoes.", qty: 30, price: 150, rating: 5 },
    { name: "Orange", img: "http://3.bp.blogspot.com/-tVoQ9O2IU_E/UDzWrWgr2TI/AAAAAAAAIZ8/ojl3vvQ-XV8/s1600/Orange+Fruits+Wallpapers+1.jpg", desc: "Fresh Nagpur oranges.", qty: 40, price: 90, rating: 4.2 },
    { name: "Banana", img: "https://www.tytyga.com/v/vspfiles/photos/FRUBAN-FRU-S-TX-STAR-2.jpg", desc: "Organic Kerala bananas.", qty: 60, price: 60, rating: 4 },
    { name: "Grapes", img: "https://cdn.mos.cms.futurecdn.net/e8Xz4Ty7uifKiD7dmHjvfi-1200-80.jpg", desc: "Green seedless grapes.", qty: 45, price: 110, rating: 4.3 }
];

const vegetables = [
    { name: "Carrot", img: "https://www.knowyourproduce.com/wp-content/uploads/2022/08/how-to-grow-carrots-2.png", desc: "Organic farm-fresh carrots.", qty: 70, price: 80, rating: 4.1 },
    { name: "Tomato", img: "https://www.thespruce.com/thmb/Cd1ZIVdO2Fqa6JAKEGz9LvxBMSM=/5750x3827/filters:fill(auto,1)/growing-tomatoes-1403296-01-38586b67236f4339914fdf5587cde085.jpg", desc: "Fresh red tomatoes.", qty: 80, price: 40, rating: 4.4 },
    { name: "Onion", img: "https://static.vecteezy.com/system/resources/previews/000/808/141/large_2x/big-red-onions-background-photo.jpg", desc: "Premium quality onions.", qty: 100, price: 30, rating: 4.2 },
    { name: "Potato", img: "https://www.farmersalmanac.com/wp-content/uploads/2020/11/potato-crop-AdobeStock_274122906-1024x683.jpeg", desc: "Fresh potatoes from Ooty.", qty: 90, price: 25, rating: 4.3 },
    { name: "Spinach", img: "https://www.theayurveda.org/wp-content/uploads/2015/08/Different-types-of-Spinach.jpg", desc: "Fresh green spinach leaves.", qty: 60, price: 20, rating: 4.5 }
];

// Function to generate product cards
function renderProducts(category, containerId) {
    const container = document.getElementById(containerId);
    category.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>₹${item.price}/kg</p>
        `;
        card.onclick = () => showProductDetails(item);
        container.appendChild(card);
    });
}

function showProductDetails(item) {
    document.getElementById("modalImg").src = item.img;
    document.getElementById("modalName").innerText = item.name;
    document.getElementById("modalDesc").innerText = item.desc;
    document.getElementById("modalQty").innerText = item.qty;
    document.getElementById("modalPrice").innerText = item.price;
    document.getElementById("modalRating").innerText = item.rating;
    document.getElementById("productModal").style.display = "block";
}

// Close modal
document.querySelector(".close").onclick = function() {
    document.getElementById("productModal").style.display = "none";
}

// Render on load
renderProducts(fruits, "fruits");
renderProducts(vegetables, "vegetables");
