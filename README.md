# GeoSpy API Mapping
Query the [GeoSpy API](https://dev.geospy.ai/docs/routes#overview) for any number of images, and then visualize that JSON data on a world map.

## Basic Usage
After cloning the repo, open the app.py script in a text editor. Therein enter your API_TOKEN and IMAGE_FILES strings. Once your details are entered, open a terminal and run *python3 app.py*. This will query the GeoSpy API, and produce a JSON file in the same directory as this script.

Next, open the index.html file in any browser. This will feature a world map, file uploader and "Load Data" button. Upload your JSON file with the file upload input. And then press the button.

For further clarification of how this app works, [here is a brief YouTube video walkthrough](https://youtu.be/6phQE0MY_ak).

## Important Points To Remember
The returned coordinates for each image will all share the same hue. But the more likely a prediction is correct, the lighter the shade of a given marker.
