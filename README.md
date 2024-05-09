# GeoSpy API Mapping Application

![GeoSpy Web App Screenshot](https://hosting.photobucket.com/images/i/bernhoftbret/geospy-web-app-screenshot.png)

Query the [GeoSpy API](https://dev.geospy.ai/docs/routes#overview) for any number of images, and then visualize that JSON data on a world map.

## Basic Usage
After cloning the repo, first open the provided images directory, and add your files/photos therein. Then open the app.py script in a text editor. Here, enter your API_TOKEN value and IMAGE_FILES paths, from the images directory. Once your details are saved, open a terminal and run `pip install -r requirements.txt`. Thereby ensuring that you have the Python library needed for this application to work properly. Following a successful install, run `python3 app.py` in the console. This will query the GeoSpy API, and produce a JSON file locally.

Next, open the index.html file with any modern web browser. This will feature a world map, file uploader and "Load Data" button. Select your JSON with the file input element. Finally press the blue button to load and display the results.

For further clarification of how this app works, [here is a brief YouTube video walkthrough](https://youtu.be/6phQE0MY_ak).

## Important Point To Remember
The predictive coordinates returned for each image will all share the same hue.
