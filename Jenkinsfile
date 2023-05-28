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
                docker rm -f $(docker ps -a -q)
                '''
                sh'''
                docker network rm grid
                '''
                sh'''
                docker network create grid
                '''
                sh'''
                docker run -d -p 4442-4444:4442-4444 --net grid --name seleniarm-hub seleniarm/hub:latest
                '''
                sh'''
                docker run -d --name seleniarm-node-docker --net grid -e SE_EVENT_BUS_HOST=selenium-hub -e SE_EVENT_BUS_PUBLISH_PORT=4442 -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 -v ${PWD}/config.toml:/opt/bin/config.toml -v ${PWD}/assets:/opt/selenium/assets -v /var/run/docker.sock:/var/run/docker.sock seleniarm/node-docker:latest
                '''
                sh'''
                docker build -t selenium-webdriver-cucumber-js-example-project-test --target test . 
                '''
                sh'''
                docker run --rm -v ${PWD}:/usr/src/app/ --net grid --name selenium-webdriver-cucumber-js-example-project-test selenium-webdriver-cucumber-js-example-project-test
                '''
                sh'''
                docker stop seleniarm-hub && docker rm seleniarm-hub
                '''
                sh'''
                docker stop seleniarm-node-docker && docker rm seleniarm-node-docker
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
