import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import LandingPage from './LandingPage';


function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <LandingPage></LandingPage>
      </ChakraProvider>
    </div>
  );
}

export default App;
