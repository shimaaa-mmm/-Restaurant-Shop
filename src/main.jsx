import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import fa_IR from 'antd/locale/fa_IR'
import store from './app/store'
import App from './App'
import './index.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        direction="rtl"
        locale={fa_IR}
        theme={{
          token: {
            colorPrimary: '#E3A008',
            fontFamily: 'Vazirmatn, sans-serif',
            borderRadius: 14,
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
)
