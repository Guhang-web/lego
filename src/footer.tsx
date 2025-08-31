import './footer.css'

const Footer = () => {
    return (
        <>
            <footer id='footer'>
                <div id='footerUp'>
                    <img className='footerLogo' src="/logo/lego-logo 1.png" alt="레고 로고" />
                    <ul>
                        <li><img src="/logo/youtube.png" alt="유투브" /></li>
                        <li><img src="/logo/instagram.png" alt="인스타그램" />
                        </li>
                        <li><img src="/logo/facebook.png" alt="페이스북" /></li>
                    </ul>
                </div>
                <div id='footerDown'>
                    <ul>
                        <li><a href="#">회사소개</a></li>
                        <li>레고 그룹 소개</li>
                        <li>레고 뉴스</li>
                        <li>레고 제품 인증</li>
                        <li>지속 가능한 사업</li>
                    </ul>
                    <ul>
                        <li><a href="#">주소</a></li>
                        <li>조립셜명서 찾기</li>
                        <li>부품누락</li>
                        <li>배송 및 반품</li>
                        <li>이용약관</li>
                    </ul>
                    <ul>
                        <li><a href="#">명소</a></li>
                        <li>레고하우스</li>
                        <li>레고랜드파크</li>
                        <li>레고랜드 디스커버리 센터</li>
                    </ul>
                    <ul>
                        <li><a href="#">기타 정보</a></li>
                        <li>LEGO Magazine</li>
                        <li>레고 에듀케이션</li>
                        <li>레고 아이디어</li>
                        <li>레고 파운데이션</li>
                    </ul>
                </div>
                <div id='footerEnd'>
                    <p>레고코리아(주) 대표이사 : CLAUS KRISTENSEN (크라우스크리스텐션), 정희영 | 주소 : 서울특별시 강남구 강남대로 382, 메리츠타워 12층 우편번호 06232 사업자등록번호 : 126-81-25525
                    <br/>통신판매업신고 제 2010-서울강남-00549호 사업자등록확인고객센터 무료전화 : 080-880-0166 | 업무시간 : 월요일-금요일 오전9시 ~ 오후6시</p>
                </div>
            </footer>
        </>
    )
}

export default Footer