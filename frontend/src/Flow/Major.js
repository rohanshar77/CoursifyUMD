import React from 'react';
import { useState } from 'react';

import {
    AbsoluteCenter,
    Box, Heading, Text, Button, Flex, Select, VStack, Input, Grid, Alert, AlertIcon
} from '@chakra-ui/react';




function Major(props) {
    const { togglePage, major, setMajor, career, setCareer, year, setYear } = props
    const [showWarn, setShowWarn] = useState(false)
    const handleChange = (event) => {
        const index = event.target.selectedIndex - 1;
        setYear(index);
    };

    const nextPage = () => {
        console.log(major)
        console.log(career)
        console.log(year)

        if (major && career && year != null) {
            togglePage()
        } else {
            setShowWarn(true)
        }

    };

    return (

        <Box width='35rem' minH='35rem' shadow='lg' rounded='lg' p='7' textAlign='start'>
            {showWarn ? (<Alert status="warning" mt={4}>
                <AlertIcon />
                Please complete all fields.
            </Alert>) : (<></>)

            }

            <Heading size='lg' alignSelf='start' textAlign='start' pt='4'>
                <span style={{ marginRight: '10px' }}>Major & Career Goals</span>
            </Heading>
            <Text fontSize='lg' alignSelf='start' fontWeight='semibold' textAlign='start' pt='2' mb='5'>Tell us a little about your background</Text>
            <VStack spacing='4' textAlign='start' alignItems='start' width='95%'>
                <Text fontSize='md' >
                    My major is ...
                </Text>
                <Input placeholder='Computer science' value={major} onChange={(e) => setMajor(e.target.value)} />


                <Text fontSize='md'>
                    I am a ...
                </Text>
                <Select
                    placeholder='Select year'
                    onChange={handleChange}
                >
                    <option value='option1'>Freshman</option>
                    <option value='option2'>Sophomore</option>
                    <option value='option3'>Junior</option>
                    <option value='option4'>Senior</option>
                </Select>

                <Text fontSize='md' >
                    My goal after graduation is to become a...
                </Text>

                <Input placeholder='Software engineer' value={career} onChange={(e) => setCareer(e.target.value)} />
            </VStack>


            <Button colorScheme='blue' mt='8' onClick={nextPage}>Save and continue</Button>
        </Box>


    );
}

export default Major;
