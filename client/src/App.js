import './App.css';
import {Routes, Route} from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import ChatPage from './components/pages/ChatPage'
import { QueryClientProvider, QueryClient } from 'react-query'
import Layout from './components/pages/Layout/Layout'
import RequireAuth from './components/pages/RequireAuth/RequireAuth'
import { Toaster } from 'react-hot-toast'
const queryClient = new QueryClient();

function App() {
  return (
    <div className=" h-screen max-h-screen font-fontRoboto">
      <QueryClientProvider client={queryClient}>
       <Toaster position='bottom-left'/>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route path="/login" element={<HomePage/>} />

              {/* Protected Routes */}
              <Route element={<RequireAuth/>}>
                <Route path="/" element={<ChatPage/>} />
              </Route>

            </Route>
          </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
