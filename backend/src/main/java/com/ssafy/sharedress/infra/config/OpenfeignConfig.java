package com.ssafy.sharedress.infra.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients(basePackages = "com.ssafy.sharedress.api.auth.controller")
public class OpenfeignConfig {

}
