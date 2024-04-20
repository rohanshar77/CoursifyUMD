import os
import re
import requests
import csv
from bs4 import BeautifulSoup


class PlanetTerpScraper:
    def __init__(self):
        self.base_url = "https://planetterp.com/api/v1"

    # Returns an array of department courses
    def get_all_courses(self):
        url = "https://app.testudo.umd.edu/soc/202308"
        data = []

        # Make a GET request to the URL and get all departments
        response = requests.get(url)
        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
        elements = soup.find_all('span', class_='prefix-abbrev')

        # Get all courses for each department since get_courses API is limited to 100 elements.
        for i, element in enumerate(elements):
            department = element.text
            data.append(self.get_courses(department))

        return data

    def get_courses(self, department=None):
        url = f"{self.base_url}/courses"
        params = {
            "department": department
        }

        response = requests.get(url, params=params)
        print("Department: " + department + ": ", response.json())
        return response.json()

    def get_professor(self, professor_name, include_reviews=True):

        url = f"{self.base_url}/professor"
        params = {
            'name': professor_name,
            'reviews': "true",
        }

        response = requests.get(url, params=params)
        return response.json()

    def write_to_csv(self, data, filename):
        os.makedirs(os.path.dirname(filename), exist_ok=True)

        with open(filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["id", "course_title", "description", "combined", "average_gpa", "credits", "professors"])

            for department in data:
                for course in department:
                    if course["title"] and course["description"] and course["average_gpa"] and course["professors"]:
                        # Updated regex to match only undergraduate courses (1-4 at the start of the course number)
                        match = re.match(r'[A-Z]{4}(1|2|3|4)[0-9]{2}', course["name"])

                        if match:
                            level = match.group(1) + "00 level"
                            combined = course["name"] + "-" + course["title"] + "-" + course[
                                "description"] + "-" + level

                            # Additional logic for easier courses, if needed
                            if float(course["average_gpa"]) > 3.0:
                                combined += "-easier, higher average gpa"

                            writer.writerow(
                                [course["name"], course["title"], course["description"], combined,
                                 course["average_gpa"],
                                 course["credits"], course["professors"]])

    def append_professor_ratings(self, data):
        visited_profs = {}

        for department in data:
            for course in department:
                if course["description"] and course["average_gpa"] and course["credits"]:
                    for index, professor in enumerate(course["professors"]):
                        print("Getting: " + course["name"], professor)

                        prof_info = None
                        # Many courses have the same professor teaching them, so no need to call API if we already have data
                        if professor in visited_profs:
                            prof_info = visited_profs[professor]
                        else:
                            prof_info = self.get_professor(professor, True)
                            visited_profs[professor] = prof_info

                        if prof_info and prof_info['average_rating']:
                            course['professors'][index] += ": " + str(round(prof_info['average_rating'], 2))
                        else:
                            course['professors'][index] += ": " + "No ratings"


if __name__ == "__main__":
    scraper = PlanetTerpScraper()
    data = scraper.get_all_courses()

    # This takes a while, so may need to tweak later.
    scraper.append_professor_ratings(data)

    filename = "data/courses-4 (combined w id, level, gpa).csv"

    if os.path.exists(filename):
        # If it does, find a new filename by incrementing a counter
        i = 1
        while os.path.exists(f"{filename.split('.')[0]}-{i}.csv"):
            i += 1
        filename = f"{filename.split('.')[0]}-{i}.csv"

    # Write the retrieved data to a CSV file if it is a list
    if len(data) != 0:
        scraper.write_to_csv(data, filename)
    else:
        print("Data is not a list or Data is empty, skipping CSV write")
