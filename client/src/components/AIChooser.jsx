import React from 'react'

import CustomButton from './CustomButton'

const AIChooser = ({ prompt, setPrompt, generatingImg, handleSubmit}) => {
  return (
    <div className ="aipicker-container" >
      <textarea
        placeholder="Generate an image with AI"
        rows={5}
        value= {prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className = "aipicker-textarea"
      />
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <CustomButton
          type= "outline"
          title= "Generating.."
          customStyles="text-xs"

          />
        ) : (
          <>
          <CustomButton
          type= "outline"
          title= "Logo Only"
          handleClick={() => handleSubmit('logo')}
          customStyles="text-xs"
          />
           <CustomButton
          type= "filled"
          title= "Full Shirt"
          handleClick={() => handleSubmit('full')}
          customStyles="text-xs"
          />
          </>
        )
      
      
      
      }
      </div>

    </div>
  )
}

export default AIChooser