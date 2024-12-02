from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from webdriver_manager.firefox import GeckoDriverManager
import time

# Set up Firefox options to enable headless mode
options = Options()
options.add_argument("--headless")  # Enable headless mode

# Create a WebDriver instance using GeckoDriver for Firefox (automatically managed by webdriver_manager)
driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()), options=options)

l = []
o = {}

target_url = "https://twitter.com/Sanatan_dive"

driver.get(target_url)
time.sleep(2)  # Wait for the page to load

resp = driver.page_source
driver.quit()  # Close the driver after getting the page source

soup = BeautifulSoup(resp, 'html.parser')

# Scrape profile details
try:
    o["profile_name"] = soup.find("div", {"class": "r-1vr29t4"}).text
except:
    o["profile_name"] = None

try:
    o["profile_handle"] = soup.find("div", {"class": "r-1wvb978"}).text
except:
    o["profile_handle"] = None

try:
    o["profile_bio"] = soup.find("div", {"data-testid": "UserDescription"}).text
except:
    o["profile_bio"] = None

profile_header = soup.find("div", {"data-testid": "UserProfileHeader_Items"})

try:
    o["profile_category"] = profile_header.find("span", {"data-testid": "UserProfessionalCategory"}).text
except:
    o["profile_category"] = None

try:
    o["profile_website"] = profile_header.find('a').get('href')
except:
    o["profile_website"] = None

try:
    o["profile_joining_date"] = profile_header.find("span", {"data-testid": "UserJoinDate"}).text
except:
    o["profile_joining_date"] = None

try:
    o["profile_following"] = soup.find_all("a", {"class": "r-rjixqe"})[0].text
except:
    o["profile_following"] = None

try:
    o["profile_followers"] = soup.find_all("a", {"class": "r-rjixqe"})[1].text
except:
    o["profile_followers"] = None

# # Scrape latest tweets (limit to 2 tweets)
# tweets = []
# tweet_elements = soup.find_all("article", limit=2)

# for tweet_element in tweet_elements:
#     try:
#         tweet_text = tweet_element.get_text()
#         tweets.append(tweet_text)
#     except:
#         tweets.append(None)

# o["tweets"] = tweets

# # Append the collected data into the list
l.append(o)

# Print the collected data
print(l)
