class KarbynBackendService {
  static actor = null;

  static setActor(actor) {
    this.actor = actor;
  }

  static getActor() {
    if (!this.actor) {
      throw new Error("Actor is not set. Please initialize the backend actor.");
    }
    return this.actor;
  }

  static async fetchUserProfile() {
    const actor = this.getActor();
    return await actor.get_current_user();
  }
}

export default KarbynBackendService;
export { KarbynBackendService };
