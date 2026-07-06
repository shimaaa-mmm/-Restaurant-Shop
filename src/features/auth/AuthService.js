const USERS_KEY = 'restaurant_users'

export const AuthService = {
  getStoredUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || []
    } catch (e) {
      return []
    }
  },

  storeUser(user) {
    const users = this.getStoredUsers()
    users.push(user)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return user
  },

  register({ username, password }) {
    const users = this.getStoredUsers()
    if (users.find(u => u.username === username)) {
      return { error: 'username_taken' }
    }
    const newUser = { id: Date.now(), username, password }
    this.storeUser(newUser)
    return { user: newUser }
  },

  login({ username, password }) {
    const users = this.getStoredUsers()
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) return { error: 'invalid_credentials' }
    const token = btoa(`${user.username}:${Date.now()}`)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    return { user, token }
  },

  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('auth_user')) || null
    } catch (e) {
      return null
    }
  }
}
