# Using the APIs of Ecole 42, I obtained the profile photos of all 42 Istanbul students. 
Then I included it in the project to use it in face recognition application using Python.

Document I use : https://api.intra.42.fr/apidoc

## Description

This project was done by using axios to get the photos of only 42 Istanbul campus students from 42 APIs and to recognize 42 Istanbul students in face recognition application.

The Python program puts the photos taken from 42 APIs in the 42 API/photos folder. After running main.py, it reaches the 42API/photos folder and scans the faces, and when the scan is finished, the program opens. If you match the scanned faces after the program is opened, a percent sign will appear on you and your name will be written.


## How to use
Clone the repo
```sh
https://github.com/bertt6/face_recognition_using_api
```
Install requirement
```sh
pip3 install opencv-python
```
```sh
pip3 install face-recognition
```
And you can execute program
```sh
python3 main.py
```
