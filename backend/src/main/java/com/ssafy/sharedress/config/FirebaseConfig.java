package com.ssafy.sharedress.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class FirebaseConfig {
	@Value("${firebase.type}")
	private String type;

	@Value("${firebase.project_id}")
	private String projectId;

	@Value("${firebase.private_key_id}")
	private String privateKeyId;

	@Value("${firebase.private_key}")
	private String privateKey;

	@Value("${firebase.client_email}")
	private String clientEmail;

	@Value("${firebase.client_id}")
	private String clientId;

	@Value("${firebase.auth_uri}")
	private String authUri;

	@Value("${firebase.token_uri}")
	private String tokenUri;

	@Value("${firebase.auth_provider_x509_cert_url}")
	private String authProviderCertUrl;

	@Value("${firebase.client_x509_cert_url}")
	private String clientCertUrl;

	@Value("${firebase.universe_domain}")
	private String universeDomain;

	@PostConstruct
	public void initialize() throws IOException {
		if (FirebaseApp.getApps().isEmpty()) {
			ByteArrayInputStream serviceAccount = new ByteArrayInputStream(getFirebaseJson());

			FirebaseOptions options = FirebaseOptions.builder()
				.setCredentials(GoogleCredentials.fromStream(serviceAccount))
				.setProjectId(projectId)
				.setServiceAccountId(clientEmail) // optional but helps clarity
				.build();

			FirebaseApp.initializeApp(options);
			log.info("FirebaseApp 초기화 완료");
		}
	}

	private byte[] getFirebaseJson() {
		String json = String.format(
			"{" + "\"type\": \"%s\"," + "\"project_id\": \"%s\"," + "\"private_key_id\": \"%s\","
				+ "\"private_key\": \"%s\"," + "\"client_email\": \"%s\"," + "\"client_id\": \"%s\","
				+ "\"auth_uri\": \"%s\"," + "\"token_uri\": \"%s\"," + "\"auth_provider_x509_cert_url\": \"%s\","
				+ "\"client_x509_cert_url\": \"%s\"," + "\"universe_domain\": \"%s\"" + "}",
			type, projectId, privateKeyId, privateKey.replace("\n", "\\n"),
			clientEmail, clientId, authUri, tokenUri,
			authProviderCertUrl, clientCertUrl, universeDomain
		);
		return json.getBytes();
	}
}
