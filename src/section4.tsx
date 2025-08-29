import './section4.css'

const Section4 = () => {
    return (
        <>
            <section id='section4'>
                <div id='section4Head'>
                    <img src="/section4Img/Rectangle.png" alt="블록머리" />
                    <img src="/section4Img/Rectangle.png" alt="블록머리" />
                    <img src="/section4Img/Rectangle.png" alt="블록머리" />
                </div>
                <div id="section4Main">
                    <div className="section4Up">
                        <div className="col col-left">
                            <img src="/section4Img/lego1.png" alt="레고 세트 1" />
                            <img src="/section4Img/lego2.png" alt="레고 세트 2" />
                        </div>

                        <div className="col col-center">
                            <p className="eyebrow">연령별 레고</p>
                            <h2>나이에 딱 맞는 LEGO</h2>
                            <p>
                                나이에 따라 달라지는 관심과 호기심, 레고는 그 모든 순간에 함께합니다.<br />
                                즐겁게 놀고, 배우고, 성장하는 완벽한 선택
                            </p>
                        </div>

                        <div className="col col-right">
                            <img src="/section4Img/lego3.png" alt="레고 세트 3" />
                            <img src="/section4Img/lego4.png" alt="레고 세트 4" />
                        </div>
                    </div>

                    <div className='section4Meddle'>
                        <ul className='greenBox'>
                        </ul>
                        <ul className='blueBox'></ul>
                        <ul className='redBox'></ul>
                        <ul className='yellowBox'></ul>
                    </div>
                    <div className='section4Down'>
                        <div className='section4LeftDown'>
                            <img src="/section4Img/lego5.png" alt="레고 세트 5" />
                            <img src="/section4Img/lego6.png" alt="레고 세트 6" />
                            <img src="/section4Img/lego7.png" alt="레고 세트 7" />
                            <img src="/section4Img/lego8.png" alt="레고 세트 8" />
                        </div>
                        <div className='section4RightDown'>
                            <img src="/section4Img/lego9.png" alt="레고 세트 9" />
                            <img src="/section4Img/lego10.png" alt="레고 세트 10" />
                            <img src="/section4Img/lego11.png" alt="레고 세트 11" />
                            <img src="/section4Img/lego12.png" alt="레고 세트 12" />
                            <img src="/section4Img/lego13.png" alt="레고 세트 13" />
                            <img src="/section4Img/lego14.png" alt="레고 세트 14" />
                            <img src="/section4Img/lego15.png" alt="레고 세트 15" />

                        </div>
                    </div>
                </div>


            </section >
        </>
    )
}

export default Section4