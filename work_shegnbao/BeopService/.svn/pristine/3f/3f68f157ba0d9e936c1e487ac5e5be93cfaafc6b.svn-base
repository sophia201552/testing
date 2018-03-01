FROM python:3.4.7-jessie

WORKDIR /project

COPY ./requirements /requirements
COPY ./requirements/additional/sources.list /etc/apt/sources.list

RUN pip install -r /requirements/requirements.txt --index http://pypi.doubanio.com/simple --trusted-host pypi.doubanio.com \
    && rm -rf /requirements /var/lib/apt/lists/*

VOLUME /project

EXPOSE 80