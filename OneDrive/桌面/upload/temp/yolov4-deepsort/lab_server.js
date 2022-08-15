//後面請改pi上server位址
var socket = require('socket.io-client')('http://localhost:8003');

let { PythonShell } = require('python-shell')


//(0815)pythonPath請改成anaconda環境下的python, 理論上應該會在~[env name]\python
//args的video的下一個請改成streamer的ip位址
let options = {
    mode: 'text',
    pythonPath: 'C:\\Users\\tronu\\Anaconda3\\envs\\yolov4-gpu\\python',
    pythonOptions: ['-u'], // get print results in real-time
    args: ['--video', './data/video/test.mp4', '--model', 'yolov4', '--info']
};

let options2 = {
    mode: 'text',
    pythonPath: 'C:\\Users\\tronu\\Anaconda3\\envs\\yolov4-gpu\\python',
    pythonOptions: ['-u'] // get print results in real-time
    
};

//threadwatchstate.py
let pyshell = new PythonShell('./object_tracker_base64.py', options);
//let pyshell = new PythonShell('./base64_client.py',options2);

//(0815)儲存在lab server不斷更新的uavstate
uavstate = {
    lat: 0,
    alt: 0,
    lon: 0,
    Mode: 0,
    BatteryVoltage: 0,
    BatteryCurrent: 0,
    BatteryLevel: 0,
    IsArmable: 0,
    armed: 0,
    airspeed: 0,
    SystemStatus: 0,
    GlobalLat: 0,
    GlobalLon: 0,
    SeaLevelAltitude: 0,
    RelativeAlt: 0,
    localAlt: 0,
    loranodelat: 0,
    loranodelon: 0,
    loranodefind: 0
}


socket.on('connect', function () {
    console.log('connect with server');
});
socket.on("disconnect", () => {
    console.log("client disconnect");
});

//(0815)不同步接收更新uavstate
socket.on('uavstate', (message) => {  
    //const parsedString = JSON.parse(message);
    uavstate = message
    console.log(uavstate.Mode);
});

//(0815)不同步接收(更新等加計算後)物件資訊
pyshell.on('message', function (message) {
    if (message[0] != '{') {
        //(0815)目前看起來Frame跟FPS輸出都是F開頭, 所以不是的話應該只剩圖片了
        //假如之後有要改輸出, 或是發現圖片輸出開頭有可能有F的話再對這裡進行修改
        if( message[0] != 'F' && message[0] != '{'){
            var ret = Object.assign({}, message, {
                frame: Buffer.from(message.toString(), 'base64') // from buffer to base64 string
            }) 
            socket.emit('yolo_result_image',ret.frame);
        }else{
            console.log("pyprint:" + message);
        }

    } else {

        const parsedString = JSON.parse(message);
        //console.log(parsedString);
        //
        //(0814)todo: 之後在這裡加景深處理 回傳新的經緯度
        /*------------------------------------------*/
        //
        socket.emit('yolov4_result', {
            Mode: String(parsedString.Mode),
            BatteryVoltage: String(parsedString.BatteryVoltage),
        });
    }
});
