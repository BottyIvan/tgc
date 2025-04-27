FROM python:alpine

# Set the working directory to /tcg_app
WORKDIR /tcg_app

# Copy the current directory contents into the container at /tcg_app
COPY . .

# Install the required packages
RUN pip3 install --no-cache-dir -r requirements.txt