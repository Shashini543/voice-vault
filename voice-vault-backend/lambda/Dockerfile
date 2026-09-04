# Build context is the voice-vault-backend/ directory:
#   docker build -f lambda/Dockerfile -t voice-vault-document-processor .
#
# Tesseract is not available via dnf on Amazon Linux 2023 (Lambda's Python 3.13
# base) and EPEL doesn't exist for AL2023, so it's compiled from source here
# rather than relying on an unofficial repo trick. This keeps the build fully
# self-contained and reproducible, and needs nothing installed on the host
# machine beyond Docker itself.

FROM public.ecr.aws/lambda/python:3.13 AS builder

RUN dnf install -y \
        gcc gcc-c++ make automake libtool pkgconfig \
        wget tar gzip \
        zlib-devel libpng-devel libjpeg-turbo-devel libtiff-devel libwebp-devel \
    && dnf clean all

WORKDIR /build

# --- leptonica (tesseract's image-processing dependency) ---
RUN wget -q https://github.com/DanBloomberg/leptonica/releases/download/1.85.0/leptonica-1.85.0.tar.gz \
    && tar xzf leptonica-1.85.0.tar.gz \
    && cd leptonica-1.85.0 \
    && ./configure --prefix=/opt/tesseract \
    && make -j"$(nproc)" \
    && make install

# --- tesseract itself ---
RUN wget -q -O tesseract-5.5.3.tar.gz https://github.com/tesseract-ocr/tesseract/archive/refs/tags/5.5.3.tar.gz \
    && tar xzf tesseract-5.5.3.tar.gz \
    && cd tesseract-5.5.3 \
    && PKG_CONFIG_PATH=/opt/tesseract/lib/pkgconfig ./autogen.sh \
    && PKG_CONFIG_PATH=/opt/tesseract/lib/pkgconfig \
       LDFLAGS="-L/opt/tesseract/lib" CPPFLAGS="-I/opt/tesseract/include" \
       ./configure --prefix=/opt/tesseract \
    && make -j"$(nproc)" \
    && make install

# --- trained language data (fast/integer LSTM models) ---
RUN mkdir -p /opt/tesseract/share/tessdata \
    && wget -q -O /opt/tesseract/share/tessdata/eng.traineddata \
        https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata \
    && wget -q -O /opt/tesseract/share/tessdata/osd.traineddata \
        https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/osd.traineddata


FROM public.ecr.aws/lambda/python:3.13

COPY --from=builder /opt/tesseract /opt/tesseract

ENV PATH="/opt/tesseract/bin:${PATH}"
ENV LD_LIBRARY_PATH="/opt/tesseract/lib:${LD_LIBRARY_PATH}"
ENV TESSDATA_PREFIX="/opt/tesseract/share/tessdata"

COPY lambda/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

COPY app ${LAMBDA_TASK_ROOT}/app

CMD ["app.lambda_handler.handler"]
