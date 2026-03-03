# GeoSpy API Mapping Application

![GeoSpy Web App Screenshot](https://hosting.photobucket.com/images/i/bernhoftbret/geospy-api-mapping-app-histogram-update.png)

A geolocation analysis and visualization tool which takes one or more images, sends them to the [GeoSpy API](https://dev.geospy.ai/docs/routes#overview) for location prediction and presents the results interactively on a web-based map and data dashboard.

## Overview

The Python backend encodes images to Base64, submits them to the API, collects the top geolocation predictions and saves the structured responses to a JSON file. The JavaScript frontend loads the JSON file and visualizes predictions using Leaflet for interactive map markers and heatmaps. D3.js is also used for a confidence score histogram and dynamic UI components for sorting, searching, previewing images and exploring prediction certainty.

Together, the system enables users to analyze where an image was likely taken, compare prediction confidence levels and visually explore spatial clustering and score distribution.

## Basic Usage

After cloning the repo, first open the provided images directory and add your files/photos therein. Then open the app.py script in a text editor. Here, enter your API_TOKEN value and IMAGE_FILES path(s), from the previously mentioned images directory. Once your details are saved, open a terminal and run `pip install -r requirements.txt`. Thus ensuring you have the Python library needed for this application to work properly. Following a successful install, run `python3 app.py` in the console. This will query the GeoSpy API, and produce a JSON file locally.

Next, open the index.html file with any modern web browser. This will feature a world map, file uploader, "Load Data" button and other interfaces. Select your JSON with the file input element. Finally press the blue button to load and display the results.

## Please Read The Following

This repo is no longer being actively maintained, given the GeoSpy API is not available for testing, demoing or generally playing around with. Best of luck if you, for some reason, do choose to use this application!

If you have any questions, feel free to [reach out](https://bretbernhoft.com/).
