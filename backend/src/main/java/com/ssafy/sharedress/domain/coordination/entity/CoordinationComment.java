package com.ssafy.sharedress.domain.coordination.entity;

import java.time.LocalDateTime;

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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coordination_comment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoordinationComment extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String content;

	private LocalDateTime deletedAt;

	private Integer depth;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private CoordinationComment parent;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "coordination_id")
	private Coordination coordination;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	public CoordinationComment(String content, int depth, CoordinationComment parent,
		Coordination coordination, Member member) {
		this.content = content;
		this.depth = depth;
		this.parent = parent;
		this.coordination = coordination;
		this.member = member;
	}

}
