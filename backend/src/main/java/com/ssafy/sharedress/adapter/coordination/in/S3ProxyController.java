package com.ssafy.sharedress.adapter.coordination.in;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sharedress.application.coordination.dto.ImageProxyResponse;
import com.ssafy.sharedress.global.response.ResponseWrapper;
import com.ssafy.sharedress.global.response.ResponseWrapperFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class S3ProxyController {

	@GetMapping("/html2canvas/proxy")
	@CrossOrigin("*")
	public ResponseEntity<ResponseWrapper<ImageProxyResponse>> proxyS3Image(@RequestParam String url) {
		try {
			URL decodedUrl = new URL(URLDecoder.decode(url, StandardCharsets.UTF_8));
			HttpURLConnection connection = (HttpURLConnection)decodedUrl.openConnection();
			connection.setRequestMethod("GET");
			connection.setConnectTimeout(5000);
			connection.setReadTimeout(10000);

			int responseCode = connection.getResponseCode();
			if (responseCode != 200) {
				return ResponseWrapperFactory.toResponseEntity(HttpStatus.BAD_GATEWAY, null);
			}

			String contentType = connection.getContentType();
			if (contentType == null || !contentType.startsWith("image/")) {
				return ResponseWrapperFactory.toResponseEntity(HttpStatus.FORBIDDEN, null);
			}

			InputStream inputStream = connection.getInputStream();
			byte[] imageBytes = IOUtils.toByteArray(inputStream);
			String base64Encoded = Base64.getEncoder().encodeToString(imageBytes);

			ImageProxyResponse response = new ImageProxyResponse(base64Encoded, contentType);
			return ResponseWrapperFactory.toResponseEntity(HttpStatus.OK, response);

		} catch (MalformedURLException e) {
			return ResponseWrapperFactory.toResponseEntity(HttpStatus.BAD_REQUEST, null);
		} catch (IOException e) {
			return ResponseWrapperFactory.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, null);
		} catch (Exception e) {
			return ResponseWrapperFactory.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, null);
		}
	}

}
