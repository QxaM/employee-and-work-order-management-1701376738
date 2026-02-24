FROM --platform=linux/amd64 gradle:9.3.1-jdk25
WORKDIR /workspace/task-service

COPY build ./build

EXPOSE 8082

ENTRYPOINT ["sh", "-c", "java -jar build/libs/task-service-*[!plain].jar"]
