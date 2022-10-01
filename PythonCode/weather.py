from cv2 import mean
import requests
import pandas as pd

#位置情報取得
geo_request_url = 'https://get.geojs.io/v1/ip/geo.json'
data = requests.get(geo_request_url).json()
#print(data['latitude'])
#print(data['longitude'])

#天気API取得コード
base_url="https://api.open-meteo.com/v1/forecast?"
lat=data['latitude']
lon=data['longitude']
url = base_url + "latitude=" + lat + "&"  + "longitude="+ lon + "&hourly=temperature_2m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Asia%2FTokyo"

re = requests.get(url).json()
#pprint.pprint(re)
max_earth_temp=re['daily']['temperature_2m_max'][0]
min_earth_temp=re['daily']['temperature_2m_min'][0]
max_earth_wind=re['daily']['windspeed_10m_max'][0]

#print(len(re['hourly']['surface_pressure']))
pressure=0
for i in re['hourly']['surface_pressure'][0:24]:
    pressure+=i

earth_pressure=pressure/24
#print(earth_pressure)

#shio_weather=pd.read_csv("data.csv")
#print(shio_weather.head())

#codecs でファイルしていしてひらく
"""with codecs.open("weather.csv", "r", "Shift-JIS", "ignore") as file:
    X = pd.read_table(file, delimiter=",")
    print(X.head(10))"""
#地球の気象データ
X=pd.read_csv("weather.csv",encoding="Shift-JIS")
shio_weather=X.copy()
# check what the character encoding might be
shio_weather=shio_weather.drop(shio_weather.columns[[4]], axis=1)
shio_weather.to_csv("shio_weather.csv")
mean_list=shio_weather.mean()
#print(mean_list)
ave_max_temp=mean_list[4]
ave_min_temp=mean_list[3]
ave_press=mean_list[1]
ave_wind=mean_list[2]
std_list=shio_weather.std()
#print(std_list)
std_max_temp=std_list[4]
std_min_temp=std_list[3]
std_press=std_list[1]
std_wind=std_list[2]

standarized_max_earth_temp=(max_earth_temp-ave_max_temp)/std_max_temp
standarized_min_earth_temp=(min_earth_temp-ave_min_temp)/std_min_temp
standarized_earth_press=(earth_pressure-ave_press)/std_press
standarized_earth_wind=(max_earth_wind-ave_wind)/std_wind
standarized_earth_list=[standarized_max_earth_temp,standarized_min_earth_temp,standarized_earth_press]

#火星の気象データ
"""mars_data=pd.read_csv('Mars_Dataset.csv')
mars_data=mars_data.drop(mars_data.columns[[0,1,2,3,4,8,9,10,11,12,13]], axis=1)
"""
#mars_data.fillna(method='bfill', axis=0).fillna(0)
#mars_mean_list=mars_data.mean()
#mars_std_list=mars_data.std()

#print(mars_mean_list)
#print(mars_std_list)
ave_max_mars_temp=2.017
ave_min_mars_temp=-80.31
ave_mars_press=828.79
ave_mars_list=[ave_max_mars_temp,ave_min_mars_temp,ave_mars_press]
std_max_mars_temp=9.40
std_min_mars_temp=8.84
std_mars_press=57.11
std_mars_list=[std_max_mars_temp,std_min_mars_temp,std_mars_press]
mars_expect_list=[]


for i in range(3):
    mars_expect_list.append(standarized_earth_list[i]*std_mars_list[i]+ave_mars_list[i])
mars_expect_list.append(max_earth_wind)
#print(mars_expect_list)




