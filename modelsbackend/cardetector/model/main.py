from ultralytics import YOLO
import matplotlib.pyplot as plt
import numpy as np
import cv2
import os
from django.conf import settings


plate_path = os.path.join(settings.BASE_DIR, 'cardetector', 'model', 'plate.pt')
yolo_path = os.path.join(settings.BASE_DIR, 'cardetector', 'model', 'yolo11n.pt')
ocr_path = os.path.join(settings.BASE_DIR, 'cardetector', 'model', 'best.pt')

# Load models
yolo_model = YOLO(yolo_path)  # Optional general detector
plate_model = YOLO(plate_path)  # License plate detector
ocr_model = YOLO(ocr_path)  # OCR model

# yolo_model = YOLO('yolo11n.pt')  # Optional general detector
# plate_model = YOLO("plate.pt")  # License plate detector
# ocr_model = YOLO("best.pt")  # OCR model

# Map OCR labels to Arabic characters
def map_to_arabic(numbers, letters):
    number_map = {
        '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
        '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    }
    letter_map = {
        'alif': 'ا', 'baa': 'ب', 'taa': 'ت', 'thaa': 'ث',
        'jeem': 'ج', 'haa': 'ح', 'khaa': 'خ', 'daal': 'د',
        'zaal': 'ذ', 'raa': 'ر', 'zay': 'ز', 'seen': 'س',
        'sheen': 'ش', 'saad': 'ص', 'daad': 'ض', 'Taa': 'ط',
        'Thaa': 'ظ', 'ain': 'ع', 'ghayn': 'غ', 'faa': 'ف',
        'qaaf': 'ق', 'kaaf': 'ك', 'laam': 'ل', 'meem': 'م',
        'noon': 'ن', 'haah': 'ه', 'waw': 'و', 'yaa': 'ي',
        '7aa': 'ح'
    }
    arabic_numbers = [number_map.get(num, num) for num in reversed(numbers)]
    arabic_letters = [letter_map.get(letter, letter) for letter in reversed(letters)]
    return ' '.join(arabic_letters + arabic_numbers)

# Infer governorate based on plate structure
def classify_governorate(arabic_plate_text):
    gov_patterns = {
        "س": "الإسكندرية",
        "ر": "الشرقية",
        "د": "الدقهلية",
        "م": "المنوفية",
        "ب": "البحيرة",
        "ل": "كفر الشيخ",
        "ع": "الغربية",
        "ق": "القليوبية",
        "ف": "الفيوم",
        "و": "بني سويف",
        "ن": "المنيا",
        "ى": "أسيوط",
        "ه": "سوهاج",
        "ط س": "السويس",
        "ط ص": "الإسماعيلية",
        "ط ع": "بورسعيد",
        "ط د": "دمياط",
        "ط ا": "شمال سيناء",
        "ط ج": "جنوب سيناء",
        "ط ر": "البحر الأحمر",
        "ج هـ": "مطروح",
        "ج ب": "الوادي الجديد",
        "ص ا": "قنا",
        "ص ق": "الأقصر",
        "ص و": "أسوان",
    }

    tokens = arabic_plate_text.split()
    if len(tokens) < 3:
        return "صيغة غير معروفة"

    letters = []
    numbers = []

    for token in tokens:
        if token in "٠١٢٣٤٥٦٧٨٩":
            numbers.append(token)
        else:
            letters.append(token)

    # Detect Cairo and Giza by structure
    if len(letters) == 3 and len(numbers) == 3:
        return "القاهرة"
    elif len(letters) == 2 and len(numbers) == 4:
        return "الجيزة"

    # Detect based on specific letter pattern
    if len(letters) == 2:
        key = f"{letters[0]} {letters[1]}"
    elif len(letters) == 1:
        key = letters[0]
    else:
        key = letters[0]  # fallback

    return gov_patterns.get(key, "محافظة غير معروفة")


# Main pipeline
def license_plate_detection_pipeline(image, yolo_model, plate_model, ocr_model):
    # image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Could not read the image")
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Detect plates
    plates = plate_model(image_rgb)[0]
    results_per_plate = []

    for idx, plate in enumerate(plates.boxes.data.tolist()):
        x1, y1, x2, y2, score, class_id = plate
        plate_cropped = image_rgb[int(y1):int(y2), int(x1):int(x2)]

        # Show cropped plate
        plt.figure(figsize=(3, 2))
        plt.imshow(plate_cropped)
        plt.axis("off")

        # OCR on cropped plate
        result = ocr_model.predict(source=plate_cropped, conf=0.25)[0]
        sorted_boxes = sorted(result.boxes, key=lambda b: b.xyxy[0][0].item())

        detected_numbers = []
        detected_letters = []

        for box in sorted_boxes:
            class_id = int(box.cls)
            label = result.names[class_id]
            if label.isdigit():
                detected_numbers.append(label)
            else:
                detected_letters.append(label)

        # Convert and classify
        arabic_text = map_to_arabic(detected_numbers, detected_letters)
        governorate = classify_governorate(arabic_text)

        print(f"\nPlate #{idx + 1}")
        print(f"License plate in Arabic: {arabic_text}")
        print(f"Governorate: {governorate}")
        plate_cropped=cv2.cvtColor(plate_cropped,cv2.COLOR_RGB2BGR)

        # results_per_plate.append((plate_cropped, arabic_text, governorate))
        results_per_plate.append(arabic_text)

    # plt.show()
    return results_per_plate

# Run pipeline
if __name__ == '__main__':
    try:
        results = license_plate_detection_pipeline(
            yolo_model,
            plate_model,
            ocr_model
        )

        for i, (crop, text, gov) in enumerate(results, 1):
            print(f"\nPlate #{i}:")
            print(f"Arabic Text: {text}")
            print(f"Governorate: {gov}")
            cv2.imwrite(f'plate_{i}.jpg', cv2.cvtColor(crop, cv2.COLOR_RGB2BGR))

    except Exception as e:
        print(f"An error occurred: {str(e)}")
