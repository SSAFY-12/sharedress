package com.ssafy.sharedress.domain.ai.entity;

import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.shoppingmall.entity.ShoppingMall;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ai_task")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AiTask {

	@Id
	private String id;

	private boolean isCompleted;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shop_id", nullable = false)
	private ShoppingMall shoppingMall;

	@Column(nullable = false)
	@Convert(converter = TaskTypeConverter.class)
	private TaskType type;

	public AiTask(String id, boolean isCompleted, Member member, ShoppingMall shoppingMall, TaskType type) {
		this.id = id;
		this.isCompleted = isCompleted;
		this.member = member;
		this.type = type;
		this.shoppingMall = shoppingMall;
	}

	public void updateCompleted() {
		this.isCompleted = true;
	}
}
