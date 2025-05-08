package com.ssafy.sharedress.domain.coordination.entity;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.sharedress.domain.common.entity.BaseTimeEntity;
import com.ssafy.sharedress.domain.guest.entity.Guest;
import com.ssafy.sharedress.domain.member.entity.Member;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coordination")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Coordination extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	private String content;

	private Boolean isPublic;

	private Boolean isTemplate;

	private String thumbnail;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creator_id")
	private Member creator;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "origin_creator_id")
	private Member originCreator;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id")
	private Member owner;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creator_guest_id")
	private Guest creatorGuest;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "origin_creator_guest_id")
	private Guest originCreatorGuest;

	@OneToMany(mappedBy = "coordination", cascade = CascadeType.ALL)
	private List<CoordinationClothes> coordinationClothes = new ArrayList<>();

	@OneToMany(mappedBy = "coordination", cascade = CascadeType.ALL)
	private List<CoordinationComment> coordinationComments = new ArrayList<>();

	// -- 생성자 -- //
	public Coordination(
		String title,
		String content,
		Boolean isPublic,
		Boolean isTemplate,
		Member creator,
		Member owner,
		Member originCreator
	) {
		this.title = title;
		this.content = content;
		this.isPublic = isPublic;
		this.isTemplate = isTemplate;
		this.creator = creator;
		this.owner = owner;
		this.originCreator = originCreator;
	}

	public Coordination(
		String title,
		String content,
		Boolean isPublic,
		Boolean isTemplate,
		Guest creatorGuest,
		Member owner,
		Guest originCreatorGuest
	) {
		this.title = title;
		this.content = content;
		this.isPublic = isPublic;
		this.isTemplate = isTemplate;
		this.owner = owner;
		this.creatorGuest = creatorGuest;
		this.originCreatorGuest = originCreatorGuest;
	}

	public Coordination(
		String title,
		String content,
		Boolean isPublic,
		Boolean isTemplate,
		String thumbnail,
		Member creator,
		Member originCreator,
		Member owner,
		Guest originCreatorGuest
	) {
		this.title = title;
		this.content = content;
		this.isPublic = isPublic;
		this.isTemplate = isTemplate;
		this.thumbnail = thumbnail;
		this.creator = creator;
		this.originCreator = originCreator;
		this.owner = owner;
		this.originCreatorGuest = originCreatorGuest;
	}

	// -- 생성자 팩토리 메서드 -- //
	public static Coordination createByMember(
		String title,
		String content,
		Boolean isPublic,
		Boolean isTemplate,
		Member creator,
		Member owner,
		Member originCreator
	) {
		return new Coordination(
			title,
			content,
			isPublic,
			isTemplate,
			creator,
			owner,
			originCreator
		);
	}

	public static Coordination createByGuest(
		String title,
		String content,
		Boolean isPublic,
		Boolean isTemplate,
		Guest creatorGuest,
		Member owner,
		Guest originCreatorGuest
	) {
		return new Coordination(
			title,
			content,
			isPublic,
			isTemplate,
			creatorGuest,
			owner,
			originCreatorGuest
		);
	}

	public static Coordination copyCoordination(
		String title,
		String content,
		Boolean isPublic,
		Boolean isTemplate,
		String thumbnail,
		Member creator,
		Member originCreator,
		Member owner,
		Guest originCreatorGuest
	) {
		return new Coordination(
			title,
			content,
			isPublic,
			isTemplate,
			thumbnail,
			creator,
			originCreator,
			owner,
			originCreatorGuest
		);
	}

	// -- 연관관계 편의 메서드 -- //
	public void addCoordinationClothes(CoordinationClothes coordinationClothes) {
		this.coordinationClothes.add(coordinationClothes);
		coordinationClothes.setCoordination(this);
	}

	public void updateThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public void updateIsPublic(Boolean isPublic) {
		this.isPublic = isPublic;
	}
}
