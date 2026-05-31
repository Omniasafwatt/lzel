import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        expand
        closeButton
        toastOptions={{
          duration: 4000,
          classNames: {
            toast: 'font-sans',
          },
        }}
      />
    </ThemeProvider>
  )
}
