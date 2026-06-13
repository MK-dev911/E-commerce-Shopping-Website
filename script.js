// ==========================================================================
// 1. UI INTERFACE DOM SELECTORS
// ==========================================================================
const searchPanel = document.querySelector('.searchbar');
const favoritePanel = document.querySelector('.favorite');
const cartPanel = document.querySelector('.shoppings');
const accountPanel = document.querySelector('.account');
const navMenu = document.querySelector('.navmenu');

const searchBtn = document.querySelector('#search');
const favoriteBtn = document.querySelector('#favorite');
const cartBtn = document.querySelector('#shoppings');
const loginBtn = document.querySelector('#login');
const menuBtn = document.querySelector('#menu-icon');

// ==========================================================================
// 2. EXCLUSIVE DRAWER SLIDE CONTROLLERS
// ==========================================================================
function closeAllPanels() {
     searchPanel.classList.remove('active');
     favoritePanel.classList.remove('active');
     cartPanel.classList.remove('active');
     accountPanel.classList.remove('active');
     
     if(searchBtn) searchBtn.closest('a').classList.remove('active-icon');
     if(favoriteBtn) favoriteBtn.closest('a').classList.remove('active-icon');
     if(cartBtn) cartBtn.closest('a').classList.remove('active-icon');
     if(loginBtn) loginBtn.closest('a').classList.remove('active-icon');

     menuBtn.classList.remove('open-icon'); 
}

searchBtn.onclick = (e) => {
     e.preventDefault();
     const isActive = searchPanel.classList.contains('active');
     closeAllPanels();
     if (!isActive) {
          searchPanel.classList.add('active');
          searchBtn.closest('a').classList.add('active-icon');
          navMenu.classList.remove('open');
     }
}

favoriteBtn.onclick = (e) => {
     e.preventDefault();
     const isActive = favoritePanel.classList.contains('active');
     closeAllPanels();
     if (!isActive) {
          favoritePanel.classList.add('active');
          favoriteBtn.closest('a').classList.add('active-icon');
          navMenu.classList.remove('open');
     }
}

cartBtn.onclick = (e) => {
     e.preventDefault();
     const isActive = cartPanel.classList.contains('active');
     closeAllPanels();
     if (!isActive) {
          cartPanel.classList.add('active');
          cartBtn.closest('a').classList.add('active-icon');
          navMenu.classList.remove('open');
     }
}

loginBtn.onclick = (e) => {
     e.preventDefault();
     const isActive = accountPanel.classList.contains('active');
     closeAllPanels();
     if (!isActive) {
          accountPanel.classList.add('active');
          loginBtn.closest('a').classList.add('active-icon');
          navMenu.classList.remove('open');
     }
}

// Interlocks lines to close icon morph transformations flawlessly
menuBtn.onclick = (e) => {
     e.stopPropagation();
     const isOpen = navMenu.classList.contains('open');
     closeAllPanels();
     if (!isOpen) {
          navMenu.classList.add('open');
          menuBtn.classList.add('open-icon');
     } else {
          navMenu.classList.remove('open');
          menuBtn.classList.remove('open-icon');
     }
}

// Dismiss window overlay automatically upon item click events
document.querySelectorAll('.navmenu a').forEach(link => {
     link.onclick = () => {
          navMenu.classList.remove('open');
          menuBtn.classList.remove('open-icon');
     };
});

window.addEventListener("scroll", function() {
     const header = document.querySelector("header");
     header.classList.toggle("sticky", window.scrollY > 0);
});

// ==========================================================================
// 3. DYNAMIC SHOPPING BAG RUNTIME ENGINE
// ==========================================================================
let cartData = [];
let wishlistData = []; 

function renderCart() {
     const container = document.querySelector('.cart-items-container');
     const badgeCount = document.querySelector('#cart-count');
     
     if (!container) return;
     container.innerHTML = "";
     
     let totalItemsCount = 0;
     
     if (cartData.length === 0) {
          container.innerHTML = `
               <div style="text-align:center; padding:2.5rem 1rem; color:var(--brown-color); opacity:0.7;">
                    <i class='bx bx-shopping-bag' style='font-size: 2.5rem; margin-bottom:10px; display:block;'></i>
                    <p style="font-size:0.95rem;">Your beautiful cart is empty!</p>
               </div>`;
          if(badgeCount) badgeCount.textContent = 0;
          return;
     }

     cartData.forEach(item => {
          totalItemsCount += item.qty;
          
          const cartItemRow = document.createElement('div');
          cartItemRow.classList.add('checkbox');
          
          cartItemRow.innerHTML = `
               <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/60x60?text=Dress'"/>
               <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Qty: <b>${item.qty}</b> | $${item.price * item.qty}</p>
               </div>
               <div class="item-actions">
                    <a href="#" class="minus-qty-btn" data-id="${item.id}"><i class='bx bx-minus'></i></a>
                    <a href="#" class="add-qty-btn" data-id="${item.id}"><i class='bx bx-plus'></i></a>
                    <a href="#" class="remove-item-btn" data-id="${item.id}"><i class='bx bx-trash'></i></a>
               </div>
          `;
          
          container.appendChild(cartItemRow);
     });

     if(badgeCount) badgeCount.textContent = totalItemsCount;
     setupCartActions();
}

function setupCartActions() {
     document.querySelectorAll('.add-qty-btn').forEach(btn => {
          btn.onclick = (e) => {
               e.preventDefault();
               const itemId = btn.getAttribute('data-id');
               const targetItem = cartData.find(item => item.id === itemId);
               if(targetItem) {
                    targetItem.qty += 1;
                    renderCart(); 
               }
          };
     });

     document.querySelectorAll('.minus-qty-btn').forEach(btn => {
          btn.onclick = (e) => {
               e.preventDefault();
               const itemId = btn.getAttribute('data-id');
               const targetItem = cartData.find(item => item.id === itemId);
               if(targetItem) {
                    targetItem.qty -= 1;
                    if(targetItem.qty <= 0) {
                         cartData = cartData.filter(item => item.id !== itemId);
                    }
                    renderCart(); 
               }
          };
     });

     document.querySelectorAll('.remove-item-btn').forEach(btn => {
          btn.onclick = (e) => {
               e.preventDefault();
               const itemId = btn.getAttribute('data-id');
               cartData = cartData.filter(item => item.id !== itemId);
               renderCart();
          };
     });
}

// ==========================================================================
// 4. DYNAMIC WISHLIST MANAGEMENT SYSTEM
// ==========================================================================
function renderWishlist() {
     const container = document.querySelector('.fav-items-container');
     const badgeCount = document.querySelector('#fav-count');
     
     if (!container) return;
     container.innerHTML = "";
     
     if (wishlistData.length === 0) {
          container.innerHTML = `
               <div style="text-align:center; padding:3.5rem 1rem; color:var(--brown-color); opacity:0.7;">
                    <i class='bx bx-heart-circle' style='font-size: 2.8rem; margin-bottom:10px; display:block;'></i>
                    <p style="font-size:0.95rem; font-weight:600; color:var(--dark-brown-color);">Your Wishlist is Empty</p>
                    <p style="font-size:0.85rem; margin-top:4px;">Blossom in your own style by adding items you love!</p>
               </div>`;
          if(badgeCount) badgeCount.textContent = 0;
          return;
     }

     wishlistData.forEach(item => {
          const favItemRow = document.createElement('div');
          favItemRow.classList.add('checkbox');
          
          favItemRow.innerHTML = `
               <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/60x60?text=Dress'"/>
               <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Price: <b>$${item.price}</b></p>
               </div>
               <div class="item-actions">
                    <a href="#" class="transfer-to-cart-btn" data-id="${item.id}" title="Move to Cart"><i class='bx bx-cart-download'></i></a>
                    <a href="#" class="remove-fav-btn" data-id="${item.id}" title="Remove"><i class='bx bx-trash'></i></a>
               </div>
          `;
          container.appendChild(favItemRow);
     });

     if(badgeCount) badgeCount.textContent = wishlistData.length;
     setupWishlistActions();
}

function setupWishlistActions() {
     document.querySelectorAll('.remove-fav-btn').forEach(btn => {
          btn.onclick = (e) => {
               e.preventDefault();
               const itemId = btn.getAttribute('data-id');
               
               wishlistData = wishlistData.filter(item => item.id !== itemId);
               
               const targetRow = document.querySelector(`.outfits .row[data-id="${itemId}"]`);
               if(targetRow) {
                    const heartIcon = targetRow.querySelector('.wishlist-toggle-btn');
                    heartIcon.classList.remove('liked');
                    heartIcon.innerHTML = "<i class='bx bx-heart'></i>";
               }
               
               renderWishlist();
          };
     });

     document.querySelectorAll('.transfer-to-cart-btn').forEach(btn => {
          btn.onclick = (e) => {
               e.preventDefault();
               const itemId = btn.getAttribute('data-id');
               const selectedItem = wishlistData.find(item => item.id === itemId);
               
               if(selectedItem) {
                    const cartItem = cartData.find(item => item.id === itemId);
                    if(cartItem) {
                         cartItem.qty += 1;
                    } else {
                         cartData.push({ ...selectedItem, qty: 1 });
                    }
                    
                    wishlistData = wishlistData.filter(item => item.id !== itemId);
                    
                    const targetRow = document.querySelector(`.outfits .row[data-id="${itemId}"]`);
                    if(targetRow) {
                         const heartIcon = targetRow.querySelector('.wishlist-toggle-btn');
                         heartIcon.classList.remove('liked');
                         heartIcon.innerHTML = "<i class='bx bx-heart'></i>";
                    }
                    
                    renderCart();
                    renderWishlist();
                    
                    closeAllPanels();
                    cartPanel.classList.add('active');
                    cartBtn.closest('a').classList.add('active-icon');
               }
          };
     });
}

// ==========================================================================
// 5. GRID ROW ACTION ASSIGNERS (ADD TO CART & TOGGLE WISHLIST)
// ==========================================================================
function setupProductGridListeners() {
     document.querySelectorAll('.outfits .row').forEach(row => {
          const cartAddBtn = row.querySelector('.cart-action-icon');
          const wishlistToggleBtn = row.querySelector('.wishlist-toggle-btn');
          
          const id = row.getAttribute('data-id');
          const name = row.querySelector('.price h4').textContent;
          const priceText = row.querySelector('.price p').textContent;
          const price = parseInt(priceText.replace(/[^0-9]/g, ''));
          const image = row.querySelector('img').getAttribute('src');

          if(cartAddBtn) {
               cartAddBtn.onclick = (e) => {
                    e.preventDefault();
                    const existingItem = cartData.find(item => item.id === id);
                    if(existingItem) {
                         existingItem.qty += 1;
                    } else {
                         cartData.push({ id, name, price, qty: 1, image });
                    }
                    renderCart();
                    closeAllPanels();
                    cartPanel.classList.add('active');
                    cartBtn.closest('a').classList.add('active-icon');
               };
          }

          if(wishlistToggleBtn) {
               wishlistToggleBtn.onclick = (e) => {
                    e.preventDefault();
                    const isLiked = wishlistToggleBtn.classList.contains('liked');
                    
                    if(isLiked) {
                         wishlistToggleBtn.classList.remove('liked');
                         wishlistToggleBtn.innerHTML = "<i class='bx bx-heart'></i>";
                         wishlistData = wishlistData.filter(item => item.id !== id);
                    } else {
                         wishlistToggleBtn.classList.add('liked');
                         wishlistToggleBtn.innerHTML = "<i class='bx bx-heart' style='color:var(--red-color); font-weight:bold;'></i>";
                         wishlistData.push({ id, name, price, image });
                    }
                    
                    renderWishlist();
               };
          }
     });
}

document.addEventListener("DOMContentLoaded", () => {
     renderCart();
     renderWishlist();
     setupProductGridListeners();
});