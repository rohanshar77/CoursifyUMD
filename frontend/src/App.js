import logo from './logo.svg';
import './App.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import LandingPage from './LandingPage';

import theme from './theme';


function App() {
  return (
    <div className="App">
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <LandingPage></LandingPage>
      </ChakraProvider>
    </div>
  );
}

export default App;
