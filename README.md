# GeoSpy API Mapping Application

![GeoSpy Web App Screenshot](https://hosting.photobucket.com/images/i/bernhoftbret/geospy-api-mapping-app-histogram-update.png)

Geolocation analysis and visualization tool which takes one or more images, sends them to the [GeoSpy API](https://dev.geospy.ai/docs/routes#overview) for location prediction and presents the results interactively on a web-based map and data dashboard.

## Overview

The Python backend encodes images to Base64, submits them to the API, collects the top geolocation predictions and saves the structured responses to a JSON file. The JavaScript frontend loads the JSON file and visualizes predictions using Leaflet for interactive map markers and heatmaps. D3.js is also used for a confidence score histogram and dynamic UI components for sorting, searching, previewing images and exploring prediction certainty.

Together, the system enables users to analyze where an image was likely taken, compare prediction confidence levels and visually explore spatial clustering and score distribution.

## Please Read The Following

This repository has been officially deprecated and is no longer actively maintained, primarily because the GeoSpy API it depends on is not accessible for testing, demonstration or general use. Without access to this core service, key features of the application may not function as intended and no further updates, fixes or support will be provided.

Anyone choosing to use, modify or extend this project should be prepared to replace the API integration, troubleshoot potential issues independently and adapt the codebase to suit their own needs.

## Set Up Instructions

Below are the set up steps and prerequisite software programs needed for this application to run on a Linux machine.

### Programs Needed

- [Git](https://git-scm.com/downloads)

- [Python](https://www.python.org/downloads/)

### Steps

1. Install the above programs

2. Open a terminal

3. Clone this repository using `git` by running the following command: `git clone git@github.com:devbret/geospy-api-mapping.git`

4. Navigate to the repo's directory: `cd geospy-api-mapping`

5. Create a virtual environment: `python3 -m venv venv`

6. Activate your virtual environment: `source venv/bin/activate`

7. Install the needed dependencies for running the script: `pip install -r requirements.txt`

8. Navigate to the provided `images` directory and add your photos

9. Open `app.py` in a text editor
   - Enter your `API_TOKEN` value and `IMAGE_FILES` path(s), from the previously mentioned `images` directory

10. Run the script: `python3 app.py`

11. Use the following command to view the frontend: `python3 -m http.server`

12. Via the world map, select your JSON and press the blue button to load and display the results

13. Exit the virtual environment when finished: `deactivate`

## Other Considerations

This project repo is intended to demonstrate an ability to do the following:

- Process images through a geolocation API and visualize the predicted locations on an interactive map with markers

- Enable users to explore, search and sort location predictions

- Provide a histogram view to analyze the distribution of prediction confidence scores

If you have any questions or would like to collaborate, please reach out either on GitHub or via [my website](https://bretbernhoft.com/).
