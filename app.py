import aiohttp
import asyncio
import base64
import logging
import json
from aiohttp import ClientTimeout

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s: %(message)s')

API_TOKEN = "your_api_key"
API_BASE = "https://dev.geospy.ai"
API_ENDPOINT = "/predict"
FULL_API_URL = f"{API_BASE}{API_ENDPOINT}"
IMAGE_FILES = ["path/to/your/images/example.jpg",]

request_timeout = ClientTimeout(total=60)

collected_responses = []

async def convert_image_to_base64(image_path: str) -> str:
    with open(image_path, "rb") as file:
        encoded_string = base64.b64encode(file.read()).decode()
    return encoded_string

async def post_image_data(session, encoded_image: str, file_path: str):
    data = {
        "inputs": {"image": encoded_image},
        "top_k": 25,
    }
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json',
    }

    try:
        async with session.post(FULL_API_URL, json=data, headers=headers, timeout=request_timeout) as resp:
            if resp.status == 200:
                response_data = await resp.json()
                collected_responses.append({file_path: response_data})
                logging.debug(f"Request successful for {file_path}: {response_data}")
            else:
                logging.error(f"Request failed for {file_path} with status {resp.status}: {await resp.text()}")
    except Exception as error:
        logging.error(f"Error during request for {file_path}: {error}")

async def process_images():
    async with aiohttp.ClientSession() as session:
        tasks = []
        for path in IMAGE_FILES:
            try:
                encoded_img = await convert_image_to_base64(path)
                task = asyncio.create_task(post_image_data(session, encoded_img, path))
                tasks.append(task)
                await asyncio.sleep(1)
            except Exception as e:
                logging.error(f"Error processing image {path}: {e}")
        await asyncio.gather(*tasks, return_exceptions=True)
        with open('api_responses.json', 'w') as json_file:
            json.dump(collected_responses, json_file)

if __name__ == "__main__":
    asyncio.run(process_images())
