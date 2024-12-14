import{A as l}from"./constants-BZTBaIRL.js";import{u as m,e as g,g as b}from"./main-CXDMWpks.js";async function f(){var r,n,s;const t=document.getElementById("product-details");if(!t){console.error("Product container not found");return}try{const o=new URLSearchParams(window.location.search).get("id");if(!o){console.error("Product ID not found in URL"),t.innerHTML="<p>Product not found.</p>";return}const e=await g(o);if(!e||!e.id){console.error("Invalid product data:",e),t.innerHTML="<p>Product details unavailable.</p>";return}const{title:a,description:d,media:i,endsAt:p,_count:c}=e;t.innerHTML=`
      <div class="container">
        <h1 class="text-center">${a}</h1>
        <img src="${((r=i==null?void 0:i[0])==null?void 0:r.url)||""}" alt="${((n=i==null?void 0:i[0])==null?void 0:n.alt)||"No image available"}" class="img-fluid mx-auto d-block my-4" style="display: ${(s=i==null?void 0:i[0])!=null&&s.url?"block":"none"};" />
        <p>${d||"No description available."}</p>
        <p><strong>Ends at:</strong> ${new Date(p).toLocaleString()}</p>
        <p class="bids-display" style="font-size: 1.5rem; font-weight: bold;">
          <strong>Bids:</strong> <span class="bids-count">${(c==null?void 0:c.bids)||0}</span>
        </p>
      </div>
    `}catch(o){console.error("Error rendering product details:",o),t.innerHTML="<p>Error loading product details. Please try again later.</p>"}}async function h(t){var s;const r=document.getElementById("bidForm");if(!r){console.error("Bid form not found");return}let n=0;try{const a=((s=(await(await fetch(`${l}/${t}?_bids=true`)).json()).data)==null?void 0:s.bids)||[];n=a.length?Math.max(...a.map(d=>d.amount)):0}catch(o){console.error("Error fetching product bids:",o)}r.addEventListener("submit",async o=>{o.preventDefault();const e=parseFloat(document.getElementById("bidAmount").value.trim());if(!e||isNaN(e)){alert("Please enter a valid bid amount.");return}if(e<=n){alert(`Your bid must be higher than the current highest bid: ${n} points.`);return}try{await b(t,e),alert("Bid added successfully!"),document.querySelector(".bids-count").textContent=parseInt(document.querySelector(".bids-count").textContent)+1,n=e,await u(t)}catch(a){console.error("Error adding bid:",a),alert("Failed to add bid. Please try again.")}})}async function u(t){var n;const r=document.getElementById("bids-container");if(!r){console.error("Bids container not found");return}try{const e=((n=(await(await fetch(`${l}/${t}?_bids=true`)).json()).data)==null?void 0:n.bids)||[];if(e.length===0){r.innerHTML='<p class="text-center">No bids available for this product.</p>';return}r.innerHTML=`
      <h3 class="mt-4">Bids</h3>
      <ul class="list-group">
        ${e.map(a=>{var d;return`<li class="list-group-item">
                <div><strong>Amount:</strong> ${a.amount} points</div>
                <div><strong>Bidder:</strong> ${((d=a.bidder)==null?void 0:d.name)||"Anonymous"}</div>
                <div><small>Placed on: ${new Date(a.created).toLocaleString()}</small></div>
              </li>`}).join("")}
      </ul>
    `}catch(s){console.error("Error fetching bids:",s),r.innerHTML='<p class="text-center">Error loading bids. Please try again later.</p>'}}document.addEventListener("DOMContentLoaded",async()=>{m();const t=new URLSearchParams(window.location.search).get("id");t&&(await f(),await h(t),await u(t))});
