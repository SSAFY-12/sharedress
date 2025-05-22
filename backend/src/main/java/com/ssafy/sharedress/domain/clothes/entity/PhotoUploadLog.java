package com.ssafy.sharedress.domain.clothes.entity;

import com.ssafy.sharedress.domain.common.entity.BaseTimeEntity;
import com.ssafy.sharedress.domain.member.entity.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "photo_upload_log")
@Getter
@NoArgsConstructor
public class PhotoUploadLog extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	public PhotoUploadLog(Member member) {
		this.member = member;
	}
}
