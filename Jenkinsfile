pipeline {
    agent any

    environment {
        SONARQUBE_SERVER = 'http://localhost:9000'
        SONARQUBE_TOKEN = 'sqp_d204145f061718055e5c36db128c56be00d43f10'
        SSH_KEY_PATH = 'C:/Users/areopago/Desktop/ssh-key-jenkins.pem'
        EC2_USER = 'ubuntu'
        EC2_IP = '18.188.137.85'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo "Cloning the repository"
                }
                git branch: 'master', url: 'https://github.com/devopsanass/devops.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing dependencies"
                }
                sh 'npm ci' // Ensure this command is executed
            }
        }

        stage('Run Unit Tests') {
            steps {
                script {
                    echo "Running Unit Tests"
                }
                sh 'npm test' // Ensure tests are running
            }
        }

        stage('Run SonarQube Analysis') {
            steps {
                script {
                    echo "Running SonarQube Analysis"
                }
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    sonar-scanner \
                        -Dsonar.projectKey=devops \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=${SONARQUBE_SERVER} \
                        -Dsonar.login=${SONARQUBE_TOKEN}
                    '''
                }
            }
        }

        stage('Build Project') {
            steps {
                script {
                    echo "Building the project"
                }
                sh 'npm run build' // Ensure the build is happening
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    echo "Deploying to EC2"
                }
                sshagent(['ssh-key-jenkins']) {
                    sh '''
                    scp -i ${SSH_KEY_PATH} -r dist/ ${EC2_USER}@${EC2_IP}:/var/www/html/
                    '''
                }
            }
        }

        stage('Restart Nginx on EC2') {
            steps {
                script {
                    echo "Restarting Nginx on EC2"
                }
                sshagent(['ssh-key-jenkins']) {
                    sh '''
                    ssh -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP} << EOF
                    sudo systemctl restart nginx
                    EOF
                    '''
                }
            }
        }
    }
}
