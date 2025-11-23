import React from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaStar} from 'react-icons/fa'; 
import { Tooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom'
import RightArrow from './../../assets/images/right_arrow.svg';
import LeftArrow from './../../assets/images/left_arrow.svg';
import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ArtistMatched = () => {
    const navigate = useNavigate()
    const matchesprofile = [
        {
            id : 1,
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            id : 2,
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 4
        },
        {
            id : 3,
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 2
        },
        {
            id : 4,
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            id : 5,
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            id : 6,
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            id : 7,
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            id : 8,
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        }
      ]
  return (
    <div>
        <div className='w-full m-auto mt-14'>
        <h2 className='heading_main_dashboard mb-20'>My Artist Portfolio Matches</h2>
        
        {/* <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            >
            {
                matchesprofile?.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className='flex justify-left flex-col custom_card_profile_matches'>
                            <h1 className='font-bold text-[32px] leading-[34px] mb-3'>
                                Emmanuel Gottlieb Luetz
                            </h1>

                            <div className='text-[13px] text-[#5F5F5F]'>United States</div>
                            <div className='text-[13px] text-[#505050] mt-2 mb-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...</div>

                            <button className='btn_black text-sm'>Explore Their Work</button>

                            <div className='flex justify-center items-center mt-4 gap-3 mb-2'>
                                <FaStar size={20} />  <FaStar size={20} />  <FaStar size={20} />  <FaStar size={20} />  <FaStar size={20} />
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            }
        </Swiper> */}


<div className='relative'>
    <div className='arrow_placement'>
        <div className="swiper-button-prev-custom">
            <img src={LeftArrow} />
        </div>
        <div className="swiper-button-next-custom">
            <img src={RightArrow} />
        </div>
    </div>

    <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={30} // Default space between slides
        // slidesPerView={3} // Default number of slides per view for large screens
        navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
        }}
        pagination={{
            clickable: true,
            el: '.custom-pagination-container',
        }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
        breakpoints={{
            // For mobile devices (width <= 640px)
            640: {
                slidesPerView: 1,  // 1 slide per view on mobile
                spaceBetween: 20,   // Space between slides for mobile
            },
            // For tablets (width <= 1024px)
            1024: {
                slidesPerView: 2,  // 2 slides per view on tablet
                spaceBetween: 30,   // Adjust space between slides for tablet
            },
            // For large screens (default, width > 1024px)
            1025: {
                slidesPerView: 3,  // 3 slides per view on larger screens
                spaceBetween: 30,   // Default space between slides for desktop
            },
        }}
    >
        {matchesprofile?.map((item, index) => (
            <SwiperSlide key={index}>
                <div className='flex justify-left flex-col custom_card_profile_matches'>
                    <h1 className='font-bold text-[32px] leading-[34px] mb-3'>
                        Emmanuel Gottlieb Luetz
                    </h1>

                    <div className='text-[13px] text-[#5F5F5F]'>United States</div>
                    <div className='text-[13px] text-[#505050] mt-2 mb-6'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...
                    </div>

                    <button className='btn_black text-sm'>Explore Their Work</button>
                    
                    <div className='flex justify-center items-center mt-4 gap-3 mb-2'>
                        
                        <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="bottom-end" data-tooltip-content="Not for me" />
                        <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="bottom-end" data-tooltip-content="Some glimpses of connection" />
                        <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="bottom-end" data-tooltip-content="I can see the appeal" />
                        <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="bottom-end" data-tooltip-content="This feels right" />
                        <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="bottom-end" data-tooltip-content="This artist feels like a kindred spirit" />
                        
                        <Tooltip id={`my-tooltip`}  className="custom-tooltip" style={{ backgroundColor: "#D7BCFD", color: "#222" }}/>
                    </div>
                </div>
            </SwiperSlide>
        ))}
    </Swiper>
</div>

        

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-20 items-center mt-8 mb-10">
          <div>
            <button className='btn_big_white' onClick={() => navigate('/your-travel-reflections')}>Edit my responses</button>
          </div>
          <div className="custom-pagination-container"></div>
          <div>
            <button className='btn_black_big' onClick={() => navigate('/artist-who-get-my-vibe')}>View Artists Who Get My Vibe</button>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default ArtistMatched
