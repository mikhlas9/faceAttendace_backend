# import face_recognition
# import cv2
# import requests
# import numpy as np
# import sys
# import base64

# def fetch_student_images(class_id):
#     url = f"http://localhost:5001/api/students/images/{class_id}"
#     response = requests.get(url)
#     data = response.json()
#     student_images = []

#     if 'success' in data:
#         for student in data['data']:
#             image_data = student['image']
#             image_bytes = np.frombuffer(base64.b64decode(image_data), dtype=np.uint8)
#             image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
#             student_images.append((student['name'], image))
#     return student_images

# def load_student_encodings(student_images):
#     encodings = []
#     names = []
#     for name, image in student_images:
#         encoding = face_recognition.face_encodings(image)[0]
#         encodings.append(encoding)
#         names.append(name)
#     return encodings, names

# def update_attendance(class_id, recognized_students):
#     url = f"http://localhost:5001/api/attendance/update"
#     headers = {'Content-Type': 'application/json'}
#     data = {
#         'classId': class_id,
#         'students': list(recognized_students)
#     }
#     response = requests.post(url, headers=headers, json=data)
#     return response.json()

# if __name__ == "__main__":
#     class_id = sys.argv[1]
#     student_images = fetch_student_images(class_id)
#     student_encodings, student_names = load_student_encodings(student_images)

#     video_capture = cv2.VideoCapture(0)
#     recognized_students = set()

#     while True:
#         ret, frame = video_capture.read()
#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         face_locations = face_recognition.face_locations(rgb_frame)
#         face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

#         for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
#             matches = face_recognition.compare_faces(student_encodings, face_encoding)
#             name = "Unknown"

#             if True in matches:
#                 index = matches.index(True)
#                 name = student_names[index]
#                 recognized_students.add(name)
            
#             cv2.putText(frame, name, (left, top-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0) if name != "Unknown" else (0, 0, 255), 2)
#             cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

#         cv2.imshow('Video', frame)

#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

#     video_capture.release()
#     cv2.destroyAllWindows()

#     print("Recognized students: ", list(recognized_students))

#     # Update attendance in MongoDB
#     response = update_attendance(class_id, recognized_students)
#     print("Attendance update response: ", response)




# import face_recognition
# import cv2
# import requests
# import numpy as np
# import sys
# import base64
# import json
# from pymongo import MongoClient
# from bson import ObjectId

# def fetch_student_images(class_id):
#     url = f"http://localhost:5001/api/students/images/{class_id}"
#     response = requests.get(url)
#     data = response.json()
#     student_images = []

#     if 'success' in data:
#         for student in data['data']:
#             image_data = student['image']
#             image_bytes = np.frombuffer(base64.b64decode(image_data), dtype=np.uint8)
#             image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
#             student_images.append((student['name'], image))
#     return student_images

# def load_student_encodings(student_images):
#     encodings = []
#     names = []
#     for name, image in student_images:
#         encoding = face_recognition.face_encodings(image)[0]
#         encodings.append(encoding)
#         names.append(name)
#     return encodings, names

# def fetch_image_from_db(image_id):
#     client = MongoClient('mongodb+srv://attendance:attendance123@cluster0.2ttoigo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
#     db = client.faceRecognition
#     try:
#         image_record = db.images.find_one({'_id': ObjectId(image_id)})
#         if image_record:
#             return image_record['image']
#         else:
#             return None
#     except Exception as e:
#         print(f"Error fetching image from DB: {e}", file=sys.stderr)
#         return None
#     finally:
#         client.close()

# def main():
#     if len(sys.argv) < 3:
#         print("Error: Not enough arguments provided.", file=sys.stderr)
#         sys.exit(1)

#     class_id = sys.argv[1]
#     image_id = sys.argv[2]

#     image_data = fetch_image_from_db(image_id)
#     if not image_data:
#         print(f"Error: No image found for ID {image_id}", file=sys.stderr)
#         sys.exit(1)

#     image_bytes = np.frombuffer(base64.b64decode(image_data), dtype=np.uint8)
#     frame = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

#     student_images = fetch_student_images(class_id)
#     student_encodings, student_names = load_student_encodings(student_images)

#     rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#     face_locations = face_recognition.face_locations(rgb_frame)
#     face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

#     recognized_students = set()

#     for face_encoding in face_encodings:
#         matches = face_recognition.compare_faces(student_encodings, face_encoding)
#         name = "Unknown"

#         if True in matches:
#             index = matches.index(True)
#             name = student_names[index]
#             recognized_students.add(name)

#     print(json.dumps(list(recognized_students)))

# if __name__ == "__main__":
#     main()








import face_recognition
import cv2
import numpy as np
import sys
import json
import requests
import base64


def fetch_student_images(class_id):
    url = f"http://localhost:5001/api/students/images/{class_id}"
    response = requests.get(url)
    data = response.json()
    student_images = []

    if 'success' in data:
        for student in data['data']:
            image_data = student['image']
            image_bytes = np.frombuffer(base64.b64decode(image_data), dtype=np.uint8)
            image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
            student_images.append((student['name'], image))
    return student_images

def load_student_encodings(student_images):
    encodings = []
    names = []
    for name, image in student_images:
        encoding = face_recognition.face_encodings(image)[0]
        encodings.append(encoding)
        names.append(name)
    return encodings, names

def recognize_image(file_path, student_encodings, student_names):
    frame = cv2.imread(file_path)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    recognized_students = set()

    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(student_encodings, face_encoding)
        name = "Unknown"

        if True in matches:
            index = matches.index(True)
            name = student_names[index]
            recognized_students.add(name)

    return recognized_students

def update_attendance(class_id, recognized_students):
    url = f"http://localhost:5001/api/attendance/update"
    headers = {'Content-Type': 'application/json'}
    data = {
        'classId': class_id,
        'students': list(recognized_students)
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()

def main():
    if len(sys.argv) < 3:
        print("Error: Not enough arguments provided.", file=sys.stderr)
        sys.exit(1)

    class_id = sys.argv[1]
    image_path = sys.argv[2]

    student_images = fetch_student_images(class_id)  # Fetch student images from database
    student_encodings, student_names = load_student_encodings(student_images)

    recognized_students = recognize_image(image_path, student_encodings, student_names)
    print(json.dumps(list(recognized_students)))

    update_attendance(class_id, recognized_students)

if __name__ == "__main__":
    main()
