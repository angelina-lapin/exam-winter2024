import{A as T,a as u,b as w}from"./constants-CbZCZHJ1.js";function g(){var n;const t=localStorage.getItem("user");let e=null;if(t)try{e=((n=JSON.parse(t).data)==null?void 0:n.accessToken)||null}catch(o){console.error("Failed to parse user data:",o)}const r=new Headers;return e?r.append("Authorization",`Bearer ${e}`):console.warn("No authorization token found."),r.append("X-Noroff-API-Key",T),r.append("Content-Type","application/json"),r}async function A(t=1,e=50){try{const r=await fetch(`${u}?_sort=createdAt&_order=desc&_page=${t}&_limit=${e}`);if(!r.ok)throw new Error("Failed to fetch listings");const n=await r.json(),o=Array.isArray(n.data)?n.data:[],a=parseInt(r.headers.get("X-Total-Count"),10)||0;return{items:o,totalCount:a}}catch(r){return console.error("Error during fetchAuctions:",r),{items:[],totalCount:0}}}async function x(t){const e=`${u}/${t}`;try{const r=await fetch(e);if(!r.ok)throw new Error("Failed to fetch product details");return(await r.json()).data}catch(r){throw console.error("Error fetching product by ID:",r),r}}async function M(t){try{const e=`${u}/search?q=${encodeURIComponent(t)}`,r=await fetch(e);if(!r.ok)throw new Error("Failed to fetch search results");return(await r.json()).data}catch(e){return console.error("Error during searchListings:",e),[]}}async function N(t,e){try{const r=g();if(!r.has("Authorization"))throw alert("You must be logged in to place a bid."),new Error("Authorization header missing.");const n=await fetch(`${u}/${t}/bids`,{method:"POST",headers:r,body:JSON.stringify({amount:e})});if(!n.ok){const o=await n.text();throw console.error("Response error:",o),new Error("Failed to add bid")}return await n.json()}catch(r){throw console.error("Error adding bid:",r),r}}async function D(t){try{const e=await fetch(`${w}/auction/profiles/${t}`,{headers:g()});if(!e.ok)throw new Error("Failed to fetch user profile");return await e.json()}catch(e){return console.error("Error fetching user profile:",e),null}}async function U(t){var n;const e=JSON.parse(localStorage.getItem("user"));if(!e||!((n=e.data)!=null&&n.name)){console.error("User not logged in or missing profile name");return}const r=[e.data.name];try{const o=await fetch(`${w}/auction/profiles/${r}`,{method:"PUT",headers:g(),body:JSON.stringify(t)});if(!o.ok)throw new Error("Failed to update user profile");return await o.json()}catch(o){throw console.error("Error updating user profile:",o),o}}async function O(t){try{const e=await fetch(u,{method:"POST",headers:g(),body:JSON.stringify(t)});if(!e.ok){const r=await e.text();throw new Error(r||"Failed to create listing")}return await e.json()}catch(e){throw console.error("Error creating listing:",e),e}}async function _(t){try{const e=await fetch(`${w}/auction/profiles/${t}/listings`,{headers:g()});if(!e.ok)throw new Error("Failed to fetch user listings");return(await e.json()).data||[]}catch(e){return console.error("Error fetching user listings:",e),[]}}async function R(t){try{const e=await fetch(`${u}/${t}`,{method:"DELETE",headers:g()});if(e.status!==204){const r=await e.text();throw new Error(r||"Failed to delete listing")}}catch(e){throw console.error("Error deleting listing:",e),e}}async function $(t=[],e=1,r=50){const n=document.getElementById("items-grid"),o=document.getElementById("pagination");if(!n||!o){console.error("Required containers not found.");return}const a=(e-1)*r,s=t.slice(a,a+r);if(!Array.isArray(s)||s.length===0){n.innerHTML='<p class="text-center">No items available to display.</p>';return}n.innerHTML="",s.forEach(i=>{var p,d,h,f,m,v,E;const c=document.createElement("div");c.className="col-md-4 mb-4",c.innerHTML=`
      <div class="card h-100">
        <div class="card-img-container">
        <img src="${((d=(p=i.media)==null?void 0:p[0])==null?void 0:d.url)||""}" class="card-img-top" alt="${((f=(h=i.media)==null?void 0:h[0])==null?void 0:f.alt)||"Image unavailable"}" style="display: ${(v=(m=i.media)==null?void 0:m[0])!=null&&v.url?"block":"none"};" />
        </div>
        <div class="card-body">
          <h5 class="card-title">${i.title}</h5>
          <p class="card-text">Starting bid: ${((E=i._count)==null?void 0:E.bids)||0} points</p>
          <a href="/src/pages/product.html?id=${i.id}" class="btn btn-dark">View Details</a>
        </div>
      </div>
    `,n.appendChild(c)}),H(o,Math.ceil(t.length/r),e,t)}function P(t){var n;const e=JSON.parse(localStorage.getItem("user")),r=((n=e==null?void 0:e.data)==null?void 0:n.name)||"Guest";t.innerHTML=`
    <div class="container-fluid welcome-section text-center text-white bg-dark-green py-5">
      <h1>Welcome to AuctionPlace, ${r}!</h1>
      <p>Start bidding on items or put up your own for auction.</p>
      <div class="search-bar d-flex justify-content-center mt-4">
        <input id="search-input" type="text" class="form-control w-50 me-2" placeholder="Search for items">
        <button id="search-button" class="btn btn-outline-dark">Search</button>
      </div>
      ${e?"":'<button class="btn btn-dark mt-4">Register now and get 1000 credits</button>'}
    </div>
  `}function B(){const t=document.querySelectorAll(".card");t.length&&t.forEach(e=>{e.addEventListener("click",r=>{if(r.target.tagName==="A")return;const n=e.getAttribute("data-id");if(!n){console.error("No product ID found on card.");return}window.location.href=`/src/pages/product.html?id=${n}`})})}function H(t,e,r,n){t.innerHTML="";for(let o=1;o<=e;o++){const a=document.createElement("button");a.className="btn btn-outline-dark mx-1",a.textContent=o,o===r&&a.classList.add("active"),a.addEventListener("click",()=>$(n,o)),t.appendChild(a)}}function j(){const t=document.getElementById("search-button"),e=document.getElementById("search-input"),r=document.getElementById("items-grid");if(!t||!e||!r){console.error("Search elements not found");return}t.addEventListener("click",async()=>{const n=e.value.trim();if(!n){alert("Please enter a search query");return}try{const o=await M(n);r.innerHTML="",o.length===0?r.innerHTML='<p class="text-center">No results found.</p>':o.forEach(a=>{var i,c,p,d,h,f,m;const s=document.createElement("div");s.className="col-md-4 mb-4",s.innerHTML=`
            <div class="card h-100">
              <div class="card-img-container">
              <img src="${((c=(i=a.media)==null?void 0:i[0])==null?void 0:c.url)||""}" class="card-img-top" alt="${((d=(p=a.media)==null?void 0:p[0])==null?void 0:d.alt)||"Image unavailable"}" style="display: ${(f=(h=a.media)==null?void 0:h[0])!=null&&f.url?"block":"none"};" />
              </div>
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title">${a.title}</h5>
                <p class="card-text">Starting bid: ${((m=a._count)==null?void 0:m.bids)||0} points</p>
                <a href="/src/pages/product.html?id=${a.id}" class="btn btn-dark">View Details</a>
              </div>
            </div>
          `,r.appendChild(s)})}catch(o){console.error("Error during search:",o),r.innerHTML='<p class="text-center">Error fetching search results.</p>'}})}async function S(){var e,r,n;const t=document.getElementById("product-details");if(!t){console.error("Product container not found");return}try{const o=new URLSearchParams(window.location.search).get("id");if(!o){console.error("Product ID not found in URL"),t.innerHTML="<p>Product not found.</p>";return}const a=await x(o);if(!a||!a.id){console.error("Invalid product data:",a),t.innerHTML="<p>Product details unavailable.</p>";return}const{title:s,description:i,media:c,endsAt:p,_count:d}=a;t.innerHTML=`
      <div class="container">
        <h1 class="text-center">${s}</h1>
        <img src="${((e=c==null?void 0:c[0])==null?void 0:e.url)||""}" alt="${((r=c==null?void 0:c[0])==null?void 0:r.alt)||"No image available"}" class="img-fluid mx-auto d-block my-4" style="display: ${(n=c==null?void 0:c[0])!=null&&n.url?"block":"none"};" />
        <p>${i||"No description available."}</p>
        <p><strong>Ends at:</strong> ${new Date(p).toLocaleString()}</p>
        <p class="bids-display" style="font-size: 1.5rem; font-weight: bold;">
          <strong>Bids:</strong> <span class="bids-count">${(d==null?void 0:d.bids)||0}</span>
        </p>
      </div>
    `}catch(o){console.error("Error rendering product details:",o),t.innerHTML="<p>Error loading product details. Please try again later.</p>"}}async function C(t){var n;const e=document.getElementById("bidForm");if(!e){console.error("Bid form not found");return}let r=0;try{const s=((n=(await(await fetch(`${u}/${t}?_bids=true`)).json()).data)==null?void 0:n.bids)||[];r=s.length?Math.max(...s.map(i=>i.amount)):0}catch(o){console.error("Error fetching product bids:",o)}e.addEventListener("submit",async o=>{o.preventDefault();const a=parseFloat(document.getElementById("bidAmount").value.trim());if(!a||isNaN(a)){alert("Please enter a valid bid amount.");return}if(a<=r){alert(`Your bid must be higher than the current highest bid: ${r} points.`);return}try{await N(t,a),alert("Bid added successfully!"),document.querySelector(".bids-count").textContent=parseInt(document.querySelector(".bids-count").textContent)+1,r=a,await k(t)}catch(s){console.error("Error adding bid:",s),alert("Failed to add bid. Please try again.")}})}async function k(t){var r;const e=document.getElementById("bids-container");if(!e){console.error("Bids container not found");return}try{const a=((r=(await(await fetch(`${u}/${t}?_bids=true`)).json()).data)==null?void 0:r.bids)||[];if(a.length===0){e.innerHTML='<p class="text-center">No bids available for this product.</p>';return}e.innerHTML=`
      <h3 class="mt-4">Bids</h3>
      <ul class="list-group">
        ${a.map(s=>{var i;return`<li class="list-group-item">
                <div><strong>Amount:</strong> ${s.amount} points</div>
                <div><strong>Bidder:</strong> ${((i=s.bidder)==null?void 0:i.name)||"Anonymous"}</div>
                <div><small>Placed on: ${new Date(s.created).toLocaleString()}</small></div>
              </li>`}).join("")}
      </ul>
    `}catch(n){console.error("Error fetching bids:",n),e.innerHTML='<p class="text-center">Error loading bids. Please try again later.</p>'}}document.addEventListener("DOMContentLoaded",async()=>{I();const t=new URLSearchParams(window.location.search).get("id");t&&(await S(),await C(t),await k(t))});const l=document.getElementById("app"),y={home:"/src/pages/home.html",login:"/src/pages/login.html",register:"/src/pages/registration.html",profile:"/src/pages/profile.html",product:"/src/pages/product.html"};function q(){return!!localStorage.getItem("token")}function I(){const t=document.querySelector(".navbar-nav");if(!t){console.warn("Navigation container not found");return}t.innerHTML="",q()?t.innerHTML=`
      <li class="nav-item">
        <a class="nav-link" href="#" data-route="profile">Profile</a>
      </li>
      <li class="nav-item">
        <button class="btn btn-link nav-link" id="logoutBtn">Logout</button>
      </li>
    `:t.innerHTML=`
      <li class="nav-item">
        <a class="nav-link" href="#" data-route="login">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" data-route="register">Register</a>
      </li>
    `;const e=document.getElementById("logoutBtn");e&&e.addEventListener("click",()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),window.history.pushState({page:"home"},"","/"),b("home")})}function L(t){const e=document.createElement("div");return e.classList.add("container"),t.appendChild(e),e}async function b(t){if(!l){console.warn("App container not found.");return}console.log("Loading page:",y[t]);try{const e=await fetch(y[t]);if(!e.ok){console.error("Error fetching page:",e.status,e.statusText),l.innerHTML="<p>Error loading page. Please try again later.</p>";return}const r=await e.text();if(l.innerHTML=`
      <header class="navbar navbar-expand-lg navbar-dark bg-dark-green">
  <div class="container">
    <a class="navbar-brand" href="/">
      <img
        src="/assets/images/logo.png"  
        alt="AuctionPlace Logo"
        class="logo"
      />
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto"></ul> 
    </div>
  </div>
</header>


      ${r}

      <footer class="footer bg-dark-green text-white text-center py-3">
        <p>&copy; 2024 AuctionPlace. All rights reserved.</p>
      </footer>
    `,I(),t==="home"){let n=document.querySelector(".welcome-section");if(!n){console.warn("Welcome section not found in fetched content. Adding default structure...");const s=l.querySelector(".container")||L(l);s.insertAdjacentHTML("afterbegin",'<div class="welcome-section mb-4"></div>'),n=s.querySelector(".welcome-section")}P(n);let o=document.querySelector("#items-grid"),a=document.querySelector("#pagination");if(!o||!a){const s=l.querySelector(".container")||L(l);o||s.insertAdjacentHTML("beforeend",'<div id="items-grid" class="row"></div>'),a||s.insertAdjacentHTML("beforeend",'<div id="pagination" class="d-flex justify-content-center mt-4"></div>'),o=document.querySelector("#items-grid"),a=document.querySelector("#pagination")}try{const{items:s}=await A();await $(s),j(),B()}catch(s){console.error("Error loading home page:",s)}}else if(t==="product"){const n=new URLSearchParams(window.location.search).get("id");n?await S(n):(console.error("Product ID not found in URL"),l.innerHTML="<p>Product not found.</p>")}}catch(e){console.error("Error loading page:",e),l.innerHTML="<p>Error loading content. Please try again later.</p>"}}document.addEventListener("DOMContentLoaded",()=>{document.body.addEventListener("click",t=>{const e=t.target.closest("a[href]");if(e){const r=e.getAttribute("href");if(r.startsWith("/src/pages/")){t.preventDefault();const n=Object.keys(y).find(o=>r.includes(y[o]));n&&(window.history.pushState({page:n},"",r),b(n))}}}),b("home"),window.addEventListener("popstate",t=>{var r;const e=((r=t.state)==null?void 0:r.page)||"home";b(e)})});export{U as a,_ as b,O as c,R as d,D as f,I as u};
