import { extendTheme } from '@chakra-ui/react';

const config = {
    useSystemColorMode: true,
    initialColorMode: 'light', // optional default mode
};

const theme = extendTheme({ config });
export default theme;