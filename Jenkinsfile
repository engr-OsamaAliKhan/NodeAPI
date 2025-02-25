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
                    VERSION = new File('version.txt').text.trim()
                    echo "Application Version: ${VERSION}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker build -t ${IMAGE_NAME}:${VERSION} ."
                    } else {
                        bat "docker build -t ${IMAGE_NAME}:${VERSION} ."
                    }
                }
            }
        }

        stage('Check & Remove Existing Container') {
            steps {
                script {
                    def containerExists = ""
                    
                    if (isUnix()) {
                        containerExists = sh(script: "docker ps -a --format '{{.Names}}' | grep -w ${CONTAINER_NAME} || true", returnStdout: true).trim()
                    } else {
                        containerExists = bat(script: "docker ps -a --format \"{{.Names}}\" | findstr /R /C:\"${CONTAINER_NAME}\"", returnStdout: true).trim()
                    }

                    if (containerExists) {
                        echo "Container ${CONTAINER_NAME} is running. Stopping and removing..."
                        if (isUnix()) {
                            sh "docker stop ${CONTAINER_NAME}"
                            sh "docker rm ${CONTAINER_NAME}"
                        } else {
                            bat "docker stop ${CONTAINER_NAME}"
                            bat "docker rm ${CONTAINER_NAME}"
                        }
                    } else {
                        echo "No existing container found. Proceeding with deployment."
                    }
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}:${VERSION}"
                    } else {
                        bat "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}:${VERSION}"
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
            echo "Deployment failed. Check the logs."
        }
    }
}
