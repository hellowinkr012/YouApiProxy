class MemoryStores {
  store = new Object();
  constructor() {
    this.set.bind(this);
    this.get.bind(this);
  }
  set(key, val) {
    this.store[key] = val;
  }
  get(key) {
    if (this.store.hasOwnProperty(key) == true) {
        return this.store[key];
    }
    return null;
  }
}

export default MemoryStores;
