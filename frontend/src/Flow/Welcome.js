import React from 'react';
import { useState } from 'react';

import {
    AbsoluteCenter,
    Box, Heading, Text, Button, Flex, Select, VStack, Input, Grid
} from '@chakra-ui/react';




function Welcome(props) {

    const { togglePage } = props


    return (

        <Box width='35rem' height='' shadow='lg' rounded='lg' p='6' pb='8' textAlign='start'>
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
                <li>Courses that are offered next semester</li>
                <li>Personalized feed based on your interests</li>
            </ul>
            <Button colorScheme='blue' mt='8' onClick={togglePage}>Find my courses!</Button>
        </Box>


    );
}

export default Welcome;
