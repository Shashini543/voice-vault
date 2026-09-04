import io

import pymupdf
import pytesseract
from PIL import Image

# Below this many non-whitespace characters across the whole PDF, treat it as
# scanned/image-only and fall back to OCR instead of trusting the (near-empty)
# native text layer.
MIN_NATIVE_TEXT_CHARS = 50

# Render scanned pages at a higher DPI than the PDF default (72) so Tesseract
# has enough resolution to read the text accurately.
OCR_ZOOM = 2.0


def extract_text(content: bytes, content_type: str) -> str:
    if content_type == "application/pdf":
        return _extract_pdf(content)
    if content_type in ("image/png", "image/jpeg"):
        return _ocr_image(Image.open(io.BytesIO(content)))
    if content_type == "text/plain":
        return content.decode("utf-8", errors="replace")
    raise ValueError(f"Unsupported content type for extraction: {content_type}")


def _extract_pdf(content: bytes) -> str:
    doc = pymupdf.open(stream=content, filetype="pdf")
    try:
        native_text = "\n\n".join(page.get_text() for page in doc)
        if len(native_text.strip()) >= MIN_NATIVE_TEXT_CHARS:
            return native_text

        # Likely a scanned/image-only PDF: rasterize each page and OCR it.
        matrix = pymupdf.Matrix(OCR_ZOOM, OCR_ZOOM)
        page_texts = []
        for page in doc:
            pixmap = page.get_pixmap(matrix=matrix)
            image = Image.open(io.BytesIO(pixmap.tobytes("png")))
            page_texts.append(_ocr_image(image))
        return "\n\n".join(page_texts)
    finally:
        doc.close()


def _ocr_image(image: Image.Image) -> str:
    return pytesseract.image_to_string(image)
