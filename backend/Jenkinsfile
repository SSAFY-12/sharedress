pipeline {
  agent any
  environment {
    AWS_REGION  = 'ap-northeast-2'
    ACCOUNT_ID  = '273354621375'
    ECR_URI     = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    APP_NAME    = 'spring-app'
    BUILD_TAG   = "${env.BUILD_NUMBER}-green"
    GREEN_IP    = '172.26.11.74'  // Green EC2 IP 주소
    LB_IP       = '172.31.35.103'  // Nginx 로드밸런서 IP 주소
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build JAR') {
      steps {
        dir('backend') {
          sh './gradlew clean bootJar'
        }
      }
    }

    stage('Buildx Push') {
      steps {
        sh '''
          aws ecr get-login-password --region $AWS_REGION |
            docker login --username AWS --password-stdin $ECR_URI

          docker buildx build \
            --platform linux/amd64,linux/arm64 \
            --provenance=false \
            -t $ECR_URI/$APP_NAME:$BUILD_TAG \
            --push backend/.
        '''
      }
    }

    stage('Deploy to Green') {
      steps {
        sshagent(['green-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no ubuntu@$GREEN_IP <<'EOS'
              export AWS_REGION='$AWS_REGION'
              export ECR_URI='$ECR_URI'
              aws ecr get-login-password --region \$AWS_REGION | \
                docker login --username AWS --password-stdin \$ECR_URI

              sed -i "s@image:.*@image: \$ECR_URI/$APP_NAME:$BUILD_TAG@" /opt/green/docker-compose.green.yml
              docker pull \$ECR_URI/$APP_NAME:$BUILD_TAG
              docker compose -f /opt/green/docker-compose.green.yml up -d
            EOS
          """
        }
      }
    }

    stage('Switch Traffic → Green') {
      steps {
        sshagent(['lb-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no ec2-user@$LB_IP <<'EOS'
              sudo sed -i 's/10\\.0\\.1\\.100/10.0.1.101/' /etc/nginx/conf.d/loadbalancer.conf
              sudo nginx -s reload
            EOS
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ develop-be 배포 완료 (Green)"
    }
    failure {
      echo "❌ 실패 – 콘솔 로그 확인"
    }
  }
}
