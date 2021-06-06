// Storing piano_keyboard class here, because we have to add buttons inside that <div keyboard>
let keyboard = document.querySelector('.piano_keyboard');

// For creating bar lines
let bar_left = document.querySelector('.piano-bar-left');
let bar_right = document.querySelector('.piano-bar-right');

let controls = document.querySelectorAll('.piano_control_option');

// All 7 Musical Notes stored in array in following sequence.
let pianoNotes = ['C','D','E','F','G','A','B']; 

// For radio Button Keys
let keyboardMap = ['1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N'];
let keys = [];

let playBtn = document.querySelector('.piano_play-btn');
let tempoSelect = document.querySelector('.piano_tempo');
let songSelect = document.querySelector('.piano_song_list');

// Extra Comma means Pause so that it sounds melodious
let jingleBells = `B3,,B3,,B3,,,,B3,,B3,,B3,,,,
                  B3,,D4,,G3,,A3,,B3,,,,,,
                  C4,,C4,,C4,,,,C4,,C4,,B3,,,,
                  B3,,B3,,B3,,A3,,B3,,A3,,,,D4`;

let happyBirthday = `G4,G4,A4,,G4,,C5,,B4,,,,
                    G4,G4,A4,,G4,,D5,,C5,,,,
                    G4,G4,G5,,E5,,C5,,B4,,A4,,,,
                    F5,F5,E5,,C5,,D5,,C5`;

/* let vandeMatram = `C1,D2,,F1,G2,,F1,G2,,,,
                 F1,G2,,B4,,C5,B4,,C5,,,,
                 C1,,D2,,A#4,,A3,,G2,,G2,,A3,,F1,,E3,,D2,,,,
                 D2,,G5,,F4,,F4,,E3,,D2,,E3,,B4,,C1,,,,
                 C1,,D2,,F1,G2,,F1,,G2,,,G2,,D2,,A#4,,,A3,,,G2,,,,
                 F1,,G2,,B4,,B4,,B4,,B4,,C5,,B4,,C5,,B4,,C5,,,,
                 B4,,B4,,B4,,C5,,B4,,C5`; */

let playSong= (notesString , tempo = 2, callBack) => {
    let notes = notesString.split(',');
    let currentNote = 0;
    let mousedown = new Event('mousedown');
    let mouseup = new Event('mouseup'); // to remove background color when key up 
    let btn;

    let interval = setInterval(() => {
        if(currentNote<notes.length){
            if(notes[currentNote].trim() != ''){
                if(btn){
                        btn.dispatchEvent(mouseup);
                        }
                btn = document.querySelector(`[data-letter-note="${notes[currentNote].trim()}"]`);
                btn.dispatchEvent(mousedown);
            }
            currentNote++;
        }
        else
        {
            btn.dispatchEvent(mouseup);  // for Last key highlighting issue.
            clearInterval(interval);
            callBack();
        }
    },100*tempo);   
}

playBtn.addEventListener('mousedown',() => {
    let songNum = +songSelect.value;
    let tempo = +tempoSelect.value;  // + : for converting into number
    playBtn.disabled = true;

    // While music is going on , Play Btn will be disabled.
    let enablePlayBtn = () => playBtn.disabled = false;

    switch(songNum)
    {
        case 1: playSong(jingleBells,tempo,enablePlayBtn); break;
        case 2: playSong(happyBirthday,tempo,enablePlayBtn); break;
        case 3: playSong(vandeMatram,tempo,enablePlayBtn); break;
    }
})

let init = () => {
    var keyNum=0;
    // Generating Black Lines
    for(let k=1; k<=8; k++)
    {
        let line = createLines('left',k);
        bar_left.appendChild(line);

        line = createLines('right',k);
        bar_right.appendChild(line);
    }

    for(let i=1; i<=5;i++) // I am using 5 octaves
    {
        for(let j=0; j<7; j++) // Each octave has 7 notes
        { 
            // Creating white keys.
            keyNum++;
            let key = createKey('white',pianoNotes[j] , i,keyNum);
            key.dataset.keyboard = keyboardMap[j + (i-1)*7];
            keyboard.appendChild(key);

            // Creating black Keys
            if(j != 2 && j != 6){
                key = createKey('black',pianoNotes[j] , i,100);
                key.dataset.keyboard = '⇧+' + keyboardMap[j + (i-1)*7];
                let emptySpace  = document.createElement('div');
                emptySpace.className = 'empty-space';
                emptySpace.appendChild(key);
                keyboard.appendChild(emptySpace);
            }
        }
    }
}

// Generating Piano-Keys by Javascript using this arrow function 
let createKey = (type, note, octave,num) =>
{
    let key = document.createElement('button');
    key.className = type == 'white' ? 'piano_key piano_keys-white' : 'piano_key piano_keys-black';
    if(num!=100){
        key.id = type == 'white' ? 'white'+num : 'black'+num;
    }
    
    // All white keys has 2 characters & Black has 3
    // WHITE => note + octave     ||  BLACK => note + # + octave
    key.dataset.letterNote = type =='white' ? note+octave : note+'#' +octave;

    // But in file name i have used 's' instead of '#', so i will store it also.
    key.dataset.letterNoteFileName = type =='white' ? note+octave : note + 's' +octave;

    key.textContent = key.dataset.letterNote;

    keys.push(key);
    key.addEventListener('mousedown',() => {
        playSound(key);
    // Add this class so that while pressing background color change.
        key.classList.add('piano_key-playing');
    })

    // In case of mouseUp class must be deleted 
    key.addEventListener('mouseup', () =>{
        key.classList.remove('piano_key-playing');
    })

    // In case of mouseLeave also class must be deleted 
      key.addEventListener('mouseleave', () =>{
        key.classList.remove('piano_key-playing');
    })
    return key;
}

// This function will detect which key has been pressed.
document.addEventListener('keydown' , (e) => {
    if(e.repeat){
        return;
    }
    pressKey('mousedown',e);
})

document.addEventListener('keyup' , (e) => {
    pressKey('mouseup' , e);
})

let pressKey = (MouseEvent, e) => {
    let lastLetter = e.code.substring(e.code.length-1);
    isShiftPressed = e.shiftKey;
    let selectedLetter;
    if(isShiftPressed){
        selectedLetter = `[data-keyboard="⇧+${lastLetter}"]`;
    }
    else{
        selectedLetter = `[data-keyboard="${lastLetter}"]`;
    }
    let key = document.querySelector(selectedLetter);
    if(key!== null){
        let event = new Event(MouseEvent);
        key.dispatchEvent(event);
    }
}

// Function to create bar-lines
let createLines = (direction,lineNo) =>
{
    let key = document.createElement('hr');
    key.className = direction =='left' ? 'piano-line-left' : 'piano-line-right';
    key.id = direction =='left' ? 'Line-left'+lineNo : 'Line-right'+lineNo;
    return key;
}

// function to play sound.
let playSound = (key) =>{
    let audio = document.createElement('audio');
    audio.className = 'music';
    audio.src = 'sounds/'+key.dataset.letterNoteFileName+ '.mp3';
    audio.play().then(() => audio.remove());
}

controls.forEach((input) => {
    input.addEventListener('input',() => {
        let value = input.value;
        let type; 
        switch(value){
            case 'letterNotes':  type = 'letterNote'; break;
            case 'keyboard': type = 'keyboard'; break;
            case 'none': type = '';  break;
        }
        keys.forEach((key) =>{
            key.textContent = key.dataset[type];
        })
    })
})

init();