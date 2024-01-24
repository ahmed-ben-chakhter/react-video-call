import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, MeetingProvider, lightTheme } from 'amazon-chime-sdk-component-library-react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
        <MeetingProvider>
          <App />
        </MeetingProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
