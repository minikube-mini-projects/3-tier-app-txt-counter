# UI 
![image](https://github.com/minikube-mini-projects/3-tier-app-txt-counter/assets/146583259/9557de53-607c-4a37-8c8f-a582bb3dc682)

### DB INFO
![image](https://github.com/minikube-mini-projects/3-tier-app-txt-counter/assets/146583259/9408a4a0-c43c-4409-b5b9-102a79b22c96)



# CREATE A DB(file_upload_app) and execute the query
```
CREATE TABLE file_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    letter CHAR(1),
    count INT
);
```


## localhost
```
cd backend
node app.js
```
```
cd ..
cd frontend
python3 -m http.server
```

>> http://0.0.0.0:8000/


