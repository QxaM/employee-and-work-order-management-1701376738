FROM --platform=linux/amd64 gradle:8.10-jdk21
WORKDIR /workspace/discovery-service

COPY build ./build

EXPOSE 8761

ENTRYPOINT ["sh", "-c", "java -jar build/libs/discovery-service-*[!plain].jar"]