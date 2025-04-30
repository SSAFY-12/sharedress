package com.ssafy.sharedress.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients(basePackages = "com.ssafy.sharedress.adapter.auth.out")
public class OpenfeignConfig {

}
