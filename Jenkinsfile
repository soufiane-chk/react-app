pipeline {
    agent any  // This defines the agent for the whole pipeline (can be overridden in stages)

    environment {
        SONARQUBE_SERVER = 'http://localhost:9000'
        SONARQUBE_TOKEN = 'sqp_d204145f061718055e5c36db128c56be00d43f10'
        SSH_KEY_PATH = 'C:/Users/areopago/Desktop/ssh-key-jenkins.pem'
        EC2_USER = 'ubuntu'
        EC2_IP = '18.188.137.85'
    }

    stages {
        stage('Clone Repository') {
            agent any  // You can specify a different agent for this stage if needed
            steps {
                git branch: 'master', url: 'https://github.com/devopsanass/devops.git'
            }
        }

        stage('Install Dependencies') {
            agent any  // Specifying agent for this stage
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Unit Tests') {
            agent any  // Specifying agent for this stage
            steps {
                sh 'npm test'
            }
        }

        stage('Run SonarQube Analysis') {
            agent any  // Specifying agent for this stage
            steps {
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
            agent any  // Specifying agent for this stage
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2') {
            agent any  // Specifying agent for this stage
            steps {
                sshagent(['ssh-key-jenkins']) {
                    sh '''
                    scp -i ${SSH_KEY_PATH} -r dist/ ${EC2_USER}@${EC2_IP}:/var/www/html/
                    '''
                }
            }
        }

        stage('Restart Nginx on EC2') {
            agent any  // Specifying agent for this stage
            steps {
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
