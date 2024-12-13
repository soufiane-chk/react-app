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
                echo 'Cloning repository...'
                git branch: 'master', url: 'https://github.com/devopsanass/devops.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
        }

        stage('Run SonarQube Analysis') {
            steps {
                echo 'Running SonarQube analysis...'
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
                echo 'Building project...'
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo 'Deploying to EC2...'
                sshagent(['ssh-key-jenkins']) {
                    sh '''
                    scp -i ${SSH_KEY_PATH} -r dist/ ${EC2_USER}@${EC2_IP}:/var/www/html/
                    '''
                }
            }
        }

        stage('Restart Nginx on EC2') {
            steps {
                echo 'Restarting Nginx on EC2...'
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
