let currentSong = new Audio();
let songs;
let currfolder;

async function getSongs(folder){
    currfolder = folder;
let a = await fetch(`http://localhost:8000/currsongs/${folder}/`)
let response = await a.text();
console.log(response)
let div = document.createElement("div")
    div.innerHTML = response;
    let as  = div.getElementsByTagName("a");
    console.log(as.length)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            // songs.push(element.href)
            songs.push(element.href.split("%5B")[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class = "invert" src="music.svg" alt="">
                            <div class="info">
                             <div>${decodeURIComponent(song)}</div> 
                                <div>Harry</div>
                            </div>
                            <div class= "playnow">
                                <span>Play Now</span>
                                <img class= "invert" src="play.svg" alt="">
                            </div>
         </li>` ;
    } 
    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })  
        // console.log(e.querySelector(".info>div").innerHTML)
    })
}
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track,pause = false)=>{
    // let audio = new Audio("/songs"+track)
    // let audio = new Audio(`${track}`)
    currentSong.src = `http://localhost:8000/currsongs/${currfolder}/%5B` + track
     if(!pause){
        currentSong.play()
    play.src = "pause.svg"
    }
    // let audio = new Audio("http://localhost:8000/%5B" + track)
    // let audio = new Audio(`http://localhost:8000/%5B${track}`)
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:8000/currsongs/`)
let response = await a.text();
let div = document.createElement("div")
    div.innerHTML = response;
    console.log(div)
    let anchors = div.getElementsByTagName("a")
    console.log(anchors)
    for(let b of anchors)
    {
        console.log(b.href)
    }
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
    if(e.href.includes("spotifyclone"))
            { 
                let folder = e.href.split("/").slice(-2)[0]
                //Get the metadata of the folder 
                let a = await fetch(`http://127.0.0.1:8000/currsongs/${folder}/info.json`)
                let response = await a.json();
                console.log(response)
                cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder = "${folder}" class="card">
                            <img src="http://127.0.0.1:8000/currsongs/${folder}/cover.jpg"
                                alt="">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`
            }
        }
//     Array.from(anchors).forEach(async e=>{
//         if(e.href.includes("spotifyclone"))
//         { 
//             let folder = e.href.split("/").slice(-2)[0]
//             //Get the metadata of the folder 
//             let a = await fetch(`http://127.0.0.1:8000/currsongs/${folder}/info.json`)
//             let response = await a.json();
//             console.log(response)
//             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder = ${folder} class="card">
//                         <img src="http://127.0.0.1:8000/currsongs/${folder}/cover.jpg"
//                             alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`
//         }
//    })
    //   Load the playlist whenever card is clicked
      Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            await getSongs(`${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
     }
     )

} 
async function main(){
    ///get the list of all songs
    await getSongs("ncs")
    playMusic(songs[0],true)
    console.log(songs)
    //Display all the albums on the page
    displayAlbums()
    ///show all the songs in the playlist
    //  <div>${song.replaceAll("%20"," ").replace("%5D"," ")}</div>
    // <div>${song.replace("%5D"," ")}</div>
    // let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // for(const song of songs){
    //     songUL.innerHTML = songUL.innerHTML + `<li>
    //                         <img class = "invert" src="music.svg" alt="">
    //                         <div class="info">
    //                          <div>${decodeURIComponent(song)}</div> 
    //                             <div>Harry</div>
    //                         </div>
    //                         <div class= "playnow">
    //                             <span>Play Now</span>
    //                             <img class= "invert" src="play.svg" alt="">
    //                         </div>
    //      </li>` ;
    // } 
    // //Attach an event listener to each song
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    //     e.addEventListener("click",element=>{
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML)
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML)
    //     })  
    //     // console.log(e.querySelector(".info>div").innerHTML)
    // })
    //Attach an event listener to play,next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    //Listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML =     `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })
    //Attach an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        // console.log(e.target.getBoundingClientRect().width,e.offsetX);
        // console.log((e.offsetX/e.target.getBoundingClientRect().width)*100);
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent)/100;
    })
    //Attach an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0";
    })
     //Attach an event listener to close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })
     //Add an event listener to previous
     previous.addEventListener("click",()=>{
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("%5B").slice(-1)[0])
        if(index-1>=0)
        {
            playMusic(songs[index-1])
        }
     })
     //Add an event listener to next
     next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Next clicked")
        let split = currentSong.src.split("%5B").slice(-1)[0]
        let index = songs.indexOf(split)
        if(index+1<songs.length)
        {
          playMusic(songs[index+1])
        }
     })
     //Add an event to volume
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting volume to",e.target.value,"/100")
    //    console.log(e,e.target,e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
     })
     //Load the playlist whenever card is clicked
    // Array.from(document.querySelector(".card")).forEach(e=>{
    //     console.log(e)
    //     e.addEventListener("click",async item=>{
    //         console.log(item, item.currentTarget.dataset)
    //         await getSongs(`${item.currentTarget.dataset.folder}`)
    //     })
    //  }
    //  ) 

    //Add an event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        if(e.target.src.endsWith("volume.svg")){
            e.target.src = "mute.svg"
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }   
        else{
            e.target.src = "volume.svg"
            currentSong.volume = 0.10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }    
    }) 

}
main()