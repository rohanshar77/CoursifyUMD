import React from 'react';
import { useState } from 'react';

import {
    AbsoluteCenter,
    Box, Heading, Text, Button, Flex, Select, VStack, Input, Grid
} from '@chakra-ui/react';




function Major(props) {
    const { togglePage } = props

    return (

        <Box width='35rem' height='35rem' shadow='lg' rounded='lg' p='7' textAlign='start'>
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


            <Button colorScheme='blue' mt='8' onClick={togglePage}>Save and continue</Button>
        </Box>


    );
}

export default Major;
