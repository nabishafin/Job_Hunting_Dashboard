import React from 'react';

const ProgressBar = ({ value }) => {
  return (
    <div
      className="flex h-3 bg-gray-200 rounded-full overflow-hidden dark:[#ccc] m-auto w-[80%] "
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#2946BF] text-[8px] text-white text-center whitespace-nowrap dark:[#2946BF] transition duration-500"
        style={{ width: `${value}%` }}
      >
        {value}%
      </div>
    </div>
  );
};

export default ProgressBar;
