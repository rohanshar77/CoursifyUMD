import React from 'react';
import { useState } from 'react';

import {
    AbsoluteCenter,
    Box, Heading, Text, Button, Flex, Select, VStack, Input, Grid, Alert, AlertIcon
} from '@chakra-ui/react';




function Interests(props) {
    const { submit, selectedInterests, setSelectedInterests } = props
    const [showWarn, setShowWarn] = useState(false)

    const handleSubmit = () => {
        if (selectedInterests.length) {
            submit()
        } else {
            setShowWarn(true)
        }
    }


    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(item => item !== interest));
        } else {
            if (selectedInterests.length < 3) {
                setSelectedInterests([...selectedInterests, interest]);
            }
        }

        console.log(selectedInterests)
    };

    const interests = ['Technology', 'Sports', 'Art', 'Music', 'Cooking', 'Travel', 'Fashion', 
    'Reading', 'Volunteering', 'Writing', 'Entrepreneurship', 'Environment/Sustainability'];


    return (

        <Box width='35rem' height='35rem' shadow='lg' rounded='lg' p='6' textAlign='start'>
            {showWarn ? (<Alert status="warning" mt={4}>
                <AlertIcon />
                Please select at least one interest.
            </Alert>) : (<></>)

            }

            <Heading size='lg' alignSelf='start' textAlign='start' pt='4'>
                <span style={{ marginRight: '10px' }}>My interests</span>
            </Heading>
            <Text fontSize='lg' alignSelf='start' fontWeight='semibold' textAlign='start' pt='2' mb='8'>What do you want to learn about, outside of your major?</Text>
            <VStack spacing='4' textAlign='start' alignItems='start'>
                <Text fontSize='md' >
                    Select your interests (up to 3):
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


            <Button colorScheme='blue' mt='8' onClick={handleSubmit}>Save and continue</Button>
        </Box>


    );
}

export default Interests;
