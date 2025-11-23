import React, { useEffect, useState } from 'react'
import ProgressBar from '../../components/progressbar'
import { useNavigate, useParams } from 'react-router-dom'
import { GET_PERCENTAGES } from '../../constants'

const Questions = () => {
    const navigate = useNavigate()
    const [percentageData , setPercentageData] = useState([])
    const {userId} = useParams()


    const getQuestionairesPercentage = async() => {
    try{
      setPercentageData([
        {
          completionPercentage: 50,
        },
        {
          completionPercentage: 70,
        },
        {
          completionPercentage: 20,
        },
        {
          completionPercentage: 90,
        },
      ])
    }catch(error){
      console.log(error)
    }
    }
  
    useEffect(()=>{
      getQuestionairesPercentage()
    },[])

  return (
    <div>
      <div className='w-[85%] md:w-[70%] m-auto mt-14'>
        <h2 className='heading_main_dashboard'>Personalized Style Profile</h2>
        <p className='text-xs text-center mt-4'>Take your time with each set of questions to uncover the themes that shape your story and guide your artist matches.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-20 items-center mt-16">
          <div>
            <p className='text-xs text-center mb-2'>
              <ProgressBar value={percentageData[0]?.completionPercentage || 0} />
            </p>
            <button onClick={() => navigate(`/your-travel-reflections/${userId}`)} className='btn_black_big hover:bg-[#2946BF]'>Your Travel Reflections</button>
          </div>
          <div>
            <p className='text-xs text-center mb-2'>
              <ProgressBar value={percentageData[1]?.completionPercentage || 0} />
            </p>
            <button onClick={() => navigate(`/your-design-inspirations/${userId}`)} className='btn_black_big hover:bg-[#2946BF]'>Your Design Inspirations</button>
          </div>
          <div>
            <p className='text-xs text-center mb-2'>
              <ProgressBar value={percentageData[2]?.completionPercentage || 0} />
            </p>
            <button onClick={() => navigate(`/moments-that-inspire-you/${userId}`)} className='btn_black_big hover:bg-[#2946BF]'>Moments That Inspire You</button>
          </div>
          <div>
            <p className='text-xs text-center mb-2'>
              <ProgressBar value={percentageData[3]?.completionPercentage || 0} />
            </p>
            <button onClick={() => navigate(`/owning-your-distinctive-style/${userId}`)} className='btn_black_big hover:bg-[#2946BF]'>Owning Your Distinctive Style</button>
          </div>
        </div>

        <div className='text-xs text-center mt-24'>
          Finish your responses to all sections to bring your Personalized Style Profile and <br /> Artist Portfolio Matches to life
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-20 items-center mt-8 mb-10">
          <div>
            <button className='btn_black_big_white' onClick={() => navigate('/artist-matched')}>Artist Matched</button>
          </div>
          <div>
            <button className='btn_black_big_white' onClick={() => navigate('/artist-who-get-my-vibe')}>Artists who match my vibe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Questions
