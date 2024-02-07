import React, {useState, useEffect}  from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import {download} from '../assets';
import {downloadCanvasToImage, reader} from '../config/helpers'; 
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIChooser, CustomButton, ColorChooser, FileChooser, Tab} from '../components';

const Customizer = () => {
    const snap = useSnapshot(state);

    const [file, setFile ] = useState('');

    const [prompt, setPrompt] = useState('');
    const [generatingImg, setgeneratingImg] = useState(false);

    const[activeEditorTab, setActiveEditorTab] = useState("");
    const[activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false,
    })

const toggleTab = (tabName) => {
    
    setActiveEditorTab(currentTab => currentTab === tabName ? "" : tabName);
};


//show the tab content depending on the active tab

const genearateTabContent = () => { 
    switch(activeEditorTab){
        case "colorchooser":
            return <ColorChooser />;
        case "filechooser":
            return <FileChooser
                file={file}
                setFile={setFile}
                readFile={readFile}
            
            
            />;
        case "aichooser":
            return <AIChooser 
                prompt={prompt}
                setPrompt={setPrompt}
                generatingImg={generatingImg}
                handleSubmit={handleSubmit}
            />;
        default:
            return null;
    }
};



const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");

    try{
       setgeneratingImg(true);

       const response = await fetch('https://localhost8080/api/v1/dalle', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({prompt})
        });

        const data = await response.json();

        handleDecals(type, `data:image/png;base64,${data.photo}`)

    } catch (error) {
        alert(error)
    } finally{
        setgeneratingImg(false);
        setActiveEditorTab("");
    }
}


const handleDecals = (type,result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;
    
    if(!activeFilterTab[decalType.filterTab]) {
        handleActiveFilterTab(decalType.filterTab);
    }
}

const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
        case "logoShirt":
            state.isLogoTexture = !activeFilterTab[tabName];
            break;
        case "stylishShirt":
            state.isFullTexture = !activeFilterTab[tabName];
            break;
        default:
            state.isLogoTexture = true;
            state.isFullTexture = false;
            
    }

      
    // setting the state once the activeFilterTab changes/updated 

setActiveFilterTab((prevState) => {
    return{
        ...prevState,
        [tabName]: !prevState[tabName]
    }
})

}


const readFile = (type) =>{
    reader(file).then((result) => {
        handleDecals(type,result);
        setActiveEditorTab(" ");
    })
}



    return (
        <AnimatePresence>
            {!snap.intro && (
            <>
            <motion.div 
                key="custom"
                className="absolute top-0 left-0 z-10" {...slideAnimation('left')}
            >
                <div className="flex items-center min-h-screen">
                    <div className="editortabs-container tabs">
                        {EditorTabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                handleClick={() => toggleTab(tab.name)}
                                
                                
                            />
                        ))}

                        {genearateTabContent()}
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute top-5 right-5 z-10" {...fadeAnimation}
            >
                <CustomButton
                    type="filled"
                    title="Go Back"
                    handleClick={() => state.intro = true}
                    customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                />
            </motion.div>

            <motion.div
                className="filtertabs-container" {...slideAnimation("up")}
            >
            {FilterTabs.map((tab) => (
                <Tab
                    key={tab.name}
                    tab={tab}
                    isFilterTab
                    isActiveTab ={activeFilterTab[tab.name]}
                    handleClick={() => handleActiveFilterTab(tab.name)}
                   
                />
            ))}
            </motion.div>
            </>
            )}
        </AnimatePresence>
    )
}
export default Customizer
