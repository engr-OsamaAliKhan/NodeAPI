pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-node-app"
        CONTAINER_NAME = "my-running-node-app"
        APP_PORT = "4000"
    }

    stages {
        
        stage('Read Version') {
            steps {
                script {
                    VERSION = sh(script: "cat version.txt", returnStdout: true).trim()
                    echo "Application Version: ${VERSION}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${VERSION} ."
                }
            }
        }

        stage('Check & Remove Existing Container') {
            steps {
                script {
                    def containerExists = sh(script: "docker ps -a --format '{{.Names}}' | grep -w ${CONTAINER_NAME} || true", returnStdout: true).trim()
                    if (containerExists) {
                        echo "Container ${CONTAINER_NAME} is running. Stopping and removing..."
                        sh "docker stop ${CONTAINER_NAME}"
                        sh "docker rm ${CONTAINER_NAME}"
                    } else {
                        echo "No existing container found. Proceeding with deployment."
                    }
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    sh "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}:${VERSION}"
                }
            }
        }
    }

    post {
        success {
            echo "Application successfully deployed in a Docker container with version ${VERSION}!"
        }
        failure {
            echo "Deployment failed. Check the logs."
        }
    }
}
