# GeoSpy API Mapping Application

![GeoSpy Web App Screenshot](https://hosting.photobucket.com/images/i/bernhoftbret/geospy-api-mapping-app-histogram-update.png)

Query the [GeoSpy API](https://dev.geospy.ai/docs/routes#overview) for any allowed number of images using Python. Then visualize that JSON data on a world map with D3.

If you would like to view a quick demo of this application, here is [a YouTube video](https://youtu.be/KtOU95pg9hY) to check out.

## Basic Usage

After cloning the repo, first open the provided images directory, and add your files/photos therein. Then open the app.py script in a text editor. Here, enter your API_TOKEN value and IMAGE_FILES path(s), from the previously mentioned images directory. Once your details are saved, open a terminal and run `pip install -r requirements.txt`. Thereby ensuring that you have the Python library needed for this application to work properly. Following a successful install, run `python3 app.py` in the console. This will query the GeoSpy API, and produce a JSON file locally.

Next, open the index.html file with any modern web browser. This will feature a world map, file uploader, "Load Data" button and other interfaces. Select your JSON with the file input element. Finally press the blue button to load and display the results.

## Important Point To Remember

The predictive coordinates returned for each image will all share the same hue when viewed as markers on the world map.
