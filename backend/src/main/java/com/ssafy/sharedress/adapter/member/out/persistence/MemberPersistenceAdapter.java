package com.ssafy.sharedress.adapter.member.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.sharedress.application.member.dto.MemberSearchResponse;
import com.ssafy.sharedress.domain.friend.entity.QFriend;
import com.ssafy.sharedress.domain.friend.entity.QFriendRequest;
import com.ssafy.sharedress.domain.member.entity.Member;
import com.ssafy.sharedress.domain.member.entity.QMember;
import com.ssafy.sharedress.domain.member.repository.MemberRepository;
import com.ssafy.sharedress.global.dto.CursorPageResult;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MemberPersistenceAdapter implements MemberRepository {

	private final JPAQueryFactory queryFactory;
	private final MemberJpaRepository memberJpaRepository;

	@Override
	public Optional<Member> findById(Long id) {
		return memberJpaRepository.findById(id);
	}

	@Override
	public Optional<Member> findByEmail(String email) {
		return memberJpaRepository.findByEmail(email);
	}

	@Override
	public Boolean existsByNicknameAndCode(String nickname, String code) {
		return memberJpaRepository.existsByNicknameAndCode(nickname, code);
	}

	@Override
	public Member save(Member member) {
		return memberJpaRepository.save(member);
	}

	@Override
	public Member getReferenceById(Long id) {
		return memberJpaRepository.getReferenceById(id);
	}

	@Override
	public CursorPageResult<MemberSearchResponse> searchMembersWithCursor(
		Long myId,
		String keyword,
		Long cursorId,
		int size
	) {
		QMember mem = QMember.member;
		QFriend fr = QFriend.friend;
		QFriendRequest fr1 = new QFriendRequest("fr1");
		QFriendRequest fr2 = new QFriendRequest("fr2");

		// 1개 더 조회해서 hasNext 판단
		List<MemberSearchResponse> fetched = queryFactory
			.select(Projections.constructor(MemberSearchResponse.class,
				mem.id,
				mem.profileUrl,
				mem.nickname,
				mem.code,
				new CaseBuilder()
					.when(fr.id.isNotNull()).then(0)
					.when(fr1.id.isNotNull()).then(1)
					.when(fr2.id.isNotNull()).then(2)
					.otherwise(3)
			))
			.from(mem)
			.leftJoin(fr)
			.on(
				(fr.memberA.id.eq(myId).and(fr.memberB.id.eq(mem.id)))
					.or(fr.memberB.id.eq(myId).and(fr.memberA.id.eq(mem.id)))
			)
			.leftJoin(fr1).on(fr1.requester.id.eq(myId).and(fr1.receiver.id.eq(mem.id)))
			.leftJoin(fr2).on(fr2.requester.id.eq(mem.id).and(fr2.receiver.id.eq(myId)))
			.where(
				mem.nickname.containsIgnoreCase(keyword),
				mem.id.ne(myId),
				mem.id.gt(0L),
				cursorId != null ? mem.id.lt(cursorId) : null
			)
			.orderBy(mem.id.desc()) // 최신순
			.limit(size + 1) // 1개 더 가져와서 다음 페이지 여부 판단
			.fetch();

		boolean hasNext = fetched.size() > size;
		List<MemberSearchResponse> contents = hasNext ? fetched.subList(0, size) : fetched;

		Long nextCursor = hasNext ? contents.get(contents.size() - 1).memberId() : null;

		return new CursorPageResult<>(contents, hasNext, nextCursor);
	}

	@Override
	public Optional<Member> findByFcmToken(String fcmToken) {
		return memberJpaRepository.findByFcmToken(fcmToken);
	}

}
