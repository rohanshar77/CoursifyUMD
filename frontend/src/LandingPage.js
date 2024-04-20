import React from 'react';
import { useState } from 'react';

import {
    AbsoluteCenter,
    Box, Heading, Text, Button, Flex, Select, VStack, Input, Grid
} from '@chakra-ui/react';




function LandingPage() {


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
        <Box height="100vh" display="flex">
            <Text fontSize="4xl" ms='4' mt='2' color="orange.400" fontWeight='semibold'>Coursify</Text>
            <AbsoluteCenter>
                {/* <Box width='35rem' height='35rem' shadow='lg' rounded='lg' p='6' textAlign='start'>
                    <Heading size='lg' alignSelf='start' textAlign='start' pt='4'>
                        <span style={{ marginRight: '10px' }}>Welcome</span><span style={{ fontSize: '0.9em' }}>👋</span>
                    </Heading>
                    <Text fontSize='lg' alignSelf='start' fontWeight='semibold' textAlign='start' pt='2' mb='5'>Personalized course discovery with Coursify</Text>
                    <Text fontSize='md' mb='4'>
                        Provide your major, academic year, career aspirations, and interests, and we'll search through thousands of courses to identify the best matches for you.
                    </Text>
                    <ul style={{ marginLeft: '20px' }}>
                        <li>Customized course recommendations</li>
                        <li>Insights based on your career aspirations</li>
                        <li>Updates on new and trending courses</li>
                        <li>Interactive tools to track your learning progress</li>
                    </ul>
                    <Button colorScheme='blue' mt='8'>Find my courses!</Button>
                </Box> */}

                {/* <Box width='35rem' height='35rem' shadow='lg' rounded='lg' p='7' textAlign='start'>
                    <Heading size='lg' alignSelf='start' textAlign='start' pt='4'>
                        <span style={{ marginRight: '10px' }}>Major & Career Goals</span>
                    </Heading>
                    <Text fontSize='lg' alignSelf='start' fontWeight='semibold' textAlign='start' pt='2' mb='5'>Tell us a little about your background</Text>
                    <VStack spacing='4' textAlign='start' alignItems='start' width='95%'>
                        <Text fontSize='md' >
                            My major is ...
                        </Text>
                        <Input placeholder='Computer science' />


                        <Text fontSize='md'>
                            I am a ...
                        </Text>
                        <Select placeholder='Select year'>
                            <option value='option1'>Freshman</option>
                            <option value='option2'>Sophomore</option>
                            <option value='option3'>Junior</option>
                            <option value='option3'>Senior</option>

                        </Select>

                        <Text fontSize='md' >
                            My goal after graduation is to be a...
                        </Text>

                        <Input placeholder='Software engineer' />
                    </VStack>


                    <Button colorScheme='blue' mt='8'>Save and continue</Button>
                </Box> */}



                <Box width='35rem' height='35rem' shadow='lg' rounded='lg' p='6' textAlign='start'>
                    <Heading size='lg' alignSelf='start' textAlign='start' pt='4'>
                        <span style={{ marginRight: '10px' }}>My interests</span>
                    </Heading>
                    <Text fontSize='lg' alignSelf='start' fontWeight='semibold' textAlign='start' pt='2' mb='5'>What are you interested about, outside of your major?</Text>
                    <VStack spacing='4' textAlign='start' alignItems='start'>
                        <Text fontSize='md' >
                            Select your interests:
                        </Text>
                        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                            {interests.map((interest, index) => (
                                <Button
                                    key={index}
                                    variant={selectedInterests.includes(interest) ? 'solid' : 'outline'}
                                    colorScheme="blue"
                                    onClick={() => toggleInterest(interest)}
                                >
                                    {interest}
                                </Button>
                            ))}
                        </Grid>

                    </VStack>


                    <Button colorScheme='blue' mt='8'>Save and continue</Button>
                </Box>




            </AbsoluteCenter >

        </Box >
    );
}

export default LandingPage;
