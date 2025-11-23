import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaStar} from 'react-icons/fa'; 
import { Tooltip } from 'react-tooltip'

const VibeMatches = () => {
    const navigate = useNavigate();


    const matchesprofile = [
        {
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 4
        },
        {
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 2
        },
        {
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        },
        {
            title : "Emmanuel Gottlieb Luetz",
            city : "United States",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
            stars : 5
        }
      ]
  return (
    <div>
       <div className='w-full m-auto mt-14'>
        <h2 className='heading_main_dashboard mb-20'>Artists Who Get My Vibe</h2>
        
        {/* <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-20 items-center mt-8 mb-4">
          <div>
            <button className='btn_big_white' onClick={() => navigate('/your-travel-reflections')}>Edit my responses</button>
          </div>
          <div className='md:block hidden'> </div>
          <div className='md:block hidden'> </div>
          <div>
            <button className='btn_black_big' onClick={() => navigate('/artist-portfolio-matches')}>View My Artist Portfolio Matches</button>
          </div>
        </div> */}
        <div className='relative grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8'>
            {matchesprofile?.map((item, index) => (
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
                           <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="top" data-tooltip-content="Not for me" />
                            <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="top" data-tooltip-content="Some glimpses of connection" />
                            <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="top" data-tooltip-content="I can see the appeal" />
                            <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="top" data-tooltip-content="This feels right" />
                            <FaStar size={20} data-tooltip-id={`my-tooltip`} data-tooltip-place="top" data-tooltip-content="This artist feels like a kindred spirit" />
                            
                            <Tooltip id={`my-tooltip`}  className="custom-tooltip" style={{ backgroundColor: "#D7BCFD", color: "#222" }}/>
                        </div>
                        <div className='text-[11px] text-[#505050] mt-4 text-center'>
                        Lorem impsum text feedback comments from user about the artist’s portfolio. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. . Ut enim ad minim veniam, quis nostrud.. Ut enim ad minim veniam, quis nostrud.
                        </div>
                    </div>
            ))}
           
        </div>
        

       
      </div>
    </div>
  )
}

export default VibeMatches
