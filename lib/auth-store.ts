class AuthStore {
  private authenticated = false
  private callbacks: Array<(auth: boolean) => void> = []

  setAuth(value: boolean) {
    this.authenticated = value
    this.callbacks.forEach((cb) => cb(value))

    try {
      if (value) {
        localStorage.setItem("adminAuth", "true")
      } else {
        localStorage.removeItem("adminAuth")
      }
    } catch (e) {
      console.warn("localStorage unavailable")
    }
  }

  getAuth(): boolean {
    return this.authenticated
  }

  subscribe(callback: (auth: boolean) => void) {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  init() {
    try {
      const stored = localStorage.getItem("adminAuth")
      this.authenticated = stored === "true"
    } catch (e) {
      this.authenticated = false
    }
    return this.authenticated
  }
}

export const authStore = new AuthStore()
