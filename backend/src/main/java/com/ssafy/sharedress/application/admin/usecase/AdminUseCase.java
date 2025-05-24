package com.ssafy.sharedress.application.admin.usecase;

public interface AdminUseCase {
	void runDemoPurchaseScanFlow(Long memberId);

	void deleteAllClosetClothes(Long memberId);
}
