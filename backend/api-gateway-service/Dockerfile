FROM --platform=linux/amd64 gradle:9.3.1-jdk25
WORKDIR /workspace/api-gateway-service

COPY build ./build

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar build/libs/api-gateway-service-*[!plain].jar"]
