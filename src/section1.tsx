import bg from './assets/section1/image108.png'
import './section1.css'

export default function Section1() {
    return (
        <section
            id="section1"
            style={{ backgroundImage: `url(${bg})` }}>
            <header id='header'>
                <ul className='legoLogo'><img src="./public/logo/lego-logo 1.png" alt="lego logo" /></ul>
                <div id='headerNav'>
                <ul className='meun1'>
                    <a href="#">제품구매</a>
                    <li>시리즈별 세트</li>
                    <li>연령별</li>
                    <li>가격별</li>
                    <li>특별한 날을 위한 세트</li>
                    <li>레고&reg; 상품</li>
                    <li>레고&reg; 데코</li>
                    <li>관심분야</li>
                    <li>독점 제품</li>
                    <li>신제품</li>
                    <li>베스트셀러</li>
                    <li>할인 및 행사</li>
                    <li>출시 예정</li>
                    <li>단종 예정</li>
                    <li>브릭 액세서리 & 키트</li>
                </ul>
                <ul className='meun1'>
                    <a href="#">브랜드소개</a>
                    <li>기업 가치</li>
                    <li>레고 앱</li>
                    <li>레고 매거진</li>
                    <li>블프 라이브쇼핑</li>
                    <li>레고 전 제품</li>
                    <li>레고 전체 관심사별</li>
                    <li>특별한 아이디어</li>
                    <li>어른이 환영</li>
                    <li>가족 놀이</li>
                    <li>레고&reg; 포트나이트&reg;</li>
                    <li>레고&reg; Insiders</li>
                    <li>레고&reg; MOSAIC MAKER </li>
                    <li>레고&reg; 선물 아이디어</li>
                </ul>
                <ul className='meun1'>
                    <a href="#">고객지원</a>
                    <li>주문 현황 확인</li>
                    <li>배송 및 반품</li>
                    <li>스토어 검색</li>
                    <li>조립설명서 검색</li>
                    <li>일반적인 질문</li>
                    <li>문의하기</li>
                    <li>부속품 브릭</li>
                </ul>
                <ul className='icon'>
                    <li><img src="./public/section1Img/heart.png" alt="하트 아이콘" /></li>
                    <li><img src="./public/section1Img/shoppingBag.png" alt="쇼핑 아이콘" /></li>
                </ul>
                </div>
            </header>
            <div id='section1Meddle'>
                <h1>상상 속 세상을<span className='line'></span>현실로 </h1>
                <p>상상으로만 그리던 세상, 이제는 눈앞에 펼쳐집니다.</p>
                <p>레고는 상상의 한계를 넘어서 당신만의 세계를 현실로 만들어줍니다.</p>
            </div>
        </section>
    )
}
