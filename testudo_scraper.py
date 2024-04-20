import collections
import csv
import os
import re

import requests
from bs4 import BeautifulSoup

# Change this to find courses for a specific semester
term_ID = "202401"

def find_all_departments():
    url = f"https://app.testudo.umd.edu/soc/{term_ID}"
    all_departments = []

    # Make a GET request to the URL and get all departments
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    html_elements = soup.find_all('span', class_='prefix-abbrev')

    for element in html_elements:
        all_departments.append(element.text)

    return all_departments

def get_all_courses():
    all_departments = find_all_departments()
    course_data = []

    for department in all_departments:
        url = f"https://app.testudo.umd.edu/soc/{term_ID}/{department}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        courses_container = soup.find('div', class_='courses-container')
        courses = courses_container.find_all('div', class_='course')

        for course in courses:
            ## FIND BASIC COURSE INFO
            course_id = course.find('div', class_='course-id')
            course_title = course.find('span', class_='course-title')
            course_min_credits = course.find('span', class_='course-min-credits')
            approved_course_text = course.find_all('div', class_=['approved-course-text', 'course-text'])



            print(f"Adding {course_id.get_text(strip=True)}")


            if course_id:
                course_id = course_id.get_text(strip=True)

            if course_title:
                course_title = course_title.get_text(strip=True)

            if course_min_credits:
                course_min_credits = course_min_credits.get_text(strip=True)

            # Append all descriptions
            description = ""
            for course_text in approved_course_text:
                if description == "":
                    description = course_text.get_text(strip=True)
                else:
                    description += f"\n\n{course_text.get_text(strip=True)}"

            # Add space after periods and colons
            description = re.sub(r'\.(?=[^\s])', '. ', description)
            description = re.sub(r':(?=[^\s])', ': ', description)



            ## FIND PROFESSORS
            # Go into course subpage to find sections & professors
            url = f"https://app.testudo.umd.edu/soc/{term_ID}/{department}/{course_id}"
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            all_instructors = soup.find_all('span', class_='section-instructor')

            professors = {}
            for instructor in all_instructors:
                professors[instructor.get_text(strip=True)] = -1

            course_data.append({
                'id': course_id,
                'title': course_title,
                'credits': course_min_credits,
                'description': description,
                'professors': professors
            })

    return course_data

def get_professor(professor_name):

    url = "https://planetterp.com/api/v1/professor"
    params = {
        'name': professor_name,
        'reviews': "false",
    }

    response = requests.get(url, params=params)
    return response.json()

def get_course(course_id):
    url = "https://planetterp.com/api/v1/course"
    params = {
        'name': course_id,
        'reviews': "false",
    }

    response = requests.get(url, params=params)
    return response.json()



def append_professor_info_and_avg_gpa(data):
    visited_profs = {}

    for course in data:
        # Use planetterp to get average GPA
        course_info = get_course(course["id"])
        course['average_gpa'] = course_info.get('average_gpa', -1)

        # Iterate through course professors and get rating from planetterp
        for professor_name in list(course["professors"]):
            print(f"Adding Professor Rating: {course['id']} {professor_name}")

            # If professor info has already been scraped, then use it
            if professor_name in visited_profs:
                prof_info = visited_profs[professor_name]
            else:
                prof_info = get_professor(professor_name)
                visited_profs[professor_name] = prof_info

            if prof_info and prof_info.get('average_rating', None):
                course['professors'][professor_name] = str(round(prof_info['average_rating'], 2))

def write_to_csv(data, filename):

    os.makedirs(os.path.dirname(filename), exist_ok=True)

    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["id", "course_title", "description", "combined", "average_gpa", "credits", "professors"])

        for course in data:
            if course["title"] and course["description"]:
                # Add course level, ex: CMSC216 is 200 level
                match = re.match(r'[A-Z]{4}([0-9])', course["id"])

                level = ""
                if match:
                    level = match.group(1) + "00 level"

                combined = course["id"] + "-" + course["title"] + "-" + course["description"] + "-" + level

                # A course can be considered "easy" if the avg. gpa is > 3.0
                if course["average_gpa"] and float(course["average_gpa"]) > 3.0:
                    combined += "-easier, higher average gpa"

                writer.writerow(
                    [course["id"], course["title"], course["description"], combined, course.get("average_gpa", -1),
                     course["credits"], course["professors"]])


all_courses = get_all_courses()
append_professor_info_and_avg_gpa(all_courses)
print(all_courses)

directory = "data/courses.csv"
write_to_csv(all_courses, directory)







