import React from 'react';
import { useState } from 'react';

import {
    AbsoluteCenter,
    Box, Heading, Text, Button, Flex, Select, VStack, Input, Grid, Badge, Center
} from '@chakra-ui/react';




function CourseView({ courses }) {
    const truncate = (str, num) => {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        }
        return str;
    };


    return (

        <Box mt='4'>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {courses.map(course => (
                    <Box key={course.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" width='100%'>
                        <VStack align="stretch">
                            <Text fontSize="lg" fontWeight="bold">{course.id}: {course.title}</Text>
                            <Center mb='3'>
                                <Flex>
                                    <Badge me='4' colorScheme="gray" p="1" alignSelf="flex-start">
                                        {`Avg GPA: ${(course.average_gpa === -1 || course.average_gpa === 0) ? 'Unavailable' : course.average_gpa}`}
                                    </Badge>                                    <Badge colorScheme="gray" p="1" alignSelf="flex-start">{`Credits: ${course.credits}`}</Badge>
                                </Flex>
                            </Center>

                            <Text fontSize="sm" >{truncate(course.description, 400)}</Text>
                            <Text fontWeight="semibold" fontSize="sm">
                                {`Top Professor: ${course.top_prof} `}
                                {(course.top_rating === -1) ? '(No ratings)' : `(Rating: ${course.top_rating})`}
                            </Text>                        </VStack>
                    </Box>
                ))}
            </Grid>
        </Box>


    );
}

export default CourseView;
