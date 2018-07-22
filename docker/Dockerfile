FROM mongo


RUN apt update
RUN apt install unzip

RUN apt-get purge --auto-remove -y ca-certificates curl
RUN rm -rf /var/lib/apt/lists/*
