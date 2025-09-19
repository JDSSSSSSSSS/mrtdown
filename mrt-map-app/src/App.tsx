import LandingPage from './components/LandingPage'
import { LanguageProvider } from './context/LanguageContext'
import { TransitSystemProvider } from './context/TransitSystemContext'

function App() {
  return (
    <TransitSystemProvider defaultSystem="singapore">
      <LanguageProvider>
        <LandingPage />
      </LanguageProvider>
    </TransitSystemProvider>
  )
}

export default App
