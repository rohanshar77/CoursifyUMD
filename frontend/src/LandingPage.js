import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import {
    AbsoluteCenter,
    Box, Heading, Text, Button, Flex, Select, VStack, Input, Grid, Fade, Center, Divider
} from '@chakra-ui/react';

import Welcome from './Flow/Welcome';
import Major from './Flow/Major';
import Interests from './Flow/Interests';
import CourseView from './CourseView';


function LandingPage() {
    const [currentPage, setCurrentPage] = useState(0); // 0 for Welcome, 1 for Major, 2 for Interests
    const [submitted, setSubmitted] = useState(false);
    const [major, setMajor] = useState("")
    const [year, setYear] = useState()
    const [career, setCareer] = useState("")
    const [selectedInterests, setSelectedInterests] = useState([])



    // const courses = useState([])

    const courses = [{
        "average_gpa": 2.76,
        "combined": "CMSC330-Organization of Programming Languages-Prerequisite:Minimum grade of C- in CMSC250 and CMSC216. Restriction:Must be in a major within the CMNS-Computer Science department; or must be in the Computer Science Minor program; or must be in Engineering: Computer program; and Permission of CMSC - Computer Science department.\nA study of programming languages, including their syntax, semantics, and implementation. Several different models of languages are discussed, including dynamic, scripting (e. g. , Ruby, Python) functional (e. g. , OCaml, Haskell, Scheme), and memory safe systems programming (e. g. , Rust). Explores language features such as formal syntax, scoping and binding of variables, higher-order programming, typing, and type polymorphism. Introduces finite automata, context free grammar, parsing, lambda calculus, and basics of security attacks and software security.-300 level",
        "credits": 3,
        "description": "Prerequisite: Minimum grade of C- in CMSC250 and CMSC216. Restriction: Must be in a major within the CMNS-Computer Science department; or must be in the Computer Science Minor program; or must be in Engineering: Computer program; and Permission of CMSC - Computer Science department.\n\nA study of programming languages, including their syntax, semantics, and implementation. Several different models of languages are discussed, including dynamic, scripting (e. g. , Ruby, Python) functional (e. g. , OCaml, Haskell, Scheme), and memory safe systems programming (e. g. , Rust). Explores language features such as formal syntax, scoping and binding of variables, higher-order programming, typing, and type polymorphism. Introduces finite automata, context free grammar, parsing, lambda calculus, and basics of security attacks and software security.",
        "id": "CMSC330",
        "professors": [
            "Christopher Kauffman: 5.0",
            "Paul Kline: 3.26",
            "Cliff Bakalian: 3.16"
        ],
        "score": 0.811830938,
        "title": "Organization of Programming Languages",
        "tokens": 191,
        "top_prof": "Christopher Kauffman",
        "top_rating": 5
    }, {
        "average_gpa": -1,
        "combined": "INST208N-Special Topics in Information Studies; Creative Coding-Restricted to students who have not taken INST126. This course is a gentle introduction to the Python programming language for writers and artists. The focus is on experimental writing with computers, including digital fiction and poetry. We ll also explore novel forms of collaboration with the computer, such as using an AI-generated passage of text as the seed for a more conventionally authored short story;writing a poem that contains lines and stanzas scored either ridiculous ly high or low by sentiment algorithms; and using paper rather than screens as a medium for computational display.-200 level",
        "credits": 3,
        "description": "Restricted to students who have not taken INST126. This course is a gentle introduction to the Python programming language for writers and artists. The focus is on experimental writing with computers, including digital fiction and poetry. We ll also explore novel forms of collaboration with the computer, such as using an AI-generated passage of text as the seed for a more conventionally authored short story;writing a poem that contains lines and stanzas scored either ridiculous ly high or low by sentiment algorithms; and using paper rather than screens as a medium for computational display.",
        "id": "INST208N",
        "professors": [
            "Kari Kraus: 5.0"
        ],
        "score": 0.811483085,
        "title": "Special Topics in Information Studies; Creative Coding",
        "tokens": 124,
        "top_prof": "Kari Kraus",
        "top_rating": 5
    }, {
        "average_gpa": 2.55,
        "combined": "CMSC132-Object-Oriented Programming II-Prerequisite:Minimum grade of C- in CMSC131; or must have earned a score of 5 on the A Java AP exam; or must have earned a satisfactory score on the departmental placement exam. And minimum grade of C- in MATH140.\nIntroduction to use of computers to solve problems using software engineering principles. Design, build, test, and debug medium -size software systems and learn to use relevant tools. Use object-oriented methods to create effective and efficient problem solutions. Use and implement application programming interfaces (APIs). Programming done in Java.-100 level",
        "credits": 4,
        "description": "Prerequisite: Minimum grade of C- in CMSC131; or must have earned a score of 5 on the A Java AP exam; or must have earned a satisfactory score on the departmental placement exam. And minimum grade of C- in MATH140.\n\nIntroduction to use of computers to solve problems using software engineering principles. Design, build, test, and debug medium -size software systems and learn to use relevant tools. Use object-oriented methods to create effective and efficient problem solutions. Use and implement application programming interfaces (APIs). Programming done in Java.",
        "id": "CMSC132",
        "professors": [
            "Ilchul Yoon: 2.47",
            "Larry Herman: 3.22",
            "Elias Gonzalez: 4.56"
        ],
        "score": 0.807457268,
        "title": "Object-Oriented Programming II",
        "tokens": 127,
        "top_prof": "Elias Gonzalez",
        "top_rating": 4.56
    }, {
        "average_gpa": 3.15,
        "combined": "INST126-Introduction to Programming for Information Science-Prerequisite:Math placement of STAT100 or higher. Restriction:Must not have completed INST326; and must be in Information Science, Technology and Information Design, or Social Data Science programs.\nAn introduction to computer programming for students with very limited or no previous programming experience. Topics include fundamental programming concepts such as variables, data types, assignments, arrays, conditionals, loops, functions, and I/O operations.-100 level-easier, higher average gpa",
        "credits": 3,
        "description": "Prerequisite: Math placement of STAT100 or higher. Restriction: Must not have completed INST326; and must be in Information Science, Technology and Information Design, or Social Data Science programs.\n\nAn introduction to computer programming for students with very limited or no previous programming experience. Topics include fundamental programming concepts such as variables, data types, assignments, arrays, conditionals, loops, functions, and I/O operations.",
        "id": "INST126",
        "professors": [
            "Scott Jackson: -1",
            "Giovanni Luca Ciampaglia: 1.83",
            "Instructor: TBA: -1",
            "Zach Drake: -1"
        ],
        "score": 0.805548191,
        "title": "Introduction to Programming for Information Science",
        "tokens": 102,
        "top_prof": "Giovanni Luca Ciampaglia",
        "top_rating": 1.83
    }, {
        "average_gpa": 3.8,
        "combined": "ENEB453-Web-Based Application Development-Prerequisite:ENEB340 and ENEB341. Restriction:Must be in the Cyber-Physical Systems Engineering program; and permission of the Cyber-Physical Systems Engineering program.\nIntroduction to cloud computing, computer programming in the context of developing full-featured dynamic websites. Uses a problem-solving approach to teach basics of program design and implementation using JavaScript; relates these skills to the creation of dynamic websites; then explores both the potential and limits of web-based information sources for use in research. This course provides a practical introduction to full-stack web development using PHP and JavaScript. The course will start with HTML/CSS/JavaScript to cover the client-side of applications. Then, it will move on to the server-side with PHP and integrating with a MySQL database to create a complete web application.-400 level-easier, higher average gpa",
        "credits": 3,
        "description": "Prerequisite: ENEB340 and ENEB341. Restriction: Must be in the Cyber-Physical Systems Engineering program; and permission of the Cyber-Physical Systems Engineering program.\n\nIntroduction to cloud computing, computer programming in the context of developing full-featured dynamic websites. Uses a problem-solving approach to teach basics of program design and implementation using JavaScript; relates these skills to the creation of dynamic websites; then explores both the potential and limits of web-based information sources for use in research. This course provides a practical introduction to full-stack web development using PHP and JavaScript. The course will start with HTML/CSS/JavaScript to cover the client-side of applications. Then, it will move on to the server-side with PHP and integrating with a MySQL database to create a complete web application.",
        "id": "ENEB453",
        "professors": [
            "Nestor Michael Tiglao: -1"
        ],
        "score": 0.7981475,
        "title": "Web-Based Application Development",
        "tokens": 175,
        "top_prof": "Nestor Michael Tiglao",
        "top_rating": -1
    }]

    const [top, setTop] = useState([])
    const [coursesInterested, setCoursesInterested] = useState([])
    const [coursesMajor, setCoursesMajor] = useState([])
    const [coursesCareer, setCoursesCareer] = useState([])

    // Function to cycle through the pages
    const togglePage = () => {
        setCurrentPage((prevPage) => (prevPage === 2 ? 0 : prevPage + 1));
    };

    const submit = async () => {
        const resp = await axios.get('http://localhost:5000/search', {
            freshman: (year == 0),
            major: major,
            industry: career,
            interests: selectedInterests
        });

        setTop([...resp.data.interest_courses.slice(0, 2), ...resp.data.major_courses.slice(0, 2), ...resp.data.career_courses.slice(0, 2)])
        setCoursesInterested(resp.data.interest_courses.slice(0, 6))
        setCoursesMajor(resp.data.major_courses.slice(0, 6))
        setCoursesCareer(resp.data.career_courses.slice(0, 6))

        setSubmitted(true)
    };


    return (
        <Box height="100vh" width="100vw" display="flex" flexDirection="column" alignItems="flex-start" justifyContent="flex-start" padding="2">
            <Text fontSize="4xl" color="orange.400" fontWeight="bold" ms='4'>
                Coursify
            </Text>

            {!submitted ? (
                <AbsoluteCenter width="">
                    <Fade in={currentPage === 0}>{currentPage === 0 && <Welcome togglePage={togglePage} />}</Fade>
                    <Fade in={currentPage === 1}>{currentPage === 1 && <Major togglePage={togglePage} major={major} setMajor={setMajor}
                        career={career} setCareer={setCareer} year={year} setYear={setYear}
                    />}</Fade>
                    <Fade in={currentPage === 2}>{currentPage === 2 && <Interests submit={submit} selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests} />}</Fade>
                </AbsoluteCenter>
            ) : (



                <Center flexDirection="column" width="100%" >
                    <Box h='2rem'></Box>
                    <Fade in={submitted}>
                        <Box width="75rem" minH="20rem" display="flex" flexDirection="column" alignItems="start" p="4">

                            <Text fontSize='4xl' fontWeight='bold' alignSelf='start' textAlign='start' pt='4' mb='2'>
                                <span style={{ marginRight: '15px' }}>Your Recs</span><span style={{ fontSize: '0.9em' }}>📖</span>
                            </Text>
                            <Text fontSize='xl' fontWeight='' alignSelf="flex-start" mb='4'>We used your profile to find classes you may be interested in.</Text>
                            <Divider mb='10' />
                            <Text fontSize='3xl' fontWeight='semibold' alignSelf="flex-start" color='red.500'>Top Courses</Text>
                            <CourseView courses={top}></CourseView>
                            <Text fontSize='3xl' mt='8' fontWeight='semibold' alignSelf="flex-start" color='green.400'>Based on your interests</Text>
                            <CourseView courses={coursesInterested}></CourseView>
                            <Text fontSize='3xl' mt='8' fontWeight='semibold' alignSelf="flex-start" color='purple.400'>Based on your major</Text>
                            <CourseView courses={coursesMajor}></CourseView>
                            <Text fontSize='3xl' mt='8' fontWeight='semibold' alignSelf="flex-start" color='orange.400'>Based on your career</Text>
                            <CourseView courses={coursesCareer}></CourseView>

                        </Box>
                    </Fade>
                </Center>
            )}
        </Box>

    );
}

export default LandingPage;
