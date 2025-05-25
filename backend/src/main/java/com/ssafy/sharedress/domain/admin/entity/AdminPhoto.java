package com.ssafy.sharedress.domain.admin.entity;

import com.ssafy.sharedress.domain.closet.entity.ClosetClothes;
import com.ssafy.sharedress.domain.member.entity.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin_photo")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminPhoto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	private String taskId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "closet_clothes_id")
	private ClosetClothes closetClothes;

	public AdminPhoto(Member member, String taskId, ClosetClothes closetClothes) {
		this.member = member;
		this.taskId = taskId;
		this.closetClothes = closetClothes;
	}

	public void updateTaskId(String taskId) {
		this.taskId = taskId;
	}
}
