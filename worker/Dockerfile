FROM ubuntu:20.04
RUN apt-get update -y
RUN apt-get install curl vim sudo -y

RUN apt-get install build-essential -y
RUN g++ --version
RUN gcc --version

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash
RUN apt-get install nodejs -y
RUN node -v
RUN npm -v

WORKDIR /app
COPY . .
RUN mkdir /temp

RUN chmod 700  /temp
RUN chmod 755 -R /temp
RUN adduser --disabled-password --gecos "" judge
RUN npm install

RUN ps aux | wc -l > /process_count.log

CMD npm run dev 
