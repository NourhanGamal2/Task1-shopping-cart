// تحديد الصفحات
const loginPage = document.getElementById('loginPage');
const homePage = document.getElementById('homePage');
const logoutPage = document.getElementById('logoutPage');
const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');
const backToLogin = document.getElementById('backToLogin');

// التحقق من وجود إيميل محفوظ والدخول تلقائيًا
document.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('email');
  if (savedEmail) {
    // إذا كان هناك إيميل محفوظ، الانتقال للصفحة الرئيسية مباشرة
    loginPage.classList.add('hidden');
    homePage.classList.remove('hidden');
  }
});

// تسجيل الدخول
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // التحقق من البيانات المدخلة
  if (!email || !password) {
    alert('Please fill out all fields!');
    return;
  }

  // التحقق من طول كلمة المرور
  if (password.length < 5) {
    alert('Password must be at least 5 characters long.');
    return;
  }

  const savedEmail = localStorage.getItem('email');

  if (savedEmail && savedEmail === email) {
    // إذا كان الإيميل المدخل مطابقًا للإيميل المحفوظ، الدخول تلقائيًا
    loginPage.classList.add('hidden');
    homePage.classList.remove('hidden');
  } else {
    // حفظ الإيميل الجديد والانتقال للصفحة الرئيسية
    localStorage.setItem('email', email);
    loginPage.classList.add('hidden');
    homePage.classList.remove('hidden');
  }
});

// تسجيل الخروج
logoutButton.addEventListener('click', () => {
  // حذف الإيميل المحفوظ
  localStorage.removeItem('email');

  // إظهار صفحة تسجيل الخروج
  homePage.classList.add('hidden');
  logoutPage.classList.remove('hidden');
});

// العودة إلى صفحة تسجيل الدخول
backToLogin.addEventListener('click', () => {
  logoutPage.classList.add('hidden');
  loginPage.classList.remove('hidden');
});

// عربة التسوق
const iconCart = document.querySelector('.icon-cart');
const body = document.querySelector('body');
const closeCart = document.querySelector('.close');
const listProductHtml = document.querySelector('.listProduct');
const listCartHtml = document.querySelector('.listCart');
const iconCartSpan = document.querySelector('.icon-cart span');

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
  body.classList.remove('showCart');
});

const addDataToHtml = () => {
  listProductHtml.innerHTML = '';
  if(listProducts.length > 0) {
  listProducts.forEach(product => {
    let newProduct = document.createElement('div');
    newProduct.classList.add('item');
    newProduct.dataset.id = product.id
    newProduct.innerHTML = `
      <img src=${product.image} alt="">
      <h2>${product.name}</h2>
      <div class="price">$${product.price}</div>
      <button class="addCart">
        Add To Cart
      </button>
    `;
    listProductHtml.appendChild(newProduct)
  })
  }
};

listProductHtml.addEventListener('click' , (even) => {
  let positionClick = even.target;
  if(positionClick.classList.contains('addCart')){
    let product_id = positionClick.parentElement.dataset.id;
    addToCart(product_id)
  }
})

const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id)
  if(carts.length <= 0) {
    carts = [{
      product_id : product_id,
      quantity : 1
    }]
  }else if (positionThisProductInCart < 0) {
    carts.push( {
      product_id: product_id,
      quantity : 1
    });
  }else {
   carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
  }
  addCartToHtml();
  addCartToMemory();
}
// =====================

// =====================
const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(carts))
}
// =====================
// addCartToHtml لإضافة إجمالي السعر
const addCartToHtml = () => {
  listCartHtml.innerHTML = '';
  let totalQuantity = 0;
  let totalPrice = 0;

  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement('div');
      newCart.classList.add('item');
      newCart.dataset.id = cart.product_id;
      let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
      let info = listProducts[positionProduct];
      
      // حساب السعر
      totalPrice += info.price * cart.quantity;

      newCart.innerHTML = `
        <div class="image">
          <img src=${info.image} alt="">
        </div>
        <div class="name">${info.name}</div>
        <div class="totalPrice">$${info.price * cart.quantity}</div>
        <div class="quantity">
          <span class="minus">-</span>
          <span>${cart.quantity}</span>
          <span class="plus">+</span>
        </div>
      `;
      listCartHtml.appendChild(newCart);
    });
  }

  //   الإجمالي  
  iconCartSpan.innerText = totalQuantity;

  //  الإجمالي النهائي
  const totalDiv = document.createElement('div');
    totalDiv.classList.add('cart-total');
    totalDiv.innerHTML = `
      <h3>Total: $${totalPrice.toFixed(2)}</h3>
    `;
  listCartHtml.appendChild(totalDiv);
};
// ===================================

// ===================================
listCartHtml.addEventListener('click', (even) => {
  let positionClick = even.target;
  if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if(positionClick.classList.contains('plus')){
      type = 'plus';
    }
    changeQuantity(product_id, type)
  }
})
// ========

// ========
const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
  if(positionItemInCart >= 0 ){
    switch (type) {
      case 'plus':
        carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
      break;

        default:
          let valueChange =  carts[positionItemInCart].quantity - 1;
          if(valueChange > 0) {
            carts[positionItemInCart].quantity = valueChange;
          }else {
            carts.splice(positionItemInCart, 1)
          }
        break;
    }
  }
  addCartToMemory();
  addCartToHtml();
}
// =======================

const initApp =() => {
  fetch('product.json')
  .then(response => response.json())
  .then(data => {
  listProducts = data;
  addDataToHtml();

  // get cart from memory
  if(localStorage.getItem('cart')){
    carts = JSON.parse(localStorage.getItem('cart'));
     addCartToHtml();
    }
  })
}

initApp();