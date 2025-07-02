import time
import os
import numpy as np
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ultralytics import YOLO

from .model.main import license_plate_detection_pipeline

# تحميل الموديلات مرة واحدة فقط عند بدء الخادم
plate_path = os.path.join(settings.BASE_DIR, 'cardetector', 'model', 'plate.pt')
yolo_path = os.path.join(settings.BASE_DIR, 'cardetector', 'model', 'yolo11n.pt')
ocr_path = os.path.join(settings.BASE_DIR, 'cardetector', 'model', 'best.pt')

print("Loading models...")  
yolo_model = YOLO(yolo_path)
plate_model = YOLO(plate_path)
ocr_model = YOLO(ocr_path)
print("Models loaded successfully.")


@api_view(['POST'])
def send_image(request):
    print("Received request - start processing")
    
    try:
        image = request.data['image']
    except KeyError:
        return Response({'error': 'No image data found in request'}, status=400)

    height = len(image)
    width = len(image[0])
    np_pixels = np.array(image, dtype=np.uint8).reshape((height, width, 3))
    print(np_pixels)
    print(len(np_pixels))
    print(height,width)

    print("Starting license plate detection pipeline...")
    result = license_plate_detection_pipeline(np_pixels, yolo_model, plate_model, ocr_model)
    print("Finished license plate detection pipeline.")

    # print("⏳ Waiting 10 seconds before sending response...")
    # time.sleep(10)
    # print("⏳ Done waiting.")

    return Response({'data': result, 'message': 'that is the plate numbers'}, content_type='application/json; charset=utf-8')
