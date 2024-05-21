import React from 'react'
import ReactDOM from 'react-dom/client'

import '@xyflow/react/dist/base.css'
import '@xyflow/react/dist/style.css'
import './index.css'
import '@leenguyen/react-flip-clock-countdown/dist/index.css'

import { ReactFlowProvider } from '@xyflow/react'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </React.StrictMode>
)
