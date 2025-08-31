import './section5.css'

const Section5 = () => {
    return (
        <>
            <section id='section5'>
                <div id='section5Up'>
                    <ul className='section5UpLeft'>
                        <li><img src="/section5Img/section5Lego2.png" alt="섹션5 레고이미지 1" /></li>
                    </ul>
                    <ul className='section5UpRight'>
                        <li className='s5UpRightP1'><p>레고 작품</p></li>
                        <li><h2>함께 만드는 LEGO 세상</h2></li>
                        <li className='s5UpRightP2'><p>누구나 창작자가 되고, 나만의 세계를 표현할 수 있는 공간,
                            <br />이곳은 함께 만드는 레고 유니버스입니다.</p></li>
                    </ul>
                </div>

                <div id='section5Down'>
                    <ul className='section5DownLeft'>
                        <li className='section5Lego3'><img src="/section5Img/section5Lego3.png" alt="섹션5 레고이미지 3" /></li>
                        <li className='section5Lego5'><img src="/section5Img/section5Lego5.png" alt="섹션5 레고이미지 5" /></li>
                        <li className='section5Lego8'><img src="/section5Img/section5Lego8.png" alt="섹션5 레고이미지 8" /></li>
                    </ul>
                    <ul className='section5DownRight'>
                        <li className='section5Lego4'><img src="/section5Img/section5Lego4.png" alt="섹션5 레고이미지 4" /></li>
                        <li className='section5Lego6'><img src="/section5Img/section5Lego6.png" alt="섹션5 레고이미지 6" /></li>
                        <li className='section5Lego7'><img src="/section5Img/section5Lego7.png" alt="섹션5 레고이미지 7" /></li>
                        <li className='section5Box8'>
                            <p>당신의 창작물이
                                <br/>레고의 이야기를
                                <br/>이어갑니다.
                            </p>
                            <p>내 작품 공유하기</p>
                            </li>
                        <li className='section5Lego1'><img src="/section5Img/section5Lego1.png" alt="섹션5 레고이미지 1" /></li>
                    </ul>

                </div>

            </section>

        </>
    )
}

export default Section5