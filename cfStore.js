// this module interfaces with our cloudflare worker backend
// don't really need the permanence of the cloudflare worker so turning that off for now

class Store {
  constructor() {
    this.storeUrl = "https://val2024-worker.drewmca.workers.dev/";
  }

  async getAll() {
    return [];
    try {
      const response = await fetch(this.storeUrl);
      return await response.json();
    } catch (error) {
      return error;
    }
  }

  async newFlower(data) {
    return {
      color: Math.floor(Math.random() * 100),
      kind: Math.floor(Math.random() * 100),
      location: data
    }
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
    return;
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
