FROM --platform=linux/amd64 gradle:8.10-jdk21
WORKDIR /workspace/authorization-service

COPY build ./build

EXPOSE 8081
#ENTRYPOINT ["ls", "-R"]
ENTRYPOINT ["sh", "-c", "java -jar build/libs/authorization-service-*[!plain].jar"]