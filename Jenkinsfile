pipeline {
  agent any

  environment {
    AWS_REGION  = 'ap-northeast-2'
    ACCOUNT_ID  = '273354621375'
    ECR_URI     = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    APP_NAME    = 'spring-app'
    BLUE_IP     = '172.31.55.206'    // Blue EC2 프라이빗 IP
    GREEN_IP    = '172.26.11.74'     // Green EC2 프라이빗 IP
    LB_IP       = '172.31.35.103'    // Nginx 로드밸런서 EC2 프라이빗 IP
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
          // 브랜치에 따라 blue/green 구분
          def color = (env.BRANCH_NAME == 'develop-be') ? 'green' : 'blue'
          env.TAG = "${env.BUILD_NUMBER}-${color}"
          echo "📦 Building for branch=${env.BRANCH_NAME}, TAG=${env.TAG}"
        }
      }
    }

    stage('Build JAR') {
      steps {
        dir('backend') {
          sh './gradlew clean bootJar'
        }
      }
    }

    stage('Build & Push Image') {
      steps {
        sh """
          aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin $ECR_URI

          docker buildx build \
            --platform linux/amd64,linux/arm64 \
            --provenance=false \
            -t $ECR_URI/$APP_NAME:\$TAG \
            --push backend/.
        """
      }
    }

    stage('Deploy to Target') {
      steps {
        script {
          // 배포 대상 서버/자격증명/Compose 파일 결정
          def isGreen   = (env.BRANCH_NAME == 'develop-be')
          def targetIP  = isGreen ? env.GREEN_IP : env.BLUE_IP
          def sshCred   = isGreen ? 'green-ssh' : 'blue-ec2-ssh'
          def user      = isGreen ? 'ubuntu' : 'ec2-user'
          def composeFile = isGreen
            ? '/opt/green/docker-compose.green.yml'
            : '/opt/blue/docker-compose.blue.yml'

          sshagent([sshCred]) {
            sh """
              ssh -o StrictHostKeyChecking=no $user@$targetIP << 'EOS'
                export AWS_REGION=$AWS_REGION
                export ECR_URI=$ECR_URI
                aws ecr get-login-password --region \$AWS_REGION | \
                  docker login --username AWS --password-stdin \$ECR_URI

                sed -i "s@image:.*@image: \$ECR_URI/$APP_NAME:\$TAG@" $composeFile
                docker pull \$ECR_URI/$APP_NAME:\$TAG
                docker compose -f $composeFile up -d
              EOS
            """
          }
        }
      }
    }

    stage('Switch Traffic') {
      steps {
        when {
          anyOf {
            branch 'develop-be'
            branch 'main'
          }
        }
        script {
          // develop-be → Green, main → Blue
          def from = (env.BRANCH_NAME == 'develop-be') ? env.BLUE_IP  : env.GREEN_IP
          def to   = (env.BRANCH_NAME == 'develop-be') ? env.GREEN_IP : env.BLUE_IP

          sshagent(['lb-ssh']) {
            sh """
              ssh -o StrictHostKeyChecking=no ec2-user@$LB_IP << 'EOS'
                sudo sed -i 's/$from/$to/' /etc/nginx/conf.d/loadbalancer.conf
                sudo nginx -s reload
              EOS
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ ${env.BRANCH_NAME} 배포 완료! (TAG=${env.TAG})"
    }
    failure {
      echo "❌ ${env.BRANCH_NAME} 배포 실패 – 콘솔 로그 확인"
    }
  }
}
