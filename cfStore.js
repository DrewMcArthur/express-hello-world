// this module interfaces with our cloudflare worker backend

class Store {
  constructor() {
    this.storeUrl = "https://val2024-worker.drewmca.workers.dev/";
  }

  async getAll() {
    try {
      const response = await fetch(this.storeUrl);
      return await response.json();
    } catch (error) {
      return error;
    }
  }

  async newFlower(data) {
    console.log("sending new flower to store: ", data);
    let url = this.storeUrl + "create";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const flower = await response.json();
      return {
        color: flower.color,
        kind: flower.kind,
        location: flower.location,
      };
    } catch (error) {
      return console.log(error);
    }
  }

  async clear() {
    console.log("clearing store");
    let url = this.storeUrl + "clear";
    try {
      await fetch(url, {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Store;
