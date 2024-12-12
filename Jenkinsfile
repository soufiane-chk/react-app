pipeline {
    agent any

    environment {
        SONARQUBE_SERVER = 'http://localhost:9000'
        SONARQUBE_TOKEN = 'sqp_d204145f061718055e5c36db128c56be00d43f10'  // Replace with your actual token
        SSH_KEY_PATH = 'C:/Users/areopago/Desktop/ssh-key-jenkins.pem'  // Ensure this path is correct
        EC2_USER = 'ubuntu'
        EC2_IP = '18.188.137.85'
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Cloning the repository from GitHub
                git branch: 'master', url: 'https://github.com/devopsanass/devops.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Installing the required dependencies for the project
                sh 'npm ci'
            }
        }

        stage('Run Unit Tests') {
            steps {
                // Running the unit tests
                sh 'npm test'
            }
        }

        stage('Run SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    // Running the SonarQube analysis
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
                // Building the React project using Vite
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2') {
            steps {
                // Using ssh-agent to deploy the built project to the EC2 instance
                sshagent(['ssh-key-jenkins']) {
                    sh '''
                    scp -i ${SSH_KEY_PATH} -r dist/ ${EC2_USER}@${EC2_IP}:/var/www/html/
                    '''
                }
            }
        }

        stage('Restart Nginx on EC2') {
            steps {
                // Restarting Nginx on the EC2 instance to serve the newly deployed application
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
