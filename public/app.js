const vm = new Vue({
  el: '#app',
  data: {
    products: [],
    product: false,
    cart: [],
    cartActive: false,
    messageAlert: 'Item added',
    alertActive: false,
  },
  filters: {
    numPrice(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
  },
  computed: {
    cartTotal() {
      let total = 0;

      if (this.cart.length) {
        this.cart.forEach((item) => {
          total += item.price;
        });
      }

      return total;
    },
  },
  methods: {
    async fetchProducts() {
      const link = './api/products.json';
      const response = await fetch(link);
      const responseJSON = await response.json();

      return (this.products = responseJSON);
    },
    async fetchProduct(id) {
      const link = `./api/products/${id}/data.json`;
      const response = await fetch(link);
      const responseJSON = await response.json();

      this.product = responseJSON;
    },
    openModal(id) {
      this.fetchProduct(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    clickOutsideModal({ target, currentTarget }) {
      if (target == currentTarget) this.product = false;
    },
    clickOutsideCart({ target, currentTarget }) {
      if (target == currentTarget) this.cartActive = false;
    },
    addItemToCart() {
      this.product.stock--;
      const { id, name, price } = this.product;
      this.cart.push({ id, name, price });
      this.alert(`${name} added to cart.`);
    },
    removeItemCart(index) {
      this.cart.splice(index, 1);
    },
    clearCart() {
      this.cart = [];
    },
    checkLocalStorage() {
      if (window.localStorage.cart) {
        this.cart = JSON.parse(window.localStorage.cart);
      }
    },
    compareStock() {
      const items = this.cart.filter(({ id }) => id === this.product.id);

      this.product.stock -= items.length;
    },
    alert(msg) {
      this.messageAlert = msg;
      this.alertActive = true;
      setTimeout(() => {
        this.alertActive = false;
      }, 1500);
    },
    router() {
      const hash = document.location.hash;
      if (hash) {
        this.fetchProduct(hash.replace('#', ''));
      }
    },
  },

  watch: {
    product() {
      document.title = this.product.name || 'Techno';
      const hash = this.product.id || '';
      history.pushState(null, null, `#${hash}`);

      if (this.product) this.compareStock();
    },
    cart() {
      window.localStorage.cart = JSON.stringify(this.cart);
    },
  },
  created() {
    this.fetchProducts();
    this.checkLocalStorage();
    this.router();
  },
});
