import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Newtab'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'

const client = new QueryClient()
ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    // <React.StrictMode>
    <QueryClientProvider client={client}>
        <App />,
    </QueryClientProvider>,
    // </React.StrictMode>
)
