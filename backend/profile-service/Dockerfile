FROM --platform=linux/amd64 gradle:8.10-jdk21
WORKDIR /workspace/profile-service

COPY build ./build

EXPOSE 8082

ENTRYPOINT ["sh", "-c", "java -jar build/libs/profile-service-*[!plain].jar"]