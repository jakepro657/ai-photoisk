import React from "react";

function TermsPage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          서비스 약관 및 정책
        </h1>

        {/* 이용약관 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2 mb-4">
            서비스 이용 약관 (Terms of Service)
          </h2>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제1조 (목적)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              본 약관은 Photoisk (이하 &quot;회사&quot;라 합니다)이 제공하는
              Photoisk 서비스(이하 &quot;서비스&quot;라 합니다)의 이용 조건 및
              절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제2조 (용어의 정의)
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1">
              <li>
                &quot;서비스&quot;란 회사가 제공하는 Photoisk 및 관련 제반
                서비스를 의미합니다.
              </li>
              <li>
                &quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를
                이용하는 자를 의미합니다.
              </li>
              <li>
                &quot;회원&quot;이란 회사와 서비스 이용 계약을 체결하고 회원
                아이디(ID)를 부여받은 자를 의미합니다.
              </li>
            </ul>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제3조 (약관의 효력 및 변경)
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1">
              <li>
                본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이
                발생합니다.
              </li>
              <li>
                회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며,
                변경된 약관은 공지사항을 통해 공지함으로써 효력을 발생합니다.
              </li>
            </ul>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제4조 (서비스의 제공 및 변경)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              회사는 이용자에게 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-2">
              <li>AI 사진 촬영 및 편집 서비스</li>
              <li>사진 저장 및 관리 기능</li>
              <li>기타 관련 부가 서비스</li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              회사는 서비스의 내용, 기술적 사양 등을 변경할 수 있으며, 변경
              시에는 공지사항을 통해 공지합니다.
            </p>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제5조 (서비스의 중단)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              회사는 다음 각 호에 해당하는 경우 서비스 제공을 일시적으로 중단할
              수 있습니다:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-2">
              <li>설비 점검, 보수 또는 공사로 인한 경우</li>
              <li>
                전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를
                중지했을 경우
              </li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              회사는 상기 사유로 서비스 제공이 일시적으로 중단됨으로 인하여
              이용자 또는 제3자가 입은 손해에 대해 배상하지 아니합니다.
            </p>
          </article>
        </section>

        {/* 개인정보 처리방침 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2 mb-4">
            개인정보 처리 방침 (Privacy Notice)
          </h2>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제1조 (개인정보의 수집 항목 및 수집 방법)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수
              있습니다:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-2">
              <li>필수 항목: 이름, 이메일 주소</li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-2 mb-2">
              회사는 다음과 같은 방법으로 개인정보를 수집합니다:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-2">
              <li>서비스 이용 과정에서 이용자가 직접 제공하는 정보</li>
              <li>로그 분석, 쿠키를 통한 수집</li>
            </ul>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제2조 (개인정보의 수집 및 이용 목적)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              회사는 수집한 개인정보를 다음의 목적을 위해 이용합니다:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-2">
              <li>서비스 제공 및 운영</li>
              <li>이용자 문의 처리</li>
              <li>마케팅 및 광고에 활용</li>
            </ul>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제3조 (개인정보의 보유 및 이용 기간)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를
              지체 없이 파기합니다. 단, 관련 법령에 따라 보존할 필요가 있는
              경우에는 일정 기간 동안 보유합니다.
            </p>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제4조 (개인정보의 제3자 제공)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                법령에 의거하거나, 수사 목적으로 법령에 따른 수사기관의 요구가
                있는 경우
              </li>
            </ul>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제5조 (개인정보의 파기 절차 및 방법)
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1">
              <li>
                회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가
                불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
              </li>
              <li>
                전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을
                사용하여 삭제합니다.
              </li>
            </ul>
          </article>
        </section>

        {/* 환불정책 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2 mb-4">
            환불 정책 (Refund Policy)
          </h2>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제1조 (환불의 신청)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              이용자는 다음의 경우 환불을 신청할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-2">
              <li>서비스 결제 후 7일 이내에 청약 철회를 하는 경우</li>
              <li>제공된 서비스가 표시/광고 내용과 다른 경우</li>
            </ul>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제2조 (환불의 절차)
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1">
              <li>
                이용자가 환불을 신청하고자 하는 경우, 고객센터를 통해 환불
                신청을 해야 합니다.
              </li>
              <li>
                회사는 환불 신청이 접수되면, 접수일로부터 7영업일 이내에 환불
                여부를 결정하고 이용자에게 통지합니다.
              </li>
            </ul>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제3조 (환불의 방법)
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1">
              <li>
                회사는 환불 승인 후 7영업일 이내에 이용자가 지정한 계좌로 환불
                금액을 입금합니다.
              </li>
              <li>
                결제 수단에 따라 환불 처리 시간이 다를 수 있으며, 회사는 이에
                대해 사전 고지합니다.
              </li>
            </ul>
          </article>

          <article className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              제4조 (환불의 예외)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              다음 각 호의 경우에는 환불이 제한될 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-2">
              <li>
                이용자의 책임 있는 사유로 서비스가 손상되거나 멸실된 경우
              </li>
              <li>환불 신청 시점이 결제일로부터 30일이 경과한 경우</li>
            </ul>
          </article>
        </section>

        <div className="border-t border-gray-200 pt-4 pb-8">
          <p className="text-sm text-gray-500">
            문의사항은{" "}
            <a
              href="mailto:jakebu657@gmail.com"
              className="text-indigo-600 underline"
            >
              jakebu657@gmail.com
            </a>
            으로 연락하시길 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
