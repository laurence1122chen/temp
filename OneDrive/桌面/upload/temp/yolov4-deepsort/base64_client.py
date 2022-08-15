from ast import While
from pickle import TRUE
from time import sleep
import cv2
#import socketio #python-socketio by @miguelgrinberg
import base64
from threading import Timer

#sio = socketio.Client()
#sio.connect('http://127.0.0.1:8003')

cam = cv2.VideoCapture(0)

while(TRUE):
    #(0815)
    ret, frame = cam.read()                     # get frame from webcam
    res, frame_0 = cv2.imencode('.jpg', frame)
    content = frame_0.tobytes()    # from image to binary buffer
    data = base64.b64encode(content).decode('ascii')
    print(data)
    sleep(0.1)
    #Timer(1.0, loop).start()              # convert to base64 format
  #sio.emit('data', data)                      # send to server

#Timer(1.0, loop).start()  

cam.release()