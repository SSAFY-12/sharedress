pipeline {
  agent any

  environment {
    AWS_REGION  = 'ap-northeast-2'
    ACCOUNT_ID  = '273354621375'
    ECR_URI     = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    APP_NAME    = 'spring-app'

    BLUE_IP     = '172.31.55.206'    // Blue EC2 (Amazon Linux)
    // 더 이상 GREEN_IP, GREEN_DISABLED, Switch Traffic 불필요
    LB_IP       = '172.31.35.103'    // (필요시) LB EC2
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Variables') {
      steps {
        script {
          // 항상 blue 태그
          env.TAG = "${env.BUILD_NUMBER}-blue"
          echo "📦 Branch=${env.BRANCH_NAME}, DeployColor=blue, TAG=${env.TAG}"
        }
      }
    }

    stage('Build JAR') {
      steps {
        dir('backend') {
          sh '''
            chmod +x gradlew
            ./gradlew clean bootJar
          '''
        }
      }
    }

    stage('Setup Buildx') {
      steps {
        sh '''
          docker buildx create --name multi-builder --driver docker-container --use || true
          docker buildx inspect multi-builder --bootstrap
        '''
      }
    }

    stage('Build & Push Image') {
      steps {
        dir('backend') {
          withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'aws key'
          ]]) {
            sh """
              aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin $ECR_URI

              docker buildx build \
                --platform linux/amd64,linux/arm64 \
                --provenance=false \
                -t $ECR_URI/$APP_NAME:\$TAG \
                --push .
            """
          }
        }
      }
    }

    stage('Deploy to Blue') {
      steps {
        sshagent(['blue-ec2-ssh']) {
          sh """
            # ECR 로그인 + 이미지 Pull
            aws ecr get-login-password --region ${AWS_REGION} | \
              docker login --username AWS --password-stdin ${ECR_URI}
            docker pull ${ECR_URI}/${APP_NAME}:${TAG}

            # Blue EC2 에서 재기동
            ssh -o StrictHostKeyChecking=no ec2-user@${BLUE_IP} << 'EOF'
              docker compose -f /opt/blue/docker-compose.blue.yml up -d
            EOF
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅  Blue 배포 완료 (TAG=${env.TAG})"
    }
    failure {
      echo "❌  배포 실패 – 콘솔 로그 확인"
    }
  }
}