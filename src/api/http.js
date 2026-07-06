import axios from 'axios'

const http = axios.create({
  timeout: 10000,
})

// تلاش مجدد خودکار در صورت خطای شبکه یا timeout (تا API همیشه در دسترس بماند)
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config
    if (!config || config.__retryCount >= 2) {
      return Promise.reject(error)
    }
    config.__retryCount = (config.__retryCount || 0) + 1
    await new Promise((r) => setTimeout(r, 500 * config.__retryCount))
    return http(config)
  }
)

export default http
