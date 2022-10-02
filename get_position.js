var wind_power;

function test() {
    navigator.geolocation.getCurrentPosition(test2);
}
function test2(position) {

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;  
    document.getElementById('LatLon').innerHTML = lat + ", " + lon; //緯度経度表示

    const base_url1="https://api.open-meteo.com/v1/forecast?";
    const base_url2 = "&hourly=surface_pressure&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Asia%2FTokyo";
    const base_url3 = "&hourly=precipitation,cloudcover=Asia%2FTokyo";

    var url = base_url1 + "latitude=" + lat + "&"  + "longitude="+ lon + base_url2;
    //var url2 = base_url1 + "latitude=" + lat + "&"  + "longitude="+ lon + base_url3;

    var replaced_text;
    var data;

    var maxtemp = 0;
    var mintemp = 0;
    var press = 0;
    var maxwind = 0;

    //var wind_power; //0:晴れ 1:弱い風 2:強い風 -1:error

    fetch(url).then(function(response) {
      return response.text();
    }).then(function(text) {
        replaced_text = text.replace( /\r?\n|\[|]|:/g, ',' );
        data = replaced_text.split(',');

        for (var i = 0; i < data.length; i++) {
            if ( data[i] == "\"temperature_2m_max\"" & data[i + 1] == ""){
                maxtemp = data[i + 2];
            }
            if ( data[i] == "\"temperature_2m_min\"" & data[i + 1] == ""){
                mintemp = data[i + 2];
            }
            if ( data[i] == "\"windspeed_10m_max\"" & data[i + 1] == ""){
                maxwind = data[i + 2];
            }
            if ( data[i] == "\"surface_pressure\"" & data[i + 1] == ""){
                var sum = 0;
                for(j = 0; j < 24; j++){
                   sum = sum + Number(data[i + 2 + j]); 
                }
                press = sum / 24;
            }
        }
        document.getElementById('maxtemp').innerHTML = maxtemp;
        document.getElementById('mintemp').innerHTML = mintemp;
        document.getElementById('press').innerHTML = press.toFixed(1);
        document.getElementById('maxwind').innerHTML = maxwind; 

        //串本の平均
        const ave_max_earth_temp = 20.921858;
        const ave_min_earth_temp= 15.169126;
        const ave_earth_press = 1006.405464;
        const ave_earth_wind = 7.511749;
        const ave_earth_array = [ave_max_earth_temp,ave_min_earth_temp,ave_earth_press,ave_earth_wind];
        //串本の標準偏差
        const std_max_earth_temp = 7.111789;
        const std_min_earth_temp = 7.636804;
        const std_earth_press =  5.886551;
        const std_earth_wind = 2.574724;
        const std_earth_array = [std_max_earth_temp,std_min_earth_temp,std_earth_press,std_earth_wind];
        //火星の平均データ
        const ave_max_mars_temp=2.017;
        const ave_min_mars_temp=-80.31;
        const ave_mars_press=828.79;
        const ave_mars_array = [ave_max_mars_temp,ave_min_mars_temp,ave_mars_press];
        //火星の標準偏差
        const std_max_mars_temp=9.40;
        const std_min_mars_temp=8.84;
        const std_mars_press=57.11;
        const std_mars_array = [std_max_mars_temp,std_min_mars_temp,std_mars_press];
        //火星天気予報
        //APIでnow_は取得する
        var now_max_earth_temp = Number(maxtemp); //API
        var now_min_earth_temp= Number(mintemp); //API
        var now_earth_press = Number(press); //API
        var now_earth_wind = Number(maxwind); //API
        var now_earth_array=[now_max_earth_temp,now_min_earth_temp,now_earth_press,now_earth_wind];
        var weathercast = [0, 0, 0, 0];
        for (var i = 0; i < 3; i++){
        weathercast[i] = ((now_earth_array[i]-ave_earth_array[i]) / std_earth_array[i]) * std_mars_array[i] + ave_mars_array[i];
        }
        weathercast[3] = now_earth_wind;
        
        if (0 <= now_earth_wind <= 10){                        
            //晴れ画像表示
            wind_power = "sunny";
        }
        if (10 < now_earth_wind <= 20){
            wind_power = "weak_wind";
            //弱い風表示
        }
        if (20 < now_earth_wind){
            wind_power = "strong_wind";
            //強い風表示
        }       
        console.log(wind_power);
        
        document.getElementById('maxtemp_m').innerHTML = weathercast[0].toFixed(1);
        document.getElementById('mintemp_m').innerHTML = weathercast[1].toFixed(1);
        document.getElementById('press_m').innerHTML = weathercast[2].toFixed(1);
        document.getElementById('maxwind_m').innerHTML = weathercast[3].toFixed(1); 

        //document.getElementById('for_panorama').innerHTML = wind_power;
        sessionStorage.setItem("key", wind_power);
    });

    // fetch(url2).then(function(response) {
    //     return response.text2();
    // }).then(function(text2) {
    //       replaced_text = text.replace( /\r?\n|\[|]|:/g, ',' );
    //       data = replaced_text.split(',');
    // }
}

