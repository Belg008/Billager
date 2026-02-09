# Enkel Dockerfile for Coolify hosting
FROM python:3.9-alpine

# Sett arbeidsmappe
WORKDIR /app

# Kopier alle filer
COPY index.html .
COPY style.css .
COPY app.js .

# Expose port 3003
EXPOSE 3003

# Start HTTP server på port 3003
CMD ["python", "-m", "http.server", "3003"]
