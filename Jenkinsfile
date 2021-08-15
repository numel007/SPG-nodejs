pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        nodejs('node latest') {
          echo 'Installed Node!'
          sh 'npm install'
          echo 'Finished installing dependencies'
          sh 'npm test'
        }

      }
    }
  }
}