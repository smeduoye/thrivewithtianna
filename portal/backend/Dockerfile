# syntax=docker/dockerfile:1
# Build JAR on host: cd portal/backend && mvn -B package -DskipTests

FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

RUN useradd --system --uid 1001 appuser
USER appuser

COPY target/backend-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
