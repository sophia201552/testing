FROM python:3.4.7-jessie

WORKDIR /project

COPY ./requirements /requirements
COPY ./requirements/additional/sources.list /etc/apt/sources.list

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        bzip2 \
        libfontconfig \
    && cat /requirements/additional/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -xj --strip-components=1 -C /usr/local/bin \
    && apt-get clean \
    && pip install -r /requirements/requirements.txt --index http://pypi.doubanio.com/simple --trusted-host pypi.doubanio.com \
    && rm -rf /requirements /var/lib/apt/lists/*

VOLUME /project

EXPOSE 80