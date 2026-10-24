const products = [
  {id:1,name:"Cloudwalk Sneakers",category:"Sneakers",price:1899,tag:"Bestseller",rating:"4.9",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85"},
  {id:2,name:"Everyday Canvas",category:"Casual",price:1299,tag:"Easy wear",rating:"4.7",image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=85"},
  {id:3,name:"Cityline Loafers",category:"Formal",price:2199,tag:"New",rating:"4.8",image:"https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=85"},
  {id:4,name:"Sunday Slides",category:"Sandals",price:799,tag:"Everyday",rating:"4.6",image:"https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=85"},
  {id:5,name:"Retro Court Sneakers",category:"Sneakers",price:1999,tag:"Popular",rating:"4.8",image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=85"},
  {id:6,name:"Softstep Flats",category:"Casual",price:999,tag:"Lightweight",rating:"4.5",image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=85"},
  {id:7,name:"Office Edit Oxfords",category:"Formal",price:2499,tag:"Classic",rating:"4.7",image:"https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=85"},
  {id:8,name:"Weekend Comfort Sandals",category:"Sandals",price:1099,tag:"Comfort pick",rating:"4.6",image:"https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=85"}
];
// Keep image URLs separate from product logic so they are easy to replace if a photo is unavailable.
products[6].image = "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=85";

let activeFilter = "All";
let cart = [];
const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const emptyState = document.getElementById("empty-state");
const cartDrawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

const money = value => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);

function renderProducts(){
  let list = products.filter(p => (activeFilter === "All" || p.category === activeFilter) &&
    (p.name.toLowerCase().includes(searchInput.value.trim().toLowerCase()) || p.category.toLowerCase().includes(searchInput.value.trim().toLowerCase())));
  if(sortSelect.value === "low") list.sort((a,b)=>a.price-b.price);
  if(sortSelect.value === "high") list.sort((a,b)=>b.price-a.price);
  if(sortSelect.value === "name") list.sort((a,b)=>a.name.localeCompare(b.name));
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x700/f0eee7/20251f?text=Footsy+Footwear'">
        <span class="product-tag">${p.tag}</span>
        <button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button>
      </div>
      <div class="product-info"><p class="product-type">${p.category}</p><h3 class="product-name">${p.name}</h3>
      <div class="product-bottom"><span class="price">${money(p.price)}</span><span class="rating">★ ${p.rating}</span></div></div>
    </article>`).join("");
  emptyState.hidden = list.length !== 0;
}
function notify(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(notify.timer); notify.timer = setTimeout(()=>toast.classList.remove("show"),2100);
}
function addToCart(id){
  const found = cart.find(item=>item.id===id);
  if(found) found.qty += 1; else cart.push({id,qty:1});
  renderCart(); notify("Added to your bag!");
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty += delta; if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  renderCart();
}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById("cart-count").textContent=count;
  document.getElementById("drawer-count").textContent=`(${count})`;
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  document.getElementById("cart-total").textContent=money(total);
  const container=document.getElementById("cart-items");
  if(!cart.length){container.innerHTML='<p class="cart-empty">Your bag is waiting for a little something.<br><br>Find a pair you love and add it here.</p>';return;}
  container.innerHTML=cart.map(item=>{
    const p=products.find(product=>product.id===item.id);
    return `<div class="cart-line"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="qty-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><div><div class="line-price">${money(p.price*item.qty)}</div><button class="remove-button" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div></div>`;
  }).join("");
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("open");cartDrawer.setAttribute("aria-hidden","false");}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true");}

grid.addEventListener("click",event=>{const button=event.target.closest("[data-add]");if(button)addToCart(Number(button.dataset.add));});
document.querySelectorAll(".filter-chip").forEach(button=>button.addEventListener("click",()=>{
  activeFilter=button.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b===button));
  renderProducts();
}));
document.querySelectorAll("[data-filter-link]").forEach(link=>link.addEventListener("click",()=>{activeFilter=link.dataset.filterLink;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));renderProducts();}));
searchInput.addEventListener("input",renderProducts);
sortSelect.addEventListener("change",renderProducts);
document.getElementById("search-toggle").addEventListener("click",()=>{document.getElementById("search-wrap").scrollIntoView({behavior:"smooth",block:"center"});searchInput.focus();});
document.getElementById("cart-toggle").addEventListener("click",openCart);
document.getElementById("cart-close").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeCart();});
document.getElementById("cart-items").addEventListener("click",event=>{
  const qty=event.target.closest("[data-qty]"); const remove=event.target.closest("[data-remove]");
  if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));
  if(remove){cart=cart.filter(item=>item.id!==Number(remove.dataset.remove));renderCart();}
});
document.getElementById("checkout-button").addEventListener("click",()=>{
  if(!cart.length){notify("Your bag is empty.");return;}
  notify("Demo checkout — payment is not enabled.");
});
renderProducts();renderCart();
