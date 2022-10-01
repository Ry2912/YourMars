function test() {
    navigator.geolocation.getCurrentPosition(test2);
}
function test2(position) {

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    //var lat='35';
    //var lon='135';    
    document.getElementById('LatLon').innerHTML = lat + ", " + lon; //緯度経度表示

    const base_url1="https://api.open-meteo.com/v1/forecast?";
    const base_url2 = "&hourly=surface_pressure&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Asia%2FTokyo";
    var url = base_url1 + "latitude=" + lat + "&"  + "longitude="+ lon + base_url2;
    
    var replaced_text;
    var data;

    var maxtemp = 1;
    var mintemp;
    var press;
    var maxwind;

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
        document.getElementById('press').innerHTML = press.toFixed(3);
        document.getElementById('maxwind').innerHTML = maxwind; 
    });

    //串本の平均
    var ave_max_earth_temp = 20.921858;
    var ave_min_earth_temp= 15.169126;
    var ave_earth_press = 1006.405464;
    var ave_earth_wind = 7.511749;
    const ave_earth_array = [ave_max_earth_temp,ave_min_earth_temp,ave_earth_press,ave_earth_wind];
    //串本の標準偏差
    var std_max_earth_temp = 7.111789;
    var std_min_earth_temp = 7.636804;
    var std_earth_press =  5.886551;
    var std_earth_wind = 2.574724;
    const std_earth_array = [std_max_earth_temp,std_min_earth_temp,std_earth_press,std_earth_wind];
    //火星の平均データ
    var ave_max_mars_temp=2.017;
    var ave_min_mars_temp=-80.31;
    var ave_mars_press=828.79;
    const ave_mars_array = [ave_max_mars_temp,ave_min_mars_temp,ave_mars_press];
    //火星の標準偏差
    var std_max_mars_temp=9.40;
    var std_min_mars_temp=8.84;
    var std_mars_press=57.11;
    const std_mars_array = [std_max_mars_temp,std_min_mars_temp,std_mars_press];
    //火星天気予報
    //APIでnow_は取得する
    var now__max_earth_temp = Number(maxtemp); //API
    var now_min_earth_temp= Number(mintemp); //API
    var now_earth_press = Number(press); //API
    var now_earth_wind = Number(maxwind); //API
    var now_earth_array=[now__max_earth_temp,now_min_earth_temp,now_earth_press,now_earth_wind];
    var weathercast=[];
    for (let i = 0; i < 3; i++){
    weathercast.push((now_earth_array[i]-ave_earth_array[i])/std_earth_array[i]*std_mars_array[0]+ave_mars_array[i]);
    }
    weathercast.push(ave_earth_wind);
    console.log(weathercast);

    // fetch(url)
    // .then(response => response.json())
    // .then(data => document.getElementById('test').innerHTML = data);

    // fetch(url)
    // .then(function (data) {
    //     return data.json(); // 読み込むデータをJSONに設定
    // })
    // .then(function (json) {
    //     var maxtemp = json[0];
    //     document.getElementById('test').innerHTML = maxtemp;  
    //     // for (var i = 0; i < json.length; i++) {
    //     //     var maxtemp = json[i].daily.tempreture_2m_max;
    //     //     //var company = json[i].company;

    //     // }
    // });

    // var geo_text = "緯度:" + position.coords.latitude + "\n";
    // geo_text += "経度:" + position.coords.longitude + "\n";
    // // geo_text += "高度:" + position.coords.altitude + "\n";
    // // geo_text += "位置精度:" + position.coords.accuracy + "\n";
    // // geo_text += "高度精度:" + position.coords.altitudeAccuracy  + "\n";
    // // geo_text += "移動方向:" + position.coords.heading + "\n";
    // // geo_text += "速度:" + position.coords.speed + "\n";

    // var date = new Date(position.timestamp);

    // geo_text += "取得時刻:" + date.toLocaleString() + "\n";

    // alert(geo_text);
}