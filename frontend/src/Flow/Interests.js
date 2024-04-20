import React from 'react';
import { useState } from 'react';

import {
    AbsoluteCenter,
    Box, Heading, Text, Button, Flex, Select, VStack, Input, Grid
} from '@chakra-ui/react';




function Interests(props) {
    const { togglePage } = props


    const [selectedInterests, setSelectedInterests] = useState([]);

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(item => item !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const interests = ['Technology', 'Sports', 'Art', 'Music', 'Cooking', 'Travel'];


    return (

        <Box width='35rem' height='35rem' shadow='lg' rounded='lg' p='6' textAlign='start'>
            <Heading size='lg' alignSelf='start' textAlign='start' pt='4'>
                <span style={{ marginRight: '10px' }}>My interests</span>
            </Heading>
            <Text fontSize='lg' alignSelf='start' fontWeight='semibold' textAlign='start' pt='2' mb='8'>What are you interested about, outside of your major?</Text>
            <VStack spacing='4' textAlign='start' alignItems='start'>
                <Text fontSize='md' >
                    Select your interests:
                </Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    {interests.map((interest, index) => (
                        <Button
                            key={index}
                            variant={selectedInterests.includes(interest) ? 'solid' : 'outline'}
                            colorScheme="telegram"
                            onClick={() => toggleInterest(interest)}
                        >
                            {interest}
                        </Button>
                    ))}
                </Grid>

            </VStack>


            <Button colorScheme='blue' mt='8' onClick={togglePage}>Save and continue</Button>
        </Box>


    );
}

export default Interests;
