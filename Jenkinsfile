pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', changelog: false, poll: false, url: 'https://github.com/akarsh/selenium-webdriver-cucumber-js-example-project.git'
            }
        }
        stage('Build') {
            steps {
                sh '''
                docker build -t selenium-webdriver-cucumber-js-example-project-install --target install . 
                '''
                sh'''
                docker run --rm -v ${PWD}:/usr/src/app/ --name selenium-webdriver-cucumber-js-example-project-install selenium-webdriver-cucumber-js-example-project-install
                '''
            }
        }
        stage('Run test') {
            steps {
                sh'''
                docker network create grid
                '''
                sh'''
                docker run -d -p 4444:4444 -p 6900:5900 --net grid --name selenium --shm-size="2g" standalone-chrome:4.9.1-20230508
                '''
                sh'''
                docker run -d --net grid --name video -v ${PWD}/videos:/videos selenium/video:ffmpeg-4.3.1-20230421
                '''
                sh'''
                docker build -t selenium-webdriver-cucumber-js-example-project-test --target test . 
                '''
                sh'''
                docker run --rm -v ${PWD}:/usr/src/app/ --net grid --name selenium-webdriver-cucumber-js-example-project-test selenium-webdriver-cucumber-js-example-project-test
                '''
                sh'''
                docker stop video && docker rm video
                '''
                sh'''
                docker stop selenium && docker rm selenium
                '''
                sh'''
                docker network rm grid
                '''
            }
        }
    }
    post {
      always {
          cucumber buildStatus: 'null', customCssFiles: '', customJsFiles: '', failedFeaturesNumber: -1, failedScenariosNumber: -1, failedStepsNumber: -1, fileIncludePattern: '**/cucumber-report.json', pendingStepsNumber: -1, skippedStepsNumber: -1, sortingMethod: 'ALPHABETICAL', undefinedStepsNumber: -1
      }
    }
}
