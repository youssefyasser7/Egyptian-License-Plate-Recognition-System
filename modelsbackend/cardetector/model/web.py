import streamlit as st
from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np
import os
from datetime import datetime
import io
import tempfile
import main  


st.set_page_config(
    page_title="Egyptian License Plate Recognition",
    page_icon="🚗",
    layout="wide",
    initial_sidebar_state="collapsed"
)

LANGUAGES = {
    "English": {
        "title": "Egyptian License Plate Recognition",
        "upload_header": "Upload or Capture Image",
        "upload_option1": "Upload from device",
        "upload_option2": "Use camera",
        "process_btn": "Process Image",
        "results_header": "Detection Results",
        "plate_text": "License Plate Text",
        "governorate": "Governorate",
        "download_btn": "Download Results as PDF",
        "camera_instructions": "Position the license plate clearly in frame",
        "error_message": "An error occurred",
        "no_plates_message": "No license plates detected",
        "invalid_file": "Invalid file type. Please upload an image.",
        "processing": "Processing image..."
    },
    "العربية": {
        "title": "نظام التعرف على لوحات السيارات المصرية",
        "upload_header": "رفع صورة أو التقاطها",
        "upload_option1": "رفع صورة من الجهاز",
        "upload_option2": "استخدام الكاميرا",
        "process_btn": "معالجة الصورة",
        "results_header": "نتائج التحليل",
        "plate_text": "نص لوحة السيارة",
        "governorate": "المحافظة",
        "download_btn": "تحميل النتائج كـ PDF",
        "camera_instructions": "قم بتوجيه الكاميرا نحو لوحة السيارة بوضوح",
        "error_message": "حدث خطأ",
        "no_plates_message": "لم يتم اكتشاف لوحات سيارات",
        "invalid_file": "نوع الملف غير صالح. يرجى رفع صورة.",
        "processing": "جاري معالجة الصورة..."
    }
}


st.markdown(f"""
<style>
    .stApp {{
        background-image: url("https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/9b/29/db/this-is-the-nile-valley.jpg?w=1200&h=-1&s=1");
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
    }}
    .main .block-container {{
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 2rem;
        margin-bottom: 2rem;
    }}
    .stButton>button {{
        background-color: #4CAF50;
        color: white;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: bold;
        border: none;
        transition: all 0.3s;
    }}
    .stButton>button:hover {{
        background-color: #45a049;
        transform: scale(1.05);
    }}
    .result-box {{
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin: 1rem 0;
    }}
    .info-box {{
        flex: 1;
        background-color: transparent;
        border: 1px solid #4CAF50;
        border-radius: 10px;
        padding: 0.75rem;
        font-size: 1.5rem;
        backdrop-filter: blur(2px);
    }}
    .info-title {{
        font-weight: bold;
        margin-bottom: 0.25rem;
        color: #1b5e20;
    }}
    .centered-image-wrapper {{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1.3rem 0;
    }}
    @font-face {{
        font-family: 'Tajawal';
        src: url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
    }}
    .rtl-text {{
        font-family: 'Tajawal', sans-serif;
        direction: rtl;
        text-align: right;
    }}
    .stRadio > div {{
        flex-direction: row;
        align-items: center;
    }}
    .stRadio label {{
        margin: 0 10px;
    }}
</style>
""", unsafe_allow_html=True)


lang = st.radio(
    "اللغة / Language",
    options=list(LANGUAGES.keys()),
    horizontal=True,
    index=1
)

st.markdown(f"<h1 style='text-align: center; color: #2E86C1;'>{LANGUAGES[lang]['title']}</h1>", unsafe_allow_html=True)

st.header(LANGUAGES[lang]["upload_header"])
upload_option = st.radio(
    LANGUAGES[lang]["upload_header"],
    options=[LANGUAGES[lang]["upload_option1"], LANGUAGES[lang]["upload_option2"]],
    label_visibility="collapsed"
)

uploaded_file = None
if upload_option == LANGUAGES[lang]["upload_option1"]:
    uploaded_file = st.file_uploader(
        LANGUAGES[lang]["upload_option1"],
        type=["jpg", "jpeg", "png"],
        label_visibility="collapsed"
    )
else:
    uploaded_file = st.camera_input(
        LANGUAGES[lang]["camera_instructions"],
        label_visibility="collapsed"
    )

if uploaded_file is not None:
    if not uploaded_file.type.startswith('image/'):
        st.error(LANGUAGES[lang]["invalid_file"])
    elif st.button(LANGUAGES[lang]["process_btn"]):
        with st.spinner(LANGUAGES[lang]["processing"]):
            try:
                image = Image.open(uploaded_file)
                img_array = np.array(image)

                if not isinstance(img_array, np.ndarray):
                    raise ValueError("Invalid image format")

                with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                    temp_image_path = tmp.name
                    image.save(temp_image_path, format="JPEG")

                results = main.license_plate_detection_pipeline(
                    temp_image_path,
                    main.yolo_model,
                    main.plate_model,
                    main.ocr_model
                )

                st.subheader(LANGUAGES[lang]["results_header"])
                st.markdown('<div class="centered-image-wrapper">', unsafe_allow_html=True)
                st.image(image, caption=LANGUAGES[lang]["upload_header"], width=300)
                st.markdown('</div>', unsafe_allow_html=True)

                if results:
                    for idx, (cropped_img, plate_text, governorate) in enumerate(results, 1):
                        if not isinstance(cropped_img, np.ndarray):
                            cropped_img = np.array(cropped_img)

                        cropped_pil = Image.fromarray(cv2.cvtColor(cropped_img, cv2.COLOR_RGB2BGR))

                        col1, col2 = st.columns([1, 3])
                        with col1:
                            st.image(cropped_pil, caption=f"Plate {idx}", width=220)
                        with col2:
                            st.markdown(f"""
                            <div class="result-box">
                                <div class="info-box">
                                    <div class="info-title">{LANGUAGES[lang]['plate_text']}</div>
                                    <p class="{'rtl-text' if lang == 'العربية' else ''}">{plate_text}</p>
                                </div>
                                <div class="info-box">
                                    <div class="info-title">{LANGUAGES[lang]['governorate']}</div>
                                    <p class="{'rtl-text' if lang == 'العربية' else ''}">{governorate}</p>
                                </div>
                            </div>
                            """, unsafe_allow_html=True)

                        img_buf = io.BytesIO()
                        cropped_pil.save(img_buf, format="JPEG")
                        st.download_button(
                            label=LANGUAGES[lang]["download_btn"],
                            data=img_buf.getvalue(),
                            file_name=f"plate_result_{idx}.jpg",
                            mime="image/jpeg"
                        )
                else:
                    st.warning(LANGUAGES[lang]["no_plates_message"])
            except Exception as e:
                st.error(f"{LANGUAGES[lang]['error_message']}: {str(e)}")
