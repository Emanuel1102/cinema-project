import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { appRouter } from './appRouter'

function App() {
  
  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
