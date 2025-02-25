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
                    try {
                        def versionFile = readFile('version.txt').trim()
                        env.VERSION = versionFile
                        echo "Application Version: ${env.VERSION}"
                    } catch (Exception e) {
                        error "Error reading version.txt: ${e.message}"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        sh """
                            echo "Building Docker Image: ${IMAGE_NAME}:${VERSION}"
                            docker build -t ${IMAGE_NAME}:${VERSION} . | tee docker_build.log
                        """
                        echo "Docker image built successfully: ${IMAGE_NAME}:${VERSION}"
                    } catch (Exception e) {
                        error "Docker build failed: ${e.message}"
                    }
                }
            }
        }

        stage('Check & Remove Existing Container') {
            steps {
                script {
                    try {
                        def containerExists = sh(
                            script: "docker ps -a --format '{{.Names}}' | grep -w ${CONTAINER_NAME} || true",
                            returnStdout: true
                        ).trim()
                        
                        if (containerExists) {
                            echo "Stopping and removing existing container: ${CONTAINER_NAME}"
                            sh "docker stop ${CONTAINER_NAME} || true"
                            sh "docker rm ${CONTAINER_NAME} || true"
                        } else {
                            echo "No existing container found."
                        }
                    } catch (Exception e) {
                        error "Failed to check/remove container: ${e.message}"
                    }
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    try {
                        sh """
                            echo "Starting container: ${CONTAINER_NAME} with version ${VERSION}"
                            docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}:${VERSION} | tee container_run.log
                        """
                        echo "Container ${CONTAINER_NAME} is running successfully on port ${APP_PORT}."
                    } catch (Exception e) {
                        error "Failed to start the container: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Application successfully deployed in a Docker container with version ${VERSION}!"
        }
        failure {
            echo "Deployment failed. Check logs for details."
        }
    }
}
